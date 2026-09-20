"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";

import { signInDashboard } from "@/app/dashboard/actions";
import { dashboardInitialState } from "@/app/dashboard/_components/form-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardLoginForm() {
  const [state, formAction, pending] = useActionState(signInDashboard, dashboardInitialState);

  return (
    <form action={formAction} className="mt-7 space-y-4">
      <label className="block text-sm font-medium text-[#31312f]" htmlFor="password">Dashboard password</label>
      <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-11 border-[#deded9] bg-white" />
      {state.status === "error" ? <p className="text-sm text-red-600" role="alert">{state.message}</p> : null}
      <Button type="submit" size="lg" className="w-full" disabled={pending}><LockKeyhole />{pending ? "Signing in…" : "Open dashboard"}</Button>
    </form>
  );
}
