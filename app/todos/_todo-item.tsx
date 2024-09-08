"use client";

import { Button } from "@/components/ui/button";
import { Todo } from "@/lib/drizzle/schema";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { deleteTodo, toggleTodo, updateTodoAction } from "./_actions";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateTodoSchema } from "./_schemas";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useTodosOptimistic } from "./_todos-optimistic";

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
        "flex items-center gap-2 -mr-2",
        "animate-in fade-in duration-500",
      )}
    >
      <Checkbox
        onCheckedChange={handleToggle}
        id={todo.id}
        checked={todo.completed}
      />
      {isEditing ? (
        <EditTodoForm todo={todo} onCancel={handleCancelEdit} />
      ) : (
        <>
          <label
            className={cn(
              "text-ellipsis overflow-hidden",
              "whitespace-nowrap",
              "text-sm flex-1 pl-[13px] pt-[1px]",
              todo.completed && "line-through text-muted",
            )}
            htmlFor={todo.id}
          >
            {todo.title}
          </label>

          <span className="text-muted-foreground text-xs">
            {todo.createdAt.toLocaleDateString()}
          </span>

          <Button
            onClick={handleEdit}
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 opacity-50"
            aria-label="Edit todo title"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 opacity-50"
            aria-label="Delete todo"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  const formRef = useRef<HTMLFormElement>(null);

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
        className="flex gap-2 flex-1 ease-in-out"
      >
        <input type="hidden" name="id" defaultValue={todo.id} />
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  {...field}
                  ref={inputRef}
                  name="title"
                  placeholder="Title"
                  className="flex-1 h-8"
                />
              </FormControl>
            </FormItem>
          )}
        />
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
      </form>
    </Form>
  );
}
