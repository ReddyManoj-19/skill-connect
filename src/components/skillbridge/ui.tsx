import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(15,23,42,0.18)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <span className="mb-1.5 block text-sm font-medium text-foreground">{children}</span>;
}

export const inputClass =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/40";

export function Button({
  children,
  variant = "primary",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "success" | "ghost" | "danger";
}) {
  const variants: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    success: "bg-success text-success-foreground hover:bg-success/90",
    outline: "border border-input bg-background text-foreground hover:bg-accent",
    ghost: "text-primary hover:bg-accent",
    danger: "border border-destructive/30 text-destructive hover:bg-destructive/10",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SkillTag({ skill, state }: { skill: string; state: "matched" | "missing" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        state === "matched"
          ? "bg-success/10 text-success"
          : "bg-destructive/10 text-destructive",
      )}
    >
      {state === "matched" ? <Check className="size-3.5" /> : <X className="size-3.5" />}
      {skill}
    </span>
  );
}

export function MatchBar({ percent }: { percent: number }) {
  const tone = percent >= 75 ? "bg-success" : percent >= 40 ? "bg-primary" : "bg-destructive";
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs font-semibold">
        <span className="text-muted-foreground">Suitability score</span>
        <span className="text-foreground">{percent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all", tone)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
