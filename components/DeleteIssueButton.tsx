'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Button from './ui/Button'
import { Trash2Icon } from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteIssue } from '@/app/actions/issues'

interface DeleteIssueButtonProps {
  id: number
}

export default function DeleteIssueButton({ id }: DeleteIssueButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        const result = await deleteIssue(id)

        if (!result.success) {
          throw new Error(result.error || 'Failed to delete issue')
        }

        toast.success('Issue deleted successfully')
        router.push('/dashboard')
        router.refresh()
      } catch (error) {
        toast.error('Failed to delete issue')
        console.error('Error deleting issue:', error)
      }
    })
  }

  if (showConfirm) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          isLoading={isPending}
        >
          Delete
        </Button>
      </div>
    )
  }

  return (
    <Button variant="outline" size="sm" onClick={() => setShowConfirm(true)}>
      <span className="flex items-center">
        <Trash2Icon size={16} className="mr-1" />
        Delete
      </span>
    </Button>
  )
}
