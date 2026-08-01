import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-3 text-lg font-semibold tracking-tight",
        className,
      )}
      href="/"
    >
      <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-base font-bold text-primary-foreground shadow-sm ring-1 ring-foreground/10">
        FD
      </span>
      <span className="hidden sm:inline">Founder Dashboard</span>
    </Link>
  );
}
