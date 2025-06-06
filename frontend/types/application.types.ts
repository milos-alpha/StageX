// src/types/application.types.ts
export type ApplicationStatus = 
  | 'pending'
  | 'reviewed'
  | 'shortlisted'
  | 'rejected'
  | 'hired'

export interface Application {
  _id: string
  job: {
    _id: string
    title: string
    company: {
      _id: string
      name: string
    }
  }
  applicant: {
    _id: string
    name: string
    email: string
    profile?: {
      resume?: string
      profilePicture?: string
    }
  }
  resume: string
  coverLetter?: string
  status: ApplicationStatus
  appliedAt: string
  notes?: string
}