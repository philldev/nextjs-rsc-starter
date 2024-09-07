"use client";

import { Button } from "@/components/ui/button";
import { Todo } from "@/lib/drizzle/schema";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { deleteTodo, toggleTodo, updateTodoAction } from "./_actions";
import { useEffect, useRef, useState, useTransition } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useFormState } from "react-dom";
import { toast } from "@/hooks/use-toast";

export function TodoItem({ todo }: { todo: Todo }) {
  const [_, startTransition] = useTransition();

  async function handleToggle() {
    startTransition(() => {
      toggleTodo(todo);
    });
  }

  async function handleDelete() {
    startTransition(() => {
      deleteTodo(todo);
    });
  }

  const [isEditing, setIsEditing] = useState(false);

  async function handleEdit() {
    startTransition(() => {
      setIsEditing(true);
    });
  }

  function handleCancelEdit() {
    startTransition(() => {
      setIsEditing(false);
    });
  }

  return (
    <li
      className={cn(
        "flex items-center gap-2",
        "animate-in fade-in duration-500",
        "group",
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

function EditTodoForm({
  todo,
  onCancel,
}: {
  todo: Todo;
  onCancel: () => void;
}) {
  const [state, action] = useFormState(updateTodoAction, {
    fields: {
      title: todo.title,
      id: todo.id,
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

  useEffect(() => {
    if (state.errors?.title || state.errors?.id) {
      let description = state.errors?.title || state.errors?.id;
      toast({
        title: "Invalid Input",
        description,
      });
    }
  }, [state.errors?.title, state.errors?.id]);

  useEffect(() => {
    if (state.success) {
      onCancel();
    }
  }, [state.success]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  return (
    <form action={action} className="flex gap-2 flex-1 ease-in-out">
      <input type="hidden" name="id" defaultValue={todo.id} />
      <Input
        ref={inputRef}
        name="title"
        defaultValue={state.fields?.title}
        placeholder="Title"
        className="flex-1 h-8"
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
  );
}
