"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SetupAdminForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setPending(true);
    try {
      const signUpResult = await authClient.signUp.email({
        email: `${username}@hnj.internal`,
        password,
        name: username,
        username,
      });
      if (signUpResult.error) {
        setError(signUpResult.error.message ?? "Account creation failed.");
        return;
      }
      const signInResult = await authClient.signIn.username({ username, password });
      if (signInResult.error) {
        setError(signInResult.error.message ?? "Sign in after setup failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Setup failed. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#31312f]" htmlFor="setup-username">Username</label>
        <Input
          id="setup-username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
          placeholder="admin"
          className="h-11 border-[#deded9] bg-white"
        />
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#31312f]" htmlFor="setup-password">Password</label>
        <Input
          id="setup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="8+ characters"
          className="h-11 border-[#deded9] bg-white"
        />
      </div>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#31312f]" htmlFor="setup-confirm">Confirm password</label>
        <Input
          id="setup-confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="h-11 border-[#deded9] bg-white"
        />
      </div>
      {error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        <UserPlus />{pending ? "Creating account…" : "Create admin account"}
      </Button>
    </form>
  );
}
