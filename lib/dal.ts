import { db } from "@/db"
import { getSession } from "./auth"
import { eq } from "drizzle-orm"
import { cache } from "react"
import { issues, users } from "@/db/schema"
import { mockDelay } from "./utils"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { ca } from "zod/locales"

//Get current user
export const getCurrentUser = cache(async () => {
  const session = await getSession()
  if (!session) return null

  await mockDelay(700)
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
    return result[0] || null
  } catch (e) {
    console.error("Error getting user by ID:", e)
    return null
  }
})

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
export async function getIssues() {
  "use cache"
  cacheTag("issues")
  try {
    const result = await db.query.issues.findMany({
      with: {
        user: true,
      },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    })
    return result
  } catch (error) {
    console.error("Error fetching issues:", error)
    throw new Error("Failed to fetch issues")
  }
}

export async function getIssue(id: number) {
  try {
    const issue = await db.query.issues.findFirst({
      where: eq(issues.id, id),
      with: {
        user: true,
      },
    })
    return issue
  } catch (e) {
    console.error("Error fetching issue:", e)
    return null
  }
}
