import { cn } from "@/lib/utils";
import { TodoFormLoading } from "./_todo-form";
import { TodoListLoading } from "./_todo-list";

export default function TodosLoading() {
  return (
    <div className="grid gap-4 flex-1">
      <div className="pb-[64px]">
        <TodoListLoading />
      </div>
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 border-border border-t p-4 z-10",
          "bg-card",
        )}
      >
        <TodoFormLoading />
      </div>
    </div>
  );
}
