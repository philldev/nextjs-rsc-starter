"use client";

import { TodoItem } from "./_todo-item";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodosOptimistic } from "./_todos-optimistic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SEARCH_QUERY_KEY } from "./@constants";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function TodoList() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { todos } = useTodosOptimistic();

  const searchQuery = searchParams.get(SEARCH_QUERY_KEY);
  const isSearching = searchQuery !== null && searchQuery !== "";

  const handleClearSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(SEARCH_QUERY_KEY);
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="p-4 ">
      {isSearching ? (
        <div className="py-2 h-8 flex items-center text-sm text-muted-foreground mb-4 gap-4">
          <Badge
            variant="outline"
            className="flex items-center gap-2 rounded-full"
          >
            <span>🔎</span>
            <span>Searching for &ldquo;{searchQuery}&rdquo;</span>
            <button className="underline" onClick={handleClearSearch}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      ) : null}

      {!isSearching && todos.length === 0 ? (
        <div className="py-2 h-8 flex items-center text-sm text-muted-foreground">
          No todos yet 😴
        </div>
      ) : null}
      {isSearching && todos.length === 0 ? (
        <div className="py-2 h-8 flex items-center text-sm text-muted-foreground">
          No todos found for &ldquo;{searchQuery}&rdquo; 😴
        </div>
      ) : null}
      <ul className="flex flex-col space-y-3">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}

export function TodoListLoading() {
  return (
    <ul className="p-4 space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="w-full h-8 rounded-full py-2" />
      ))}
    </ul>
  );
}
