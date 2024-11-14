import { useSupabase } from 'app/provider/supabase'
import { RunAttendanceDeepLink } from './qrCode'

export interface AttendanceLogResponse {
  success: boolean
  message?: string
}

export const useLogAttendance = () => {
  const { supabase } = useSupabase()

  const logAttendance = async (data: RunAttendanceDeepLink): Promise<AttendanceLogResponse> => {
    try {
      const { runId, code } = data

      if (!supabase) {
        console.error('Supabase client not initialized')
        throw new Error('Supabase client not initialized')
      }

      // First verify the QR code matches the run
      const { data: run, error: runError } = await supabase
        .from('runs')
        .select('*')
        .eq('id', runId)
        .eq('qr_code', code)
        .single()

      if (runError) {
        console.error('Run query error:', runError)
        throw new Error(`Invalid QR code: ${runError.message}`)
      }

      if (!run) {
        console.error('No run found with provided ID and QR code')
        throw new Error('Invalid QR code: Run not found')
      }

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error('User auth error:', userError)
        throw new Error(`Authentication error: ${userError.message}`)
      }

      if (!user) {
        console.error('No user found in auth state')
        throw new Error('User not authenticated')
      }

      // Check if attendance already exists
      const { data: existingAttendance, error: checkError } = await supabase
        .from('run_attendance')
        .select('*')
        .eq('run_id', runId)
        .eq('user_id', user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" error
        console.error('Check existing attendance error:', checkError)
        throw new Error(`Failed to check attendance: ${checkError.message}`)
      }

      if (existingAttendance) {
        throw new Error('Attendance already logged')
      }

      // Log attendance
      const { error: attendanceError } = await supabase.from('run_attendance').insert({
        run_id: runId,
        user_id: user.id,
      })

      if (attendanceError) {
        console.error('Attendance insert error:', attendanceError)
        throw new Error('Failed to log attendance')
      }

      // Update user's total runs count
      await supabase.rpc('increment_user_runs', {
        user_id: user.id,
      })

      return { success: true }
    } catch (error) {
      console.error('Log attendance error:', error)
      throw error
    }
  }

  return { logAttendance }
}
