"use client";

import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * SFToggleGroup -- FRAME layer exclusive/multi-select toggle group.
 *
 * Radix ToggleGroup with SF styling: sharp corners, 2px border,
 * edge-to-edge layout (gap-0), and CVA `intent` prop. Use for
 * mutually exclusive selections (type="single") or multi-select
 * filter banks (type="multiple").
 *
 * @param type - "single" for exclusive selection, "multiple" for multi-select
 * @param intent - Visual variant passed to all items. "ghost" | "primary"
 * @param size - Height and padding scale. "sm" | "md" | "lg"
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFToggleGroup type="single" intent="ghost" defaultValue="grid">
 *   <SFToggleGroupItem value="grid">Grid</SFToggleGroupItem>
 *   <SFToggleGroupItem value="list">List</SFToggleGroupItem>
 * </SFToggleGroup>
 *
 * <SFToggleGroup type="multiple" intent="primary" size="sm">
 *   <SFToggleGroupItem value="a">A</SFToggleGroupItem>
 *   <SFToggleGroupItem value="b">B</SFToggleGroupItem>
 *   <SFToggleGroupItem value="c">C</SFToggleGroupItem>
 * </SFToggleGroup>
 */

const sfToggleGroupItemVariants = cva(
  "sf-pressable sf-focusable rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs transition-colors duration-[var(--sfx-duration-fast)]",
  {
    variants: {
      intent: {
        ghost:
          "bg-transparent text-foreground hover:bg-foreground hover:text-background data-[state=on]:bg-foreground data-[state=on]:text-background",
        primary:
          "bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
      },
      size: {
        sm: "h-8 min-w-8 px-3",
        md: "h-10 min-w-10 px-4",
        lg: "h-12 min-w-12 px-6",
      },
    },
    defaultVariants: {
      intent: "ghost",
      size: "md",
    },
  }
);

type SFToggleGroupContextValue = {
  intent?: "ghost" | "primary" | null;
  size?: "sm" | "md" | "lg" | null;
};

const SFToggleGroupContext = React.createContext<SFToggleGroupContextValue>({});

type SFToggleGroupProps = React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof sfToggleGroupItemVariants>;

function SFToggleGroup({
  className,
  intent,
  size,
  children,
  ...props
}: SFToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "flex w-fit items-center gap-0 rounded-none",
        className
      )}
      {...props}
    >
      <SFToggleGroupContext.Provider value={{ intent, size }}>
        {children}
      </SFToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

interface SFToggleGroupItemProps
  extends React.ComponentProps<typeof ToggleGroupPrimitive.Item>,
    VariantProps<typeof sfToggleGroupItemVariants> {}

/**
 * Sub-component of SFToggleGroup — individual toggle button item that inherits group intent and size.
 * @example
 * <SFToggleGroupItem value="grid">Grid</SFToggleGroupItem>
 */
function SFToggleGroupItem({
  className,
  intent,
  size,
  children,
  ...props
}: SFToggleGroupItemProps) {
  const context = React.useContext(SFToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        sfToggleGroupItemVariants({
          intent: context.intent ?? intent,
          size: context.size ?? size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { SFToggleGroup, SFToggleGroupItem };
