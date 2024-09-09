"use client";

import { Button } from "@/components/ui/button";
import { Todo } from "@/lib/drizzle/schema";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { deleteTodo, toggleTodo, updateTodoAction } from "./@actions";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateTodoSchema } from "./@schemas";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useTodosOptimistic } from "./_todos-optimistic";
import { Separator } from "@/components/ui/separator";

export function TodoItem({ todo }: { todo: Todo }) {
  const { dispatch, startTransition } = useTodosOptimistic();

  async function handleToggle() {
    startTransition(() =>
      dispatch({
        type: "update",
        id: todo.id,
        payload: {
          completed: !todo.completed,
        },
      }),
    );

    toggleTodo(todo);
  }

  async function handleDelete() {
    startTransition(() =>
      dispatch({
        type: "delete",
        id: todo.id,
      }),
    );

    deleteTodo(todo);
  }

  const [isEditing, setIsEditing] = useState(todo.editing);

  async function handleEdit() {
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  return (
    <li
      className={cn(
        "flex items-start gap-2 -mr-2 min-h-10 w-full group",
        "animate-in fade-in duration-500",
        "relative",
      )}
    >
      <Checkbox
        onCheckedChange={handleToggle}
        id={todo.id}
        checked={todo.completed}
        className="mt-[5px]"
      />
      {isEditing ? (
        <EditTodoForm todo={todo} onCancel={handleCancelEdit} />
      ) : (
        <>
          <div className="pl-2 md:pr-16">
            <label
              className={cn(
                "text-foreground/80",
                todo.completed && "line-through text-muted-foreground/80",
              )}
              htmlFor={todo.id}
            >
              {todo.title}
            </label>
          </div>
          <div
            className={cn(
              "absolute right-0 -top-1 bg-card p-1 rounded-md border border-border w-max h-max flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleEdit}
            >
              <Pencil className="h-4 w-4" aria-hidden />
              <span className="sr-only">Edit</span>
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </>
      )}
    </li>
  );
}

type FormFields = z.infer<typeof UpdateTodoSchema>;

function EditTodoForm({
  todo,
  onCancel,
}: {
  todo: Todo;
  onCancel: () => void;
}) {
  const { dispatch } = useTodosOptimistic();

  const [state, action] = useFormState(updateTodoAction, {
    fields: {},
  });

  const form = useForm<FormFields>({
    resolver: zodResolver(UpdateTodoSchema),
    defaultValues: {
      title: todo.title,
      id: todo.id,
      ...state.fields,
    },
  });

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Error",
        description: state.error,
      });
    }
  }, [state.error]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef.current]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [form.watch("title")]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Form {...form}>
      <form
        action={action}
        ref={formRef}
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(({ id, title }) => {
            dispatch({
              type: "update",
              id,
              payload: {
                title,
              },
            });
            onCancel();
            action(new FormData(formRef.current!));
          })(evt);
        }}
        className="flex gap-2 flex-1 ease-in-out flex-col p-3 bg-card rounded-xl ring-1 ring-ring/50"
      >
        <input type="hidden" name="id" defaultValue={todo.id} />
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <textarea
                  {...field}
                  rows={1}
                  ref={textareaRef}
                  name="title"
                  placeholder="Title"
                  className="flex-1 h-8 text-[16px] w-full resize-none bg-transparent outline-0 ring-0 border-0 shadow-none"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-2 items-center justify-end">
          <Button
            className="animate-in fade-in duration-500"
            type="submit"
            size="sm"
            variant="secondary"
          >
            Save
          </Button>
          <Button
            className="animate-in fade-in duration-500"
            onClick={onCancel}
            type="button"
            size="sm"
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
