import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><Skeleton className="h-4 w-48" /><div className="mt-8 grid gap-10 lg:grid-cols-2"><Skeleton className="aspect-square rounded-[2rem]" /><div><Skeleton className="h-7 w-28" /><Skeleton className="mt-6 h-20 w-full" /><Skeleton className="mt-6 h-20 w-4/5" /><Skeleton className="mt-10 h-12 w-52 rounded-xl" /></div></div></main>;
}

