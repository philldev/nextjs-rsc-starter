"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ReloadIcon } from "@radix-ui/react-icons";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { SEARCH_QUERY_KEY } from "./@constants";
import { useTodosOptimistic } from "./_todos-optimistic";

export function TodosHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { pending, startTransition } = useTodosOptimistic();

  const handleRefresh = () => {
    startTransition(() => router.refresh());
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (value?.trim() === "") {
      newSearchParams.delete(SEARCH_QUERY_KEY);
    } else {
      newSearchParams.set(SEARCH_QUERY_KEY, value);
    }

    startTransition(() =>
      router.replace(`${pathname}?${newSearchParams.toString()}`),
    );
  }, 500);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchQuery = searchParams.get(SEARCH_QUERY_KEY);

  // Reset the input value when the search is cleared
  useEffect(() => {
    if (inputRef.current) {
      if (searchQuery === null) {
        inputRef.current.value = "";
      }
    }
  }, [searchQuery]);

  return (
    <header className="p-4 flex items-center gap-4 sticky top-0 z-10 bg-card pb-4">
      <div className="flex-1 relative flex items-center">
        <SearchIcon className="h-4 w-4 absolute left-3 text-muted-foreground" />
        <Input
          ref={inputRef}
          defaultValue={searchParams.get("search")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 h-8 pl-10 text-xs"
          placeholder="Search"
        />
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
