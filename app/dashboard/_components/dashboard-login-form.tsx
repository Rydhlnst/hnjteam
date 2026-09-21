"use client";

import { useState } from "react";
import { LockKeyhole, User } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const result = await authClient.signIn.username({ username, password });
      if (result.error) {
        setError(result.error.message ?? "Incorrect username or password.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Sign in failed. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#31312f]" htmlFor="username">Username</label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#858580]" />
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 border-[#deded9] bg-white pl-9"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#31312f]" htmlFor="password">Password</label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 border-[#deded9] bg-white"
        />
      </div>
      {error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        <LockKeyhole />{pending ? "Signing in…" : "Open dashboard"}
      </Button>
    </form>
  );
}
