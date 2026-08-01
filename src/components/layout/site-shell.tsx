import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Shared horizontal padding — content spans full viewport width. */
export const SITE_CONTENT_CLASS = "w-full px-6 sm:px-10 lg:px-16 xl:px-20";

export function SiteShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(SITE_CONTENT_CLASS, className)}>{children}</div>;
}
