"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTodo } from "./_actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";

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

  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    e.target.value = "";
  };

  return (
    <form
      ref={formRef}
      className={cn(
        "flex flex-col group gap-2 items-end p-3 border-border border rounded-xl",
        "absolute bg-card inset-x-3 bottom-3",
        "transition-all duration-300 ease-in-out",
      )}
      action={action}
    >
      <Input
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={inputRef}
        placeholder={state.error ?? "Create a new todo..."}
        name="title"
        defaultValue={state.fields.title}
        className={cn(
          "h-8 w-full border-transparent px-0",
          "focus-visible:ring-transparent",
        )}
      />
      <SubmitButton focused={focused} />
    </form>
  );
}

function SubmitButton(props: { focused: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="secondary"
      className={cn(props.focused ? "opacity-100" : "opacity-0", "w-[120px]")}
      size="sm"
      type="submit"
      disabled={pending}
    >
      <Loader
        data-hidden={!pending}
        className={cn(
          "w-4 h-4 animate-[spin_3.5s_linear_infinite] text-muted-foreground data-[hidden=true]:hidden",
        )}
      />
      <span className={cn("data-[hidden=true]:hidden")} data-hidden={pending}>
        Create
      </span>
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
