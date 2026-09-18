"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { AuthFormProps } from "@/types/index.types";

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // The browser client calls our Better Auth API route; secrets stay on the server.
    const result = isSignup
      ? // The server maps Better Auth's `name` field to this app's `username` field.
        await authClient.signUp.email({ name, email, password })
      : await authClient.signIn.email({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Something went wrong.");
      return;
    }

    router.push("/"); // Redirect to the homepage.
    router.refresh(); // Refresh the page to reflect the new session.
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Secondbrain</p>
          <h1 className="text-3xl font-bold">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignup
              ? "Start keeping your thoughts in one place."
              : "Sign in to continue to your workspace."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <label className="block space-y-2 text-sm font-medium">
              Username
              <Input
                autoComplete="username"
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
          )}

          <label className="block space-y-2 text-sm font-medium">
            Email
            <Input
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            Password
            <Input
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? "Working..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Need an account?"}{" "}
          <Link
            className="font-medium text-foreground underline underline-offset-4"
            href={isSignup ? "/login" : "/signup"}
          >
            {isSignup ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </main>
  );
}
