"use client";

import { useRef, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { gsap } from "@/lib/gsap-core";
import { cn } from "@/lib/utils";
import { X, Check, AlertTriangle, Info, AlertCircle } from "lucide-react";

/* ── Intent border map ── */
const intentBorder: Record<string, string> = {
  default: "border-foreground",
  success: "border-success",
  destructive: "border-destructive",
  warning: "border-warning",
};

/* ── SFToastContent ── */
interface SFToastContentProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  intent?: "default" | "success" | "destructive" | "warning";
  onDismiss: () => void;
}

function SFToastContent({
  title,
  description,
  icon,
  intent = "default",
  onDismiss,
}: SFToastContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Reduced-motion guard — skip slide animation entirely
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      ref.current,
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.2, ease: "power2.out" }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-row items-start border-2 bg-background text-foreground font-mono rounded-none p-[var(--sfx-space-4)] shadow-none",
        intentBorder[intent] ?? intentBorder.default
      )}
    >
      {icon && <span className="mr-3 mt-0.5 shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-mono uppercase tracking-wider">
          {title}
        </div>
        {description && (
          <div className="text-xs text-muted-foreground mt-[var(--sfx-space-1)]">
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="ml-3 shrink-0 text-foreground hover:text-primary transition-colors duration-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

/**
 * SFToaster — global toast container positioned bottom-left at z-100.
 * Place once in app/layout.tsx as a sibling to {children}.
 *
 * Uses Sonner in unstyled mode for full DU/TDR control.
 * Toast notifications slide in from the left via GSAP, respecting prefers-reduced-motion.
 *
 * @example
 * // In app/layout.tsx:
 * <SFToaster />
 *
 * // Trigger from any client component:
 * import { sfToast } from "@/components/sf";
 * sfToast.success("OPERATION COMPLETE");
 */
function SFToaster() {
  return (
    <Toaster
      position="bottom-left"
      theme="dark"
      toastOptions={{ unstyled: true }}
      gap={8}
      offset={16}
      style={{ zIndex: 100 }}
    />
  );
}

/**
 * sfToast — imperative toast API.
 * Triggers custom Sonner toasts rendered with SFToastContent + GSAP slide.
 *
 * @example
 * sfToast.default("SYSTEM NOTICE", { description: "All systems nominal" });
 * sfToast.success("SAVED");
 * sfToast.error("CRITICAL FAILURE");
 * sfToast.warning("LOW SIGNAL");
 * sfToast.info("UPDATE AVAILABLE");
 */
const sfToast = {
  default: (title: string, opts?: Omit<SFToastContentProps, "title" | "onDismiss">) =>
    toast.custom((id) => (
      <SFToastContent title={title} onDismiss={() => toast.dismiss(id)} {...opts} />
    )),
  success: (title: string, opts?: Omit<SFToastContentProps, "title" | "onDismiss" | "icon" | "intent">) =>
    toast.custom((id) => (
      <SFToastContent
        title={title}
        icon={<Check className="size-4" />}
        intent="success"
        onDismiss={() => toast.dismiss(id)}
        {...opts}
      />
    )),
  error: (title: string, opts?: Omit<SFToastContentProps, "title" | "onDismiss" | "icon" | "intent">) =>
    toast.custom((id) => (
      <SFToastContent
        title={title}
        icon={<AlertTriangle className="size-4" />}
        intent="destructive"
        onDismiss={() => toast.dismiss(id)}
        {...opts}
      />
    )),
  warning: (title: string, opts?: Omit<SFToastContentProps, "title" | "onDismiss" | "icon" | "intent">) =>
    toast.custom((id) => (
      <SFToastContent
        title={title}
        icon={<AlertCircle className="size-4" />}
        intent="warning"
        onDismiss={() => toast.dismiss(id)}
        {...opts}
      />
    )),
  info: (title: string, opts?: Omit<SFToastContentProps, "title" | "onDismiss" | "icon" | "intent">) =>
    toast.custom((id) => (
      <SFToastContent
        title={title}
        icon={<Info className="size-4" />}
        onDismiss={() => toast.dismiss(id)}
        {...opts}
      />
    )),
};

export { SFToaster, sfToast };
