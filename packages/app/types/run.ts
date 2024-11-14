// Base run interface with common properties
export interface Run {
  id: number
  date: Date
  time: string
  distance: number
  target_pace: string | null
  route?: string | null
  meetup_location: string | null
  qr_code: string
  status: 'scheduled' | 'completed'
  created_at?: string
  updated_at?: string
}

// Interface for instructor user data
export interface InstructorUser {
  id: string
  first_name: string
  last_name: string
  profile_image_url?: string
}

// Interface specifically for instructor-related run operations
export interface InstructorRun extends Run {
  run_instructors: {
    instructor_id: string
    users?: InstructorUser
  }[]
}

// Type for creating a new run
export type RunCreate = Omit<Run, 'id' | 'created_at' | 'updated_at'> & {
  instructor_ids: string[] // Array of instructor UUIDs
}

// Type for updating an existing run
export type RunUpdate = Partial<Omit<RunCreate, 'qr_code'>>

// Type for the edit run modal
export type EditRunData = RunCreate & { id: number }
