import { redirect } from "next/navigation";
import { validateRequest } from "../_actions";
import { db } from "@/lib/drizzle/db";
import { desc, eq } from "drizzle-orm";
import { todoTable } from "@/lib/drizzle/schema";
import Todos from "../_todos";

export default async function Today() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const todos = await db
    .select({
      id: todoTable.id,
      title: todoTable.title,
      completed: todoTable.completed,
      description: todoTable.description,
      createdAt: todoTable.createdAt,
    })
    .from(todoTable)
    .orderBy(desc(todoTable.createdAt))
    .where(eq(todoTable.userId, user.id))
    .limit(15);

  return <Todos todos={todos} />;
}
