"use client";

import { Button } from "@/components/ui/button";
import { InboxIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./_actions";
import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";

const paths = ["inbox"] as const;

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
      <div className="grid gap-1">
        {paths.map((date) => (
          <Button
            key={date}
            variant={pathname.includes(date) ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-between rounded-full"
            asChild
          >
            <Link href={date}>
              {date}
              <InboxIcon className="h-4 w-4 text-muted-foreground" />
            </Link>
          </Button>
        ))}
      </div>
      <div className="grid gap-2">
        <div className="w-full flex text-xs px-3 justify-between rounded-full text-muted-foreground">
          {props.currentUser}
        </div>

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
