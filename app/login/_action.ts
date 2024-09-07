"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { verify } from "@node-rs/argon2";
import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { lucia } from "@/lib/lucia/auth";
import { cookies } from "next/headers";

const formSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username can't be longer than 50 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password can't be longer than 50 characters"),
});

type FormFields = z.infer<typeof formSchema>;

interface FormState {
  fields: FormFields;
  errors: {
    [K in keyof FormFields]?: string;
  };
  error?: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function formAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = Object.fromEntries(formData) as FormFields;

  const result = formSchema.safeParse(fields);

  if (!result.success) {
    const { fieldErrors } = result.error.flatten();

    return {
      fields,
      errors: {
        username: fieldErrors.username?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  const [user] = await db
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.username, result.data.username))
    .limit(1);

  if (!user) {
    return {
      fields,
      errors: {},
      error: "Invalid username or password",
    };
  }

  const passwordIsValid = await verify(user.passwordHash, result.data.password);

  if (!passwordIsValid) {
    return {
      fields,
      errors: {},
      error: "Invalid username or password",
    };
  }

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect("/todos");
}
