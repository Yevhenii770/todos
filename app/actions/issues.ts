"use server"

import { db } from "@/db"
import { issues } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentUser } from "@/lib/dal"
import { z } from "zod"
import { mockDelay } from "@/lib/utils"
import { revalidateTag } from "next/cache"

// Define Zod schema for issue validation
const IssueSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),

  description: z.string().optional().nullable(),

  status: z.enum(["backlog", "todo", "in_progress", "done"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),

  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Please select a valid priority" }),
  }),
  userId: z.string().min(1, "User ID is required"),
})

export type IssueData = z.infer<typeof IssueSchema>

export type ActionResponse = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  error?: string
}

export const createIssue = async (data: IssueData): Promise<ActionResponse> => {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: "Unauthorized access",
        error: "Unauthorized",
      }
    }

    // Validate with Zod
    const validationResult = IssueSchema.safeParse(data)
    if (!validationResult.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Create issue with validated data
    const validatedData = validationResult.data

    await db.insert(issues).values({
      title: validatedData.title,
      description: validatedData.description || null,
      status: validatedData.status,
      priority: validatedData.priority,
      userId: validatedData.userId,
    })

    return { success: true, message: "Issue created successfully" }
  } catch (error) {
    console.error("Error creating issue:", error)
    return {
      success: false,
      message: "An error occurred while creating the issue",
      error: "Failed to create issue",
    }
  }
}

export const updateIssue = async (id: number, data: Partial<IssueData>) => {
  const user = await getCurrentUser()
  if (!user) {
    return {
      success: false,
      message: "Unauthorized access",
      error: "Unauthorized",
    }
  }

  const updateSchema = IssueSchema.partial()
  const validationResult = updateSchema.safeParse(data)

  if (!validationResult.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validationResult.error.flatten().fieldErrors,
    }
  }
  const validatedData = validationResult.data
  const updateData: Record<string, unknown> = {}

  if (validatedData.title !== undefined) updateData.title = validatedData.title
  if (validatedData.description !== undefined)
    updateData.description = validatedData.description
  if (validatedData.status !== undefined)
    updateData.status = validatedData.status
  if (validatedData.priority !== undefined)
    updateData.priority = validatedData.priority

  await db.update(issues).set(updateData).where(eq(issues.id, id))
  return {
    success: true,
    message: "Issue updated successfully",
  }
}

export async function deleteIssue(id: number) {
  try {
    // Security check - ensure user is authenticated
    await mockDelay(700)
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    // Delete issue
    await db.delete(issues).where(eq(issues.id, id))

    return { success: true, message: "Issue deleted successfully" }
  } catch (error) {
    console.error("Error deleting issue:", error)
    return {
      success: false,
      message: "An error occurred while deleting the issue",
      error: "Failed to delete issue",
    }
  }
}
