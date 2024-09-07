"use server";

import { lucia } from "@/lib/lucia/auth";
import { cookies } from "next/headers";
import { cache } from "react";
import { Session, User } from "lucia";
import { db } from "@/lib/drizzle/db";
import { Todo, todoTable } from "@/lib/drizzle/schema";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  return redirect("/login");
}

const CreateTodoSchema = z.object({
  title: z.string().min(1, "Please enter a todo"),
});

type FormFields = z.infer<typeof CreateTodoSchema>;

type CreateTodoFormState = {
  fields: FormFields;
  error?: string;
  success?: boolean;
};

export const createTodo = async (
  _: CreateTodoFormState,
  formData: FormData,
): Promise<CreateTodoFormState> => {
  const fields = Object.fromEntries(formData) as FormFields;

  const result = CreateTodoSchema.safeParse(fields);

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
    id: uuidv4(),
    userId: session.user.id,
    title: result.data.title,
    completed: false,
    description: "",
  });

  revalidatePath("/todos");

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

  revalidatePath("/todos");

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

  revalidatePath("/todos");

  return {
    success: true,
  };
}

const UpdateTodoSchema = z.object({
  title: z.string().min(1, "Please enter a todo"),
  id: z.string().uuid(),
});

type UpdateTodoFormFields = z.infer<typeof UpdateTodoSchema>;

type UpdateTodoFormState = {
  fields?: UpdateTodoFormFields;
  errors?: {
    [K in keyof UpdateTodoFormFields]?: string;
  };
  error?: string;
  success?: boolean;
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
      success: false,
    };
  }

  const result = UpdateTodoSchema.safeParse(fields);

  if (!result.success) {
    const { fieldErrors } = result.error.flatten();

    return {
      fields,
      errors: {
        title: fieldErrors.title?.[0],
        id: fieldErrors.id?.[0],
      },
      success: false,
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

  revalidatePath("/todos");

  return {
    success: true,
  };
}
