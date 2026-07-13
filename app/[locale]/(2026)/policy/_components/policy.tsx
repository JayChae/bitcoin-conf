import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PolicyProps = { children: ReactNode };
type PolicyListProps = PolicyProps & { nested?: boolean };

export function PolicyTitle({ children }: PolicyProps) {
  return (
    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
      {children}
    </h1>
  );
}

export function PolicyHeading({ children }: PolicyProps) {
  return (
    <h2 className="text-xl md:text-2xl font-semibold text-white mt-12 mb-4">
      {children}
    </h2>
  );
}

export function PolicyParagraph({ children }: PolicyProps) {
  return (
    <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
      {children}
    </p>
  );
}

export function PolicyList({ children, nested }: PolicyListProps) {
  return (
    <ul
      className={cn(
        "pl-5 text-white/70 text-sm md:text-base leading-relaxed",
        nested ? "list-[circle] mt-2 space-y-1" : "list-disc space-y-2 mb-4",
      )}
    >
      {children}
    </ul>
  );
}

export function PolicyOrderedList({ children, nested }: PolicyListProps) {
  return (
    <ol
      className={cn(
        "list-decimal pl-5 text-white/70 text-sm md:text-base leading-relaxed",
        nested ? "mt-2 space-y-1" : "space-y-2 mb-4",
      )}
    >
      {children}
    </ol>
  );
}

export function PolicyStrong({ children }: PolicyProps) {
  return <strong className="font-semibold text-white">{children}</strong>;
}

export function PolicyDivider() {
  return <hr className="border-white/10 my-8" />;
}
