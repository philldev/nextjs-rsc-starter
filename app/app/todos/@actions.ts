"use server";

import { db } from "@/lib/drizzle/db";
import { todoTable, Todo } from "@/lib/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { validateRequest } from "../@actions";
import { v4 as uuidv4 } from "uuid";
import { CreateTodoSchema, UpdateTodoSchema } from "./@schemas";

type CreateTodoFormState = {
  fields: Record<string, string>;
  error?: string;
  success?: boolean;
};

export const createTodo = async (
  _: CreateTodoFormState,
  formData: FormData,
): Promise<CreateTodoFormState> => {
  const result = CreateTodoSchema.safeParse(Object.fromEntries(formData));

  const fields: Record<string, string> = {};
  for (const key of Object.keys(Object.fromEntries(formData))) {
    fields[key] = formData.get(key)?.toString() ?? "";
  }

  if (!result.success) {
    const { fieldErrors } = result.error.flatten();

    return {
      fields,
      error: fieldErrors.title?.[0],
    };
  }

  const session = await validateRequest();

  if (!session.user) {
    return {
      fields,
      error: "You must be logged in to create a todo",
    };
  }

  await db.insert(todoTable).values({
    id: formData.get("id")?.toString() ?? uuidv4(),
    userId: session.user.id,
    title: result.data.title,
    completed: false,
    description: "",
  });

  revalidatePath("/app/todos");

  return {
    fields: {
      title: "",
    },
    success: true,
  };
};

export async function toggleTodo(todo: Todo) {
  const session = await validateRequest();

  if (!session.user) {
    return {
      error: "You must be logged in to toggle a todo",
      success: false,
    };
  }

  await db
    .update(todoTable)
    .set({ completed: !todo.completed })
    .where(
      and(eq(todoTable.id, todo.id), eq(todoTable.userId, session.user.id)),
    );

  revalidatePath("/app/todos");

  return {
    success: true,
  };
}

export async function deleteTodo(todo: Todo) {
  const session = await validateRequest();

  if (!session.user) {
    return {
      error: "You must be logged in to delete a todo",
      success: false,
    };
  }

  await db
    .delete(todoTable)
    .where(
      and(eq(todoTable.id, todo.id), eq(todoTable.userId, session.user.id)),
    );

  revalidatePath("/app/todos");

  return {
    success: true,
  };
}

type UpdateTodoFormState = {
  fields?: Record<string, string>;
  error?: string;
};

export async function updateTodoAction(
  _: UpdateTodoFormState,
  formData: FormData,
): Promise<UpdateTodoFormState> {
  const fields = Object.fromEntries(formData) as z.infer<
    typeof UpdateTodoSchema
  >;

  const session = await validateRequest();

  if (!session.user) {
    return {
      fields,
      error: "You must be logged in to update a todo",
    };
  }

  const result = UpdateTodoSchema.safeParse(fields);

  if (!result.success) {
    return {
      fields,
      error: result.error.issues[0].message,
    };
  }

  await db
    .update(todoTable)
    .set({
      title: result.data.title,
    })
    .where(
      and(
        eq(todoTable.id, result.data.id),
        eq(todoTable.userId, session.user.id),
      ),
    );

  revalidatePath("/app/todos");

  return {};
}
