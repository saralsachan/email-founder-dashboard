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
        "w-full flex-1 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-14 xl:px-20",
        narrow && "mx-auto max-w-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}
