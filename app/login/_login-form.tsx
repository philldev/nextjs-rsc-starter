"use client";

import { ModeToggle } from "@/components/mode-button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { formAction } from "./_action";

export function LoginForm() {
  const [state, action] = useFormState(formAction, {
    errors: {},
    fields: {
      username: "",
      password: "",
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex mb-2 justify-between items-center">
          <span>Login</span>
          <ModeToggle />
        </CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-6">
          <div>
            <Label className={cn(state.errors.username && "text-red-600")}>
              Username
            </Label>
            <Input
              defaultValue={state.fields.username}
              type="text"
              placeholder="Username"
              name="username"
            />
            {state.errors.username && (
              <p className="mt-1 text-[.8rem] text-red-600 text-left">
                {state.errors.username}
              </p>
            )}
          </div>
          <div>
            <Label className={cn(state.errors.password && "text-red-600")}>
              Password
            </Label>

            <Input
              defaultValue={state.fields.password}
              type="password"
              placeholder="Password"
              name="password"
            />

            {state.errors.password && (
              <p className="mt-1 text-[.8rem] text-red-600 text-left">
                {state.errors.password}
              </p>
            )}
          </div>
          <SubmitButton />
        </form>
      </CardContent>

      <CardFooter className="grid gap-4">
        {state.error && (
          <Alert variant="destructive" className="text-red-600">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        <div className="text-center w-full">
          <p className="text-sm text-muted-foreground">
            Don't have an account?
          </p>
          <Button className="underline" variant="link" asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button>{pending ? "Logging in..." : "Login"}</Button>;
}
