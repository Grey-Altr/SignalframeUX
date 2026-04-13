"use client";

import * as React from "react";
import { Check, AlertCircle } from "lucide-react";
import { SFProgress } from "./sf-progress";
import { cn } from "@/lib/utils";

/**
 * SFStepper -- SIGNAL layer vertical multi-step flow component.
 *
 * Renders a vertical sequence of steps with SFProgress connectors
 * between them. Each step has a status indicator (square, not circle)
 * and optional label/description. Connectors use actual SFProgress
 * instances for GSAP-driven fill animation.
 *
 * @param activeStep - Zero-based index of the current active step
 * @param children - SFStep elements
 * @param className - Additional classes on root container
 *
 * @example
 * <SFStepper activeStep={1}>
 *   <SFStep status="complete" label="Account" description="Create your account" />
 *   <SFStep status="active" label="Profile" description="Set up your profile" />
 *   <SFStep status="pending" label="Review" description="Review and submit" />
 * </SFStepper>
 *
 * <SFStepper activeStep={2}>
 *   <SFStep status="complete" label="Upload" />
 *   <SFStep status="error" label="Validate" description="3 errors found" />
 *   <SFStep status="pending" label="Publish" />
 * </SFStepper>
 */

type StepStatus = "pending" | "active" | "complete" | "error";

interface SFStepperProps {
  activeStep: number;
  children: React.ReactNode;
  className?: string;
}

interface SFStepProps {
  status?: StepStatus;
  label?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

function getConnectorValue(status: StepStatus): number {
  switch (status) {
    case "complete":
      return 100;
    case "active":
      return 50;
    case "error":
      return 100;
    case "pending":
    default:
      return 0;
  }
}

function SFStepper({ activeStep: _activeStep, children, className }: SFStepperProps) {
  const steps = React.Children.toArray(children);

  return (
    <div
      role="group"
      aria-label="Progress steps"
      className={cn("flex flex-col", className)}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const stepElement = step as React.ReactElement<SFStepProps>;
        const status = stepElement.props?.status ?? "pending";

        return (
          <React.Fragment key={index}>
            {step}
            {!isLast && (
              <div className="flex justify-center py-[var(--sfx-space-1)] pl-4">
                <SFProgress
                  value={getConnectorValue(status)}
                  className={cn(
                    "h-8 w-1 [writing-mode:vertical-lr]",
                    status === "error" && "bg-destructive/20 [&_[data-slot=progress-indicator]]:bg-destructive"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Sub-component of SFStepper — individual step with status indicator, label, and optional description.
 * @example
 * <SFStep status="complete" label="Account" description="Create your account" />
 */
function SFStep({
  status = "pending",
  label,
  description,
  children,
  className,
}: SFStepProps) {
  return (
    <div
      role="listitem"
      data-status={status}
      className={cn("flex items-start gap-[var(--sfx-space-3)]", className)}
    >
      {/* Step indicator -- square, not circle */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-foreground font-mono text-xs",
          status === "complete" && "bg-primary text-primary-foreground border-primary",
          status === "active" && "bg-foreground text-background",
          status === "error" && "bg-destructive text-destructive-foreground border-destructive",
          status === "pending" && "bg-transparent text-foreground"
        )}
        aria-hidden="true"
      >
        {status === "complete" && <Check className="size-4" />}
        {status === "error" && <AlertCircle className="size-4" />}
        {(status === "active" || status === "pending") && null}
      </div>

      {/* Step content */}
      <div className="flex flex-col justify-center min-h-8">
        {label && (
          <span className="font-mono uppercase tracking-wider text-sm leading-tight">
            {label}
          </span>
        )}
        {description && (
          <span className="text-muted-foreground text-xs mt-0.5">
            {description}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

export { SFStepper, SFStep };
export type { StepStatus, SFStepperProps, SFStepProps };
