import { redirect } from "next/navigation";
import { validateRequest } from "../_actions";
import { db } from "@/lib/drizzle/db";
import { desc, eq } from "drizzle-orm";
import { todoTable } from "@/lib/drizzle/schema";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { TodoForm } from "./_todo-form";
import { TodoList } from "./_todo-list";
import { TodosProvider, PendingTransitionSpinner } from "./_todos-optimistic";
import { TodosHeader } from "./_todos_header";

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
    })
    .from(todoTable)
    .orderBy(desc(todoTable.createdAt))
    .where(eq(todoTable.userId, user.id))
    .limit(15);

  return (
    <TodosProvider initialTodos={todos}>
      <div className="flex flex-col flex-1 h-full">
        <TodosHeader />
        <TodoList />
        <TodoForm />
      </div>
    </TodosProvider>
  );
}
