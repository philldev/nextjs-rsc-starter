"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTodo } from "./@actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateTodoSchema } from "./@schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTodosOptimistic } from "./_todos-optimistic";
import { v4 as uuidv4 } from "uuid";

type FormFields = z.infer<typeof CreateTodoSchema>;

export function TodoForm() {
  const { dispatch, startTransition } = useTodosOptimistic();

  const [state, action] = useFormState(createTodo, {
    fields: {
      title: "",
    },
  });

  const form = useForm<FormFields>({
    resolver: zodResolver(CreateTodoSchema),
    defaultValues: {
      title: "",
      ...state.fields,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  useEffect(() => {
    form.setValue("title", state.fields.title, {
      shouldDirty: false,
    });
  }, [state.fields]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        className={cn(
          "flex flex-col group gap-2 items-end p-3 border-border border rounded-xl ring-1 ring-transparent",
          "absolute bg-card inset-x-3 bottom-3 z-10",
          "transition-all duration-300 ease-in-out",
          focused && "ring-ring",
        )}
        action={action}
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(({ title }) => {
            form.reset();
            const id = uuidv4();
            const formData = new FormData(formRef.current!);
            formData.set("id", id);
            startTransition(() =>
              dispatch({
                type: "add",
                payload: {
                  title,
                  id,
                },
              }),
            );
            action(formData);
          })(evt);
        }}
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  onFocus={handleFocus}
                  placeholder="Create a new todo..."
                  className="pl-0 border-0 focus-visible:ring-transparent text-xs h-8"
                  {...field}
                  onBlur={handleBlur}
                />
              </FormControl>
              <FormMessage className="text-[.7rem] mt-0" />
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="relative"
      variant="secondary"
      size="sm"
      type="submit"
      disabled={pending}
    >
      <Loader
        data-hidden={!pending}
        className={cn(
          "w-4 h-4 animate-[spin_3.5s_linear_infinite] text-muted-foreground data-[hidden=true]:hidden absolute",
        )}
      />
      <span
        className={cn("data-[hidden=true]:opacity-0")}
        data-hidden={pending}
      >
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
