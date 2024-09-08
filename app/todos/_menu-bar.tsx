"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InboxIcon, LogOutIcon, UserIcon } from "lucide-react";
import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "./_actions";

interface MenuBarProps {
  currentUser: React.ReactNode;
}

export function MenuBar(props: MenuBarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "h-[var(--menu-bar-height)] w-full sm:hidden",
        "absolute inset-x-0 bottom-0",
        "flex items-center gap-4 justify-between px-3",
        "bg-card border-t rounded-t-xl",
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={pathname.startsWith("/todos/user") ? "default" : "ghost"}
            size="sm"
            className="flex-1"
          >
            <UserIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">{props.currentUser}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout()}
            className="flex items-center justify-between"
          >
            Sign out{" "}
            <LogOutIcon className="ml-2 h-4 w-4 text-muted-foreground" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="sm" className="flex-1">
        <InboxIcon className="h-4 w-4 mr-2" />
        <span className="text-sm">Inbox</span>
      </Button>
    </div>
  );
}
