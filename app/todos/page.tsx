import { redirect } from "next/navigation";
import { validateRequest } from "./_actions";

export default async function TodosPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  redirect("/todos/inbox");
}
