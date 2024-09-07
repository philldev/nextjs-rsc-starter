"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { hash } from "@node-rs/argon2";
import { db } from "@/lib/drizzle/db";
import { users } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { lucia } from "@/lib/lucia/auth";
import { cookies } from "next/headers";

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(50, "Username can't be longer than 50 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password can't be longer than 50 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password can't be longer than 50 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
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
        confirmPassword: fieldErrors.confirmPassword?.[0],
      },
    };
  }

  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.username, result.data.username))
    .limit(1);

  if (user) {
    return {
      fields,
      errors: {},
      error: "User already exists",
    };
  }

  const passwordHash = await hash(result.data.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = uuidv4();

  await db.insert(users).values({
    id: userId,
    username: result.data.username,
    passwordHash,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );

  redirect("/todos");
}
