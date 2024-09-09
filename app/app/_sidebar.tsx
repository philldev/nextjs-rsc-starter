"use client";

import { Button, buttonVariants } from "@/components/ui/button";
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
import Image from "next/image";

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
    <aside
      className={cn(
        "absolute left-0 top-0 bottom-0",
        "w-[var(--sidebar-width)] py-4 px-4",
        "hidden sm:flex flex-col gap-3",
        "border-r border-border",
      )}
    >
      <div className="px-3">
        <Link href="/app" className="font-bold">
          Listapp
        </Link>
      </div>
      <hr className="border-border" />
      <nav className="flex-1">
        <ul className="flex flex-col gap-1">
          {PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className={cn(
                  "flex items-center gap-2",
                  "px-2 h-8 -mx-2",
                  "rounded-lg text-xs",
                  "transition-all",
                  "hover:text-primary",
                  pathname.includes(page.href)
                    ? "text-primary bg-muted"
                    : "text-muted-foreground bg-transparent",
                )}
              >
                <page.icon className="h-4 w-4" />
                {page.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <hr className="border-border" />
      <div className="grid gap-2">
        <div
          className={cn(
            buttonVariants({
              variant: "ghost",
              size: "sm",
            }),
            "w-full justify-between",
            "rounded-full text-foreground/90",
            "hover:bg-transparent",
          )}
        >
          <span className="text-muted-foreground">{props.currentUser}</span>

          <Image
            src="https://avatar.iran.liara.run/public"
            width={22}
            height={22}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </div>

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
    </aside>
  );
}
