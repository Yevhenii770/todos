import { Issue } from '@/db/schema'

export type Status = 'backlog' | 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export type IssueWithUser = Issue & {
  user: {
    id: string
    email: string
  }
}
