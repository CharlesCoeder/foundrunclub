import { useState, useEffect } from 'react'
import { useAuth } from 'app/utils/auth/useAuth'
import { useFetchUserAttendance } from 'app/utils/attendance/fetchUserAttendance'

export const useChatEligibility = () => {
  const [isEligible, setIsEligible] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { fetchAttendedRuns } = useFetchUserAttendance()

  useEffect(() => {
    const checkEligibility = async () => {
      if (!user) {
        setIsEligible(false)
        setLoading(false)
        return
      }

      try {
        const attendedRuns = await fetchAttendedRuns(user.id)
        setIsEligible(attendedRuns.length > 0)
      } catch (error) {
        console.error('Error checking chat eligibility:', error)
        setIsEligible(false)
      } finally {
        setLoading(false)
      }
    }

    checkEligibility()
  }, [user])

  return { isEligible, loading }
}
