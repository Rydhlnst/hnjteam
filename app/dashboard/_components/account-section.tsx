"use client";

import { useState } from "react";
import { Check, KeyRound, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AccountSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("New password must be at least 8 characters.");
      return;
    }

    setPending(true);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      if (result.error) {
        setStatus("error");
        setMessage(result.error.message ?? "Password change failed.");
      } else {
        setStatus("success");
        setMessage("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setStatus("error");
      setMessage("Password change failed. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-lg">
      <div className="rounded-3xl border border-[#deded9] bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#f1f1ee] text-[#5f5f5b]">
            <KeyRound className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-[-0.04em] text-[#171716]">Change password</h2>
            <p className="text-sm text-[#858580]">Update your admin login password.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#31312f]" htmlFor="current-password">Current password</label>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-11 border-[#deded9] bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#31312f]" htmlFor="new-password">New password</label>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8+ characters"
              className="h-11 border-[#deded9] bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#31312f]" htmlFor="confirm-password">Confirm new password</label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 border-[#deded9] bg-white"
            />
          </div>

          {status === "error" && <p className="text-sm text-red-600" role="alert">{message}</p>}
          {status === "success" && (
            <p className="flex items-center gap-1.5 text-sm text-emerald-700">
              <Check className="size-4" /> {message}
            </p>
          )}

          <Button type="submit" size="lg" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4" />}
            {pending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
