import type { Todo } from "@/lib/drizzle/schema";
import { TodoItem } from "./_todo-item";
import { Skeleton } from "@/components/ui/skeleton";

interface TodoListProps {
  todos: Todo[];
}

export function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="p-3 flex flex-col space-y-4">
        <div className="py-2 h-8 flex items-center text-sm text-muted-foreground">
          No todos yet 😴
        </div>
      </div>
    );
  }

  return (
    <ul className="p-3 flex flex-col space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

export function TodoListLoading() {
  return (
    <ul className="p-3 space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-8 rounded-full py-2" />
      ))}
    </ul>
  );
}
