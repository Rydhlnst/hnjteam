import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, description, align = "left", className }: { eyebrow?: string; title: string; description?: string; align?: "left" | "center"; className?: string }) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#768078]">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold tracking-[-0.045em] text-[#1d1d1b] sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-[#6a726b]">{description}</p> : null}
    </div>
  );
}

