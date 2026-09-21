import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <main className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-8"><Skeleton className="h-14 w-80 rounded-xl" /><Skeleton className="mt-5 h-6 w-[28rem] max-w-full rounded-lg" /><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-[420px] rounded-2xl" />)}</div></main>;
}

