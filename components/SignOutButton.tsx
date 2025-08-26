'use client'

import { LogOutIcon } from 'lucide-react'
import { useTransition } from 'react'
import { signOut } from '@/app/actions/auth'

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut()
    })
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isPending}
      className="flex items-center w-full px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
    >
      <LogOutIcon size={20} className="mr-2" />
      <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
    </button>
  )
}
