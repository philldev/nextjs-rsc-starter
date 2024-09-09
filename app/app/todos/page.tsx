import { redirect } from "next/navigation";
import { validateRequest } from "../_actions";
import { db } from "@/lib/drizzle/db";
import { and, desc, eq, like } from "drizzle-orm";
import { todoTable } from "@/lib/drizzle/schema";
import { TodoForm } from "./_todo-form";
import { TodoList } from "./_todo-list";
import { TodosProvider } from "./_todos-optimistic";
import { TodosHeader } from "./_todos_header";
import { SEARCH_QUERY_KEY, TODOS_SELECT_LIMIT } from "./@constants";

function getSearchFilter(search: string | undefined) {
  if (search === undefined) return undefined;
  return like(todoTable.title, `%${search}%`);
}

export default async function Today({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  let searchQuery = searchParams[SEARCH_QUERY_KEY];

  let search: string | undefined;

  if (Array.isArray(searchQuery) && searchQuery.length > 0) {
    search = searchQuery[0];
  } else if (typeof searchQuery === "string") {
    search = searchQuery;
  }

  console.log(search);

  const todos = await db
    .select({
      id: todoTable.id,
      title: todoTable.title,
      completed: todoTable.completed,
      description: todoTable.description,
    })
    .from(todoTable)
    .orderBy(desc(todoTable.createdAt))
    .where(and(eq(todoTable.userId, user.id), getSearchFilter(search)))
    .limit(TODOS_SELECT_LIMIT);

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
