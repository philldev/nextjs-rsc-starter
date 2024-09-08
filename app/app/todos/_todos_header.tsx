"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { SearchIcon } from "lucide-react";
import { useTodosOptimistic } from "./_todos-optimistic";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function TodosHeader() {
  const { pending, startTransition } = useTodosOptimistic();
  const router = useRouter();

  const handleRefresh = () => {
    startTransition(() => router.refresh());
  };

  return (
    <header className="p-4 pb-0 flex items-center gap-4">
      <div className="flex-1 relative flex items-center">
        <SearchIcon className="h-4 w-4 absolute left-3" />
        <Input className="flex-1 h-8 pl-10" placeholder="Search" />
      </div>

      <Button
        disabled={pending}
        onClick={handleRefresh}
        size="icon"
        variant="outline"
        className={cn("h-8 w-8", pending && "bg-muted")}
      >
        <ReloadIcon
          className={cn(
            pending && "animate-[spin_.5s_linear_infinite]",
            "h-3 w-3",
          )}
        />
      </Button>
    </header>
  );
}
