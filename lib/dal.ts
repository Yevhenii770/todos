import { db } from "@/db"
import { getSession } from "./auth"
import { eq } from "drizzle-orm"
import { cache } from "react"
import { issues, users } from "@/db/schema"
import { mockDelay } from "./utils"
import { unstable_cacheTag as cacheTag } from "next/cache"

//Get current user
export const getCurrentUser = async () => {
  const session = await getSession()
  if (!session) {
    return null
  }
  try {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.email, session.userId))

    return results[0] || null
  } catch (e) {
    console.error(e)
    return null
  }
}

// Get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    return user
  } catch (e) {
    console.error(e)
    return null
  }
}
