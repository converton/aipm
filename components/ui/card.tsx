import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn("rounded-lg border bg-white p-4 shadow-sm", className)}>{children}</div>;
}
