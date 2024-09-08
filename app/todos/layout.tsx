import { Suspense } from "react";
import { Sidebar } from "./_sidebar";
import { cn } from "@/lib/utils";
import { MenuBar } from "./_menu-bar";
import { validateRequest } from "./_actions";
import { redirect } from "next/navigation";

export default async function TodosLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen items-center justify-center px-0 sm:px-10">
      <Wrapper>
        <Sidebar
          currentUser={
            <Suspense fallback={<div>Loading...</div>}>
              <CurrentUser />
            </Suspense>
          }
        />
        <Main>{children}</Main>

        <Suspense fallback={<div>Loading...</div>}>
          <MenuBar
            currentUser={
              <Suspense fallback={<div>Loading...</div>}>
                <CurrentUser />
              </Suspense>
            }
          />
        </Suspense>
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

async function CurrentUser() {
  const currentUser = await getCurrentUser();

  return currentUser?.username;
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "bg-card w-full max-w-[var(--card-width)] relative grid overflow-hidden",
        "rounded-none h-screen",
        "sm:rounded-xl sm:border h-[var(--card-height)] sm:pl-[var(--sidebar-width)] pb-[var(--menu-bar-height)] sm:pb-0",
      )}
    >
      {children}
    </div>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col w-full relative">{children}</div>;
}
