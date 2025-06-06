export interface User {
  _id: string
  name: string
  email: string
  role: 'student' | 'employer' | 'admin'
  profile?: {
    education?: string
    skills?: string[]
    resume?: string
    profilePicture?: string
    contactNumber?: string
    location?: string
    website?: string
    bio?: string
    experience?: Experience[]
    companyLogo?: string
  }
  company?: {
    name: string
    description?: string
    website?: string
    logo?: string
    address?: string
    size?: string
    industry?: string
  }
  createdAt: string
}

interface Experience {
  title: string
  company: string
  location: string
  from: string
  to?: string
  current: boolean
  description?: string
}