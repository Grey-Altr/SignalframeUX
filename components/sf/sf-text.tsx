import { cn } from "@/lib/utils";
import React from "react";

export type TextVariant = "heading-1" | "heading-2" | "heading-3" | "body" | "small";

type TextElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "label";

const variantClassMap: Record<TextVariant, string> = {
  "heading-1": "text-heading-1",
  "heading-2": "text-heading-2",
  "heading-3": "text-heading-3",
  body: "text-body",
  small: "text-small",
};

const defaultElementMap: Record<TextVariant, TextElement> = {
  "heading-1": "h1",
  "heading-2": "h2",
  "heading-3": "h3",
  body: "p",
  small: "span",
};

interface SFTextProps extends React.HTMLAttributes<HTMLElement> {
  variant: TextVariant;
  as?: TextElement;
  className?: string;
}

const SFText = React.forwardRef<HTMLElement, SFTextProps>(
  function SFText({ variant, as, className, ...props }, ref) {
    const Tag = as ?? defaultElementMap[variant];
    return (
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as React.Ref<any>}
        className={cn(variantClassMap[variant], className)}
        {...(props as React.HTMLAttributes<HTMLElement>)}
      />
    );
  }
);

SFText.displayName = "SFText";

export { SFText };
