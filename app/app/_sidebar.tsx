"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon, LaptopIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./@actions";
import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import * as React from "react";
import { PAGES } from "./@constants";
import { ModeToggle } from "./_mode-toggle";

interface SidebarProps {
  currentUser: React.ReactNode;
}

export function Sidebar(props: SidebarProps) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      const result = await logout();
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="hidden w-[var(--sidebar-width)] p-4 px-3 border-r border-border absolute left-0 top-0 bottom-0 flex-col justify-between sm:flex">
      <div>
        <div className="w-full mb-3 flex text-xs px-3 h-8 items-center text-muted-foreground border-border border-b rounded-none">
          {props.currentUser}
        </div>

        <div className="grid gap-1">
          {PAGES.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 h-8 text-xs transition-all hover:text-primary",
                pathname.includes(page.href)
                  ? "text-primary bg-muted"
                  : "text-muted-foreground bg-transparent",
              )}
            >
              <page.icon className="h-4 w-4" />
              {page.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid gap-2 border-border border-t pt-3">
        <ModeToggle />

        <Button
          disabled={pending}
          size="sm"
          variant="ghost"
          className="w-full justify-between rounded-full text-foreground/90"
          onClick={handleLogout}
        >
          Sign out
          <LogOutIcon className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
