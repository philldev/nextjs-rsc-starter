"use client";

import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Image from "next/image";
import { PAGES } from "./@constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./_mode-toggle";
import { LogOutIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { logout } from "./@actions";
import { getHeaderTitle } from "./@utils";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface HeaderProps {
  username: string;
}

export function Header(props: HeaderProps) {
  const pathname = usePathname();
  const title = getHeaderTitle(pathname);
  const [, startTransition] = useTransition();

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
    <header className="flex-grow-0 h-[var(--header-height)] w-full border-b border-border flex items-center gap-4 px-4 sm:hidden">
      <div className="flex items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              variant="outline"
            >
              <HamburgerMenuIcon className="h-4 w-4" suppressHydrationWarning />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <VisuallyHidden>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Sidebar menu</SheetDescription>
            </VisuallyHidden>

            <nav className="py-4 flex flex-col gap-4 h-full">
              <div>
                <Link href="/app" className="font-bold">
                  Listapp
                </Link>
              </div>

              <hr className="border-border" />

              <div className="flex flex-col gap-2 flex-1">
                <ul className="-mx-3 space-y-1">
                  {PAGES.map((page) => (
                    <li key={page.href}>
                      <Link
                        href={page.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 h-10 text-sm transition-all font-semibold",
                          pathname.includes(page.href)
                            ? "text-primary bg-muted"
                            : "text-muted-foreground bg-transparent hover:bg-muted/50 hover:text-primary ",
                        )}
                      >
                        <page.icon className="h-4 w-4" />
                        {page.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border-border" />
              <ModeToggle />
            </nav>
          </SheetContent>
        </Sheet>

        <div className="h-8 flex items-center gap-1 w-max font-bold text-sm text-foreground/90">
          <span>{title}</span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full h-8 w-8 text-muted-foreground"
          >
            <Image
              src={`https://avatar.iran.liara.run/username?username=${props.username}`}
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="text-xs text-muted-foreground flex items-center gap-2">
            <span>👋</span>
            {props.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center justify-between"
          >
            Sign out
            <LogOutIcon className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
