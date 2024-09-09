import { Suspense } from "react";
import { Sidebar } from "./_sidebar";
import { cn } from "@/lib/utils";
import { validateRequest } from "./@actions";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "./_header";

export default async function TodosLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="flex h-[100svh] w-screen items-center justify-center px-0 sm:px-10 bg-gradient-to-b dark:from-yellow-900/50 dark:to-blue-900/80 from-orange-800 to-blue-800">
      <Wrapper>
        <Header username={currentUser.username} />
        <Sidebar username={currentUser.username} />
        <Main>{children}</Main>
      </Wrapper>
    </div>
  );
}

async function getCurrentUser() {
  const result = await validateRequest();

  if (!result.user) {
    redirect("/login");
  }

  return result.user;
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "w-full max-w-[var(--card-width)] relative overflow-hidden bg-background/90 dark:bg-background/60 dark:sm:bg-background/50 backdrop-blur",
        "rounded-none h-screen",
        "sm:rounded-xl sm:border h-[var(--card-height)] sm:pl-[var(--sidebar-width)] pb-[var(--menu-bar-height)] sm:pb-0",
      )}
    >
      {children}
    </div>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className="flex flex-col w-full h-full relative bg-muted/10">
      {children}
    </ScrollArea>
  );
}
