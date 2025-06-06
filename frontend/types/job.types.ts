export interface Job {
  _id: string
  title: string
  description: string
  requirements: string[]
  skills: string[]
  type: 'full-time' | 'part-time' | 'internship' | 'contract' | 'remote'
  location: string
  salary?: number
  isActive: boolean
  postedBy: string
  company: {
    _id: string
    name: string
    profile?: {
      companyLogo?: string
    }
  }
  createdAt: string
  deadline: string
  applicants: number
  applications?: Application[]
}