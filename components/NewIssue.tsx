import { redirect } from "next/navigation"
import IssueForm from "./IssueForm"
import { getCurrentUser } from "@/lib/dal"

const NewIssue = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  return <IssueForm userId={user.id} />
}

export default NewIssue
