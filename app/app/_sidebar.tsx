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
  username: string;
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
      <Link href="/app" className="flex items-center gap-2">
        <div className="dark:bg-background/60 p-1 w-max flex items-center bg-primary border border-border rounded-xl">
          <svg
            className="dark:text-primary text-secondary relative top-[1px]"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 1024 1024"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M495 801c-.901-.582-1.025-.975-.309-.985.655-.008 1.47.435 1.809.985.767 1.242.421 1.242-1.5 0zm12.564-1.104c.316-.51.965-.687 1.444-.391.478.295 1.28-.197 1.782-1.093.83-1.485.967-1.488 1.525-.033.337.878.292 1.55-.101 1.49-.393-.058-.939-.018-1.214.09-1.912.745-3.912.708-3.436-.063zM500 795.607c0-.216.698-.661 1.552-.989.89-.341 1.291-.173.94.393-.586.95-2.492 1.406-2.492.596zm-13.397-5.44c-.283-.459.12-.834.897-.834s1.18.375.897.834c-.283.458-.687.833-.897.833-.21 0-.614-.375-.897-.833zm25.037-79.917l-169.86-.256.36-249.996L342.5 210l10-.138c5.5-.075 43.525-.413 84.5-.75l74.5-.613-.347 183.5c-.191 100.925-.036 187.663.343 192.75l.69 9.25H682v58.5c0 32.175-.112 58.389-.25 58.253-.138-.136-76.687-.362-170.11-.503zm-78.372-53.786l3.732-2.536V459.464c0-194.4 0-194.465-2.04-196.504-4.439-4.439-10.048-5.043-14.326-1.544l-2.866 2.344.077 192.65c.085 213.3-.492 195.403 6.46 200.34 3.973 2.823 4.408 2.809 8.963-.286zM605.5 298.279c-7.579-.735-15.346-2.674-19.847-4.955-11.306-5.729-19.918-18.575-21.961-32.757-1.873-12.998 2.993-26.87 13.094-37.332 8.117-8.407 13.808-10.471 30.37-11.015 14.623-.48 20.67.8 28.443 6.021 5.65 3.795 11.497 11.727 14.437 19.586 2.575 6.88 2.819 18.686.52 25.173-3.459 9.76-6.917 17-8.12 17-.696 0-2.641 2.238-4.324 4.972-2.366 3.846-4.369 5.628-8.836 7.863-9.029 4.518-16.257 6.173-23.776 5.444zm37.579-15.862c.048-1.165.285-1.402.604-.604.289.721.253 1.584-.079 1.916-.332.332-.568-.258-.525-1.312z"
            ></path>
          </svg>
        </div>
        <span className="text-muted-foreground text-lg">Listapp</span>
      </Link>
      <hr className="border-border" />
      <nav className="flex-1">
        <ul className="flex flex-col gap-1">
          {PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className={cn(
                  "flex items-center gap-4",
                  "px-3 h-11 -mx-2",
                  "rounded-lg font-semibold",
                  "transition-all",
                  "hover:text-primary",
                  pathname.includes(page.href)
                    ? "text-primary dark:bg-muted/50 bg-muted/80"
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
          <span className="text-muted-foreground">{props.username}</span>

          <Image
            src={`https://avatar.iran.liara.run/username?username=${props.username}`}
            width={22}
            height={22}
            alt="Avatar"
            className="overflow-hidden rounded-full border border-border"
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
