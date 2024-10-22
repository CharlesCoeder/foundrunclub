// Base run interface with common properties
export interface Run {
  id: number
  date: Date
  time: string
  distance: number
  target_pace: string
  route?: string
  meetup_location: string
  qr_code: string
  status: string
}

// Interface specifically for instructor-related run operations
export interface InstructorRun extends Run {
  run_instructors?: {
    instructor_id: string
  }[]
}

// Type for creating a new run
export type RunCreate = Omit<Run, 'id'>
