export type DashboardFormState = {
  message: string | null;
  status: "error" | "idle" | "success";
};

export const dashboardInitialState: DashboardFormState = { message: null, status: "idle" };
