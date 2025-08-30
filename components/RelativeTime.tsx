"use client"

import { formatDistanceToNow } from "date-fns"

export default function RelativeTime({ date }: { date: Date | string }) {
  const parsedDate = typeof date === "string" ? new Date(date) : date

  return <span>{formatDistanceToNow(parsedDate, { addSuffix: true })}</span>
}
