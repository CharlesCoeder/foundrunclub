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
  status: 'scheduled' | 'completed'
  max_participants?: number
  created_at?: string
  updated_at?: string
}

// Interface specifically for instructor-related run operations
export interface InstructorRun extends Run {
  run_instructors?: {
    instructor_id: string
  }[]
}

// Type for creating a new run
export type RunCreate = Omit<Run, 'id' | 'created_at' | 'updated_at'> & {
  instructor_ids: string[] // Array of instructor UUIDs
}

// Type for updating an existing run
export type RunUpdate = Partial<Omit<RunCreate, 'qr_code'>>
