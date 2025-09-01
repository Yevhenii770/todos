import { db } from "@/db"
import { issues } from "@/db/schema"
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/dal"

export const GET = async (req: NextRequest) => {
  try {
    const issues = await db.query.issues.findMany({})
    return NextResponse.json({ data: issues })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { message: "Failed to fetch issues" },
      { status: 500 }
    )
  }
}

export const POST = async (req: NextResponse) => {
  try {
    const user = await getCurrentUser()
    const newIsueData = await req.json()

    const [newIsue] = await db
      .insert(issues)
      .values({ userId: user?.id, ...newIsueData })
      .returning()

    return NextResponse.json({ data: newIsue })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { message: "Failed to create issue" },
      { status: 500 }
    )
  }
}
