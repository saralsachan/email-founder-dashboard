import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Shared content width — wide enough for laptops without stretching ultra-wide screens. */
export const SITE_CONTENT_CLASS = "mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-12 xl:px-16";

export function SiteShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(SITE_CONTENT_CLASS, className)}>{children}</div>;
}
