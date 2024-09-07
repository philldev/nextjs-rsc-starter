"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTodo } from "./_actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function TodoForm() {
  const [state, action] = useFormState(createTodo, {
    fields: {
      title: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (inputRef.current && state.error) {
    inputRef.current.focus();
  }

  if (formRef.current && state.success) {
    formRef.current.reset();
  }

  return (
    <form
      ref={formRef}
      className={cn(
        "flex flex-col sm:flex-row gap-2 items-end sm:items-center p-3 border-border border sm:border-x-0 sm:border-b-0 rounded-xl sm:rounded-none",
        "absolute sm:static bg-card inset-x-3 bottom-3",
      )}
      action={action}
    >
      <Input
        ref={inputRef}
        placeholder={state.error ?? "Create a new todo..."}
        name="title"
        defaultValue={state.fields.title}
        className={cn(
          "h-8 w-full rounded-full border-transparent",
          "focus-visible:ring-transparent",
        )}
      />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="rounded-full w-[120px]"
      size="sm"
      type="submit"
      disabled={pending}
    >
      {pending ? "Creating..." : "Create"}
    </Button>
  );
}

export function TodoFormLoading() {
  return (
    <form className="flex gap-2">
      <div className="flex-1 h-8" />
      <Skeleton className="h-8 w-[109px] rounded-full" />
    </form>
  );
}
