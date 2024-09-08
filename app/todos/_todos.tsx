import { Todo } from "@/lib/drizzle/schema";
import { cn } from "@/lib/utils";
import { TodoForm } from "./_todo-form";
import { TodoList } from "./_todo-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PendingTransitionSpinner, TodosProvider } from "./_todos-optimistic";

export default function Todos({
  todos,
}: Readonly<{
  todos: Todo[];
}>) {
  return (
    <TodosProvider initialTodos={todos}>
      <div className="flex flex-col flex-1 h-full relative">
        <PendingTransitionSpinner />

        <ScrollArea
          className={cn(
            "sm:h-[calc(var(--card-height)-var(--todo-form-height))]",
            "h-[calc(100vh_-_var(--menu-bar-height)-30px)]",
          )}
        >
          <TodoList />
        </ScrollArea>
        <TodoForm />
      </div>
    </TodosProvider>
  );
}
