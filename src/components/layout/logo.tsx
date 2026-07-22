import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-2.5 font-semibold tracking-tight",
        className,
      )}
      href="/"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-sm ring-1 ring-foreground/10">
        FD
      </span>
      <span className="hidden sm:inline">Founder Dashboard</span>
    </Link>
  );
}
