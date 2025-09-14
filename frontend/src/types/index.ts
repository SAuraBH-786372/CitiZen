export type UserRole = 'Citizen' | 'Official'

export interface User {
  _id: string
  name: string
  email: string
  role: UserRole
  token?: string
}

export interface Issue {
  _id: string
  title: string
  description: string
  category: string
  status: 'Open' | 'In Progress' | 'Resolved'
  location: { lat: number; lng: number }
  address?: string
  imageUrl?: string
  upvotes: number
  commentsCount: number
  createdBy: Pick<User, '_id' | 'name'>
  createdAt: string
  assignedTo?: string | null
  hasUpvoted?: boolean
}

export interface Comment {
  _id: string
  text: string
  issueId: string
  author: Pick<User, '_id' | 'name'>
  createdAt: string
}

export interface Notification {
  _id: string
  message: string
  read: boolean
  createdAt: string
}