import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InboxIcon, UserIcon } from "lucide-react";

export function MenuBar() {
  return (
    <div
      className={cn(
        "h-[var(--menu-bar-height)] w-full sm:hidden",
        "absolute inset-x-0 bottom-0",
        "flex items-center gap-4 justify-between px-3",
        "bg-card border-t rounded-t-xl",
      )}
    >
      <Button variant="secondary" size="sm">
        <InboxIcon className="h-4 w-4 mr-2" />
        <span className="text-sm">Inbox</span>
      </Button>

      <Button variant="ghost" size="icon">
        <UserIcon className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
