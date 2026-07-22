import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
  narrow,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full flex-1 px-4 py-8 sm:px-6 sm:py-10",
        narrow ? "max-w-lg" : "max-w-6xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
