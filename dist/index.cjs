'use strict';

var classVarianceAuthority = require('class-variance-authority');
var clsx = require('clsx');
var tailwindMerge = require('tailwind-merge');
var React7 = require('react');
var jsxRuntime = require('react/jsx-runtime');
var radixUi = require('radix-ui');
var lucideReact = require('lucide-react');
var cmdk = require('cmdk');
var inputOtp = require('input-otp');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React7__namespace = /*#__PURE__*/_interopNamespace(React7);

// components/sf/sf-container.tsx
function cn(...inputs) {
  return tailwindMerge.twMerge(clsx.clsx(inputs));
}
var sfContainerVariants = classVarianceAuthority.cva(
  "w-full mx-auto px-[var(--gutter-sm)] md:px-[var(--gutter)]",
  {
    variants: {
      width: {
        wide: "max-w-[var(--max-w-wide)]",
        content: "max-w-[var(--max-w-content)]",
        full: "max-w-[var(--max-w-full)]"
      }
    },
    defaultVariants: {
      width: "wide"
    }
  }
);
var SFContainer = React7__namespace.default.forwardRef(
  function SFContainer2({ width, className, ...props }, ref) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        className: cn(sfContainerVariants({ width }), className),
        ...props
      }
    );
  }
);
SFContainer.displayName = "SFContainer";
var SFSection = React7__namespace.default.forwardRef(
  function SFSection2({ label, bgShift, spacing = "16", className, children, ...props }, ref) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "section",
      {
        ref,
        "data-section": true,
        "data-section-label": label,
        "data-bg-shift": bgShift,
        className: cn(`py-${spacing}`, className),
        ...props,
        children
      }
    );
  }
);
SFSection.displayName = "SFSection";
var sfStackVariants = classVarianceAuthority.cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row flex-wrap"
    },
    gap: {
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "6": "gap-6",
      "8": "gap-8",
      "12": "gap-12",
      "16": "gap-16",
      "24": "gap-24"
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch"
    }
  },
  defaultVariants: {
    direction: "vertical",
    gap: "4",
    align: "stretch"
  }
});
var SFStack = React7__namespace.default.forwardRef(
  function SFStack2({ direction, gap, align, className, ...props }, ref) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        className: cn(sfStackVariants({ direction, gap, align }), className),
        ...props
      }
    );
  }
);
SFStack.displayName = "SFStack";
var sfGridVariants = classVarianceAuthority.cva("grid", {
  variants: {
    cols: {
      "1": "grid-cols-1",
      "2": "grid-cols-1 md:grid-cols-2",
      "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      auto: "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
    },
    gap: {
      "4": "gap-4",
      "6": "gap-6",
      "8": "gap-8"
    }
  },
  defaultVariants: {
    cols: "3",
    gap: "6"
  }
});
var SFGrid = React7__namespace.default.forwardRef(
  function SFGrid2({ cols, gap, className, ...props }, ref) {
    return /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        className: cn(sfGridVariants({ cols, gap }), className),
        ...props
      }
    );
  }
);
SFGrid.displayName = "SFGrid";
var variantClassMap = {
  "heading-1": "text-heading-1",
  "heading-2": "text-heading-2",
  "heading-3": "text-heading-3",
  body: "text-body",
  small: "text-small"
};
var defaultElementMap = {
  "heading-1": "h1",
  "heading-2": "h2",
  "heading-3": "h3",
  body: "p",
  small: "span"
};
var SFText = React7__namespace.default.forwardRef(
  function SFText2({ variant, as, className, ...props }, ref) {
    const Tag = as ?? defaultElementMap[variant];
    return /* @__PURE__ */ jsxRuntime.jsx(
      Tag,
      {
        ref,
        className: cn(variantClassMap[variant], className),
        ...props
      }
    );
  }
);
SFText.displayName = "SFText";
var buttonVariants = classVarianceAuthority.cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? radixUi.Slot.Root : "button";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
var sfButtonVariants = classVarianceAuthority.cva(
  "sf-pressable sf-focusable font-mono uppercase tracking-wider border-2 border-foreground transition-colors duration-[var(--duration-normal)] ease-[var(--ease-default)] cursor-pointer",
  {
    variants: {
      intent: {
        primary: "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
        ghost: "sf-border-thicken bg-transparent text-foreground hover:bg-foreground hover:text-background",
        // signal: pre-standard extension — kept for SignalframeUX brand accent usage.
        // Blessed intent set: default, primary, secondary, destructive, ghost, outline.
        signal: "bg-foreground text-background border-primary hover:bg-primary hover:text-primary-foreground"
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-12 text-lg"
      }
    },
    defaultVariants: {
      intent: "primary",
      size: "md"
    }
  }
);
function SFButton({
  intent,
  size,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Button,
    {
      className: cn(sfButtonVariants({ intent, size }), className),
      ...props
    }
  );
}
function Card({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "card",
      "data-size": size,
      className: cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      ),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-4 group-data-[size=sm]/card:px-3", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      ),
      ...props
    }
  );
}
function BorderDraw({
  children,
  color = "var(--color-primary)",
  weight = 2,
  duration = 400,
  className
}) {
  const step = duration / 4;
  const bg = color;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: `relative group ${className ?? ""}`, children: [
    children,
    /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute top-0 left-0 h-0 w-full origin-left scale-x-0 transition-transform group-hover:scale-x-100",
        style: {
          height: `${weight}px`,
          backgroundColor: bg,
          transitionDuration: `${step}ms`,
          transitionDelay: "0ms",
          transitionTimingFunction: "var(--ease-default)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute top-0 right-0 w-0 h-full origin-top scale-y-0 transition-transform group-hover:scale-y-100",
        style: {
          width: `${weight}px`,
          backgroundColor: bg,
          transitionDuration: `${step}ms`,
          transitionDelay: `${step}ms`,
          transitionTimingFunction: "var(--ease-default)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute bottom-0 right-0 h-0 w-full origin-right scale-x-0 transition-transform group-hover:scale-x-100",
        style: {
          height: `${weight}px`,
          backgroundColor: bg,
          transitionDuration: `${step}ms`,
          transitionDelay: `${step * 2}ms`,
          transitionTimingFunction: "var(--ease-default)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      "span",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute bottom-0 left-0 w-0 h-full origin-bottom scale-y-0 transition-transform group-hover:scale-y-100",
        style: {
          width: `${weight}px`,
          backgroundColor: bg,
          transitionDuration: `${step}ms`,
          transitionDelay: `${step * 3}ms`,
          transitionTimingFunction: "var(--ease-default)"
        }
      }
    )
  ] });
}
function SFCard({ className, hoverable = false, borderDraw = false, ...props }) {
  const card = /* @__PURE__ */ jsxRuntime.jsx(
    Card,
    {
      className: cn(
        "border-2 border-foreground bg-background shadow-none",
        hoverable && !borderDraw && "sf-hoverable transition-colors duration-[var(--duration-fast)] hover:border-primary",
        className
      ),
      ...props
    }
  );
  if (borderDraw) {
    return /* @__PURE__ */ jsxRuntime.jsx(BorderDraw, { children: card });
  }
  return card;
}
function SFCardHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { className: cn("pb-3", className), ...props });
}
function SFCardTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    CardTitle,
    {
      className: cn("font-mono uppercase tracking-wider text-sm", className),
      ...props
    }
  );
}
function SFCardDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    CardDescription,
    {
      className: cn("text-muted-foreground text-xs", className),
      ...props
    }
  );
}
function SFCardContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(CardContent, { className: cn("p-4", className), ...props });
}
function SFCardFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(CardFooter, { className: cn("p-4 pt-0", className), ...props });
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}
function SFInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Input,
    {
      className: cn(
        "sf-focusable sf-border-draw-focus font-mono uppercase tracking-wider text-xs border-2 border-foreground bg-background",
        "focus-visible:ring-0",
        "placeholder:text-muted-foreground placeholder:uppercase placeholder:tracking-wider",
        className
      ),
      ...props
    }
  );
}
var badgeVariants = classVarianceAuthority.cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? radixUi.Slot.Root : "span";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      "data-slot": "badge",
      "data-variant": variant,
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
var sfBadgeVariants = classVarianceAuthority.cva(
  "font-mono uppercase tracking-wider text-xs",
  {
    variants: {
      intent: {
        default: "border-2 border-foreground bg-foreground text-background",
        primary: "border-2 border-primary bg-primary text-primary-foreground",
        outline: "bg-transparent text-foreground border-2 border-foreground",
        signal: "border-2 border-foreground bg-[var(--sf-yellow)] text-foreground"
      }
    },
    defaultVariants: {
      intent: "default"
    }
  }
);
function SFBadge({ intent, className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Badge,
    {
      className: cn(sfBadgeVariants({ intent }), className),
      ...props
    }
  );
}
function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Tabs.Root,
    {
      "data-slot": "tabs",
      "data-orientation": orientation,
      className: cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      ),
      ...props
    }
  );
}
var tabsListVariants = classVarianceAuthority.cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function TabsList({
  className,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Tabs.List,
    {
      "data-slot": "tabs-list",
      "data-variant": variant,
      className: cn(tabsListVariants({ variant }), className),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Tabs.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 dark:text-muted-foreground dark:hover:text-foreground group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Tabs.Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 text-sm outline-none", className),
      ...props
    }
  );
}
function SFTabs(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(Tabs, { ...props });
}
function SFTabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    TabsList,
    {
      className: cn(
        "bg-transparent border-b-2 border-foreground rounded-none h-auto p-0 gap-0",
        className
      ),
      ...props
    }
  );
}
function SFTabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    TabsTrigger,
    {
      className: cn(
        "font-mono uppercase tracking-wider text-xs rounded-none px-4 py-2",
        "border-b-2 border-transparent -mb-[var(--border-element)]",
        "data-[state=active]:border-foreground data-[state=active]:bg-transparent",
        "data-[state=active]:shadow-none data-[state=active]:text-foreground",
        "text-muted-foreground hover:text-foreground transition-colors duration-[var(--duration-fast)]",
        className
      ),
      ...props
    }
  );
}
function SFTabsContent(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(TabsContent, { ...props });
}
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Separator.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      ),
      ...props
    }
  );
}
function SFSeparator({
  className,
  weight = "normal",
  ...props
}) {
  const isVertical = props.orientation === "vertical";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Separator,
    {
      className: cn(
        "bg-foreground",
        !isVertical && weight === "thin" && "h-px",
        !isVertical && weight === "normal" && "h-[var(--border-element)]",
        !isVertical && weight === "heavy" && "h-[var(--border-divider)]",
        isVertical && weight === "thin" && "w-px",
        isVertical && weight === "normal" && "w-[var(--border-element)]",
        isVertical && weight === "heavy" && "w-[var(--border-divider)]",
        className
      ),
      ...props
    }
  );
}
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      ),
      ...props
    }
  );
}
function SFTable({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Table,
    {
      className: cn("font-mono text-xs border-2 border-foreground", className),
      ...props
    }
  );
}
function SFTableHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    TableHeader,
    {
      className: cn("bg-foreground text-background", className),
      ...props
    }
  );
}
function SFTableHead({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    TableHead,
    {
      className: cn(
        "uppercase tracking-wider text-xs text-background font-normal h-9 px-3",
        className
      ),
      ...props
    }
  );
}
function SFTableRow({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    TableRow,
    {
      className: cn(
        "border-b border-foreground/20 hover:bg-muted/50 transition-colors duration-[var(--duration-fast)]",
        className
      ),
      ...props
    }
  );
}
function SFTableCell({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(TableCell, { className: cn("px-3 py-2", className), ...props });
}
function SFTableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(TableBody, { className: cn(className), ...props });
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Tooltip.Root, { "data-slot": "tooltip", ...props });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Tooltip.Trigger, { "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Tooltip.Portal, { children: /* @__PURE__ */ jsxRuntime.jsxs(
    radixUi.Tooltip.Content,
    {
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsx(radixUi.Tooltip.Arrow, { className: "z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" })
      ]
    }
  ) });
}
function SFTooltip(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(Tooltip, { ...props });
}
function SFTooltipContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    TooltipContent,
    {
      className: cn(
        "bg-foreground text-background font-mono text-xs uppercase tracking-wider",
        "border-0 rounded-none px-3 py-1.5",
        className
      ),
      ...props
    }
  );
}
function SFTooltipTrigger(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(TooltipTrigger, { ...props });
}
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogClose({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Close, { "data-slot": "dialog-close", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Dialog.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-500 ease-in-out supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(DialogPortal, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntime.jsxs(
      radixUi.Dialog.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-500 ease-in-out outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Close, { "data-slot": "dialog-close", asChild: true, children: /* @__PURE__ */ jsxRuntime.jsxs(
            Button,
            {
              variant: "ghost",
              className: "absolute top-2 right-2",
              size: "icon-sm",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  lucideReact.XIcon,
                  {}
                ),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          ) })
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      ),
      ...props,
      children: [
        children,
        showCloseButton && /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Close, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "outline", children: "Close" }) })
      ]
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Dialog.Title,
    {
      "data-slot": "dialog-title",
      className: cn(
        "font-heading text-base leading-none font-medium",
        className
      ),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Dialog.Description,
    {
      "data-slot": "dialog-description",
      className: cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      ),
      ...props
    }
  );
}
function SFDialog(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(Dialog, { ...props });
}
function SFDialogTrigger(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(DialogTrigger, { ...props });
}
function SFDialogClose(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(DialogClose, { ...props });
}
function SFDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DialogContent,
    {
      className: cn(
        "rounded-none border-2 border-foreground bg-background shadow-none ring-0",
        className
      ),
      ...props
    }
  );
}
function SFDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DialogHeader,
    {
      className: cn("border-b-2 border-foreground pb-4", className),
      ...props
    }
  );
}
function SFDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DialogFooter,
    {
      className: cn(
        "rounded-none border-t-2 border-foreground bg-muted/30",
        className
      ),
      ...props
    }
  );
}
function SFDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DialogTitle,
    {
      className: cn("font-mono uppercase tracking-wider text-sm", className),
      ...props
    }
  );
}
function SFDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DialogDescription,
    {
      className: cn("text-muted-foreground text-xs uppercase tracking-wide", className),
      ...props
    }
  );
}
function Sheet({ ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Root, { "data-slot": "sheet", ...props });
}
function SheetTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Trigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetClose({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Close, { "data-slot": "sheet-close", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Dialog.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntime.jsxs(
      radixUi.Dialog.Content,
      {
        "data-slot": "sheet-content",
        "data-side": side,
        className: cn(
          "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-[side=bottom]:data-open:slide-in-from-bottom-10 data-[side=left]:data-open:slide-in-from-left-10 data-[side=right]:data-open:slide-in-from-right-10 data-[side=top]:data-open:slide-in-from-top-10 data-closed:animate-out data-closed:fade-out-0 data-[side=bottom]:data-closed:slide-out-to-bottom-10 data-[side=left]:data-closed:slide-out-to-left-10 data-[side=right]:data-closed:slide-out-to-right-10 data-[side=top]:data-closed:slide-out-to-top-10",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntime.jsx(radixUi.Dialog.Close, { "data-slot": "sheet-close", asChild: true, children: /* @__PURE__ */ jsxRuntime.jsxs(
            Button,
            {
              variant: "ghost",
              className: "absolute top-3 right-3",
              size: "icon-sm",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(
                  lucideReact.XIcon,
                  {}
                ),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          ) })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-0.5 p-4", className),
      ...props
    }
  );
}
function SheetFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "sheet-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Dialog.Title,
    {
      "data-slot": "sheet-title",
      className: cn(
        "font-heading text-base font-medium text-foreground",
        className
      ),
      ...props
    }
  );
}
function SheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Dialog.Description,
    {
      "data-slot": "sheet-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}
function SFSheet(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(Sheet, { ...props });
}
function SFSheetTrigger(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(SheetTrigger, { ...props });
}
function SFSheetClose(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(SheetClose, { ...props });
}
function SFSheetContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SheetContent,
    {
      className: cn(
        "rounded-none border-foreground border-2 bg-background shadow-none",
        className
      ),
      ...props
    }
  );
}
function SFSheetHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SheetHeader,
    {
      className: cn("border-b-2 border-foreground pb-4", className),
      ...props
    }
  );
}
function SFSheetFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SheetFooter,
    {
      className: cn("border-t-2 border-foreground bg-muted/30 pt-4", className),
      ...props
    }
  );
}
function SFSheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SheetTitle,
    {
      className: cn("font-mono uppercase tracking-wider text-sm", className),
      ...props
    }
  );
}
function SFSheetDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SheetDescription,
    {
      className: cn("text-muted-foreground text-xs uppercase tracking-wide", className),
      ...props
    }
  );
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.DropdownMenu.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.DropdownMenu.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.DropdownMenu.Portal, { children: /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.DropdownMenu.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      align,
      className: cn("z-50 max-h-(--radix-dropdown-menu-content-available-height) w-(--radix-dropdown-menu-trigger-width) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:overflow-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className),
      ...props
    }
  ) });
}
function DropdownMenuGroup({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.DropdownMenu.Group, { "data-slot": "dropdown-menu-group", ...props });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.DropdownMenu.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuLabel({
  className,
  inset,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.DropdownMenu.Label,
    {
      "data-slot": "dropdown-menu-label",
      "data-inset": inset,
      className: cn(
        "px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.DropdownMenu.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("-mx-1 my-1 h-px bg-border", className),
      ...props
    }
  );
}
function DropdownMenuShortcut({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      "data-slot": "dropdown-menu-shortcut",
      className: cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className
      ),
      ...props
    }
  );
}
function SFDropdownMenu(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(DropdownMenu, { ...props });
}
function SFDropdownMenuTrigger(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuTrigger, { ...props });
}
function SFDropdownMenuContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DropdownMenuContent,
    {
      className: cn(
        "rounded-none border-2 border-foreground bg-background shadow-none ring-0",
        className
      ),
      ...props
    }
  );
}
function SFDropdownMenuGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DropdownMenuGroup,
    {
      className: cn(
        "**:[[data-slot=dropdown-menu-label]]:font-mono **:[[data-slot=dropdown-menu-label]]:uppercase **:[[data-slot=dropdown-menu-label]]:tracking-[0.15em]",
        className
      ),
      ...props
    }
  );
}
function SFDropdownMenuItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DropdownMenuItem,
    {
      className: cn(
        "rounded-none font-mono uppercase tracking-wider text-xs cursor-pointer focus:bg-foreground focus:text-background",
        className
      ),
      ...props
    }
  );
}
function SFDropdownMenuLabel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DropdownMenuLabel,
    {
      className: cn(
        "font-mono uppercase tracking-[0.15em] text-[var(--text-xs)] text-muted-foreground",
        className
      ),
      ...props
    }
  );
}
function SFDropdownMenuShortcut({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DropdownMenuShortcut,
    {
      className: cn("font-mono uppercase tracking-wider text-xs", className),
      ...props
    }
  );
}
function SFDropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DropdownMenuSeparator,
    {
      className: cn("bg-foreground h-[var(--border-element)]", className),
      ...props
    }
  );
}
var toggleVariants = classVarianceAuthority.cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-muted"
      },
      size: {
        default: "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Toggle.Root,
    {
      "data-slot": "toggle",
      className: cn(toggleVariants({ variant, size, className })),
      ...props
    }
  );
}
var sfToggleVariants = classVarianceAuthority.cva(
  "sf-pressable sf-focusable rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs transition-colors duration-[var(--duration-fast)]",
  {
    variants: {
      intent: {
        default: "bg-transparent text-foreground hover:bg-foreground hover:text-background data-[state=on]:bg-foreground data-[state=on]:text-background",
        primary: "bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      },
      size: {
        sm: "h-8 min-w-8 px-3",
        md: "h-10 min-w-10 px-4",
        lg: "h-12 min-w-12 px-6"
      }
    },
    defaultVariants: {
      intent: "default",
      size: "md"
    }
  }
);
function SFToggle({
  intent,
  size,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Toggle,
    {
      className: cn(sfToggleVariants({ intent, size }), className),
      ...props
    }
  );
}
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}) {
  const _values = React7__namespace.useMemo(
    () => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max],
    [value, defaultValue, min, max]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(
    radixUi.Slider.Root,
    {
      "data-slot": "slider",
      defaultValue,
      value,
      min,
      max,
      className: cn(
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          radixUi.Slider.Track,
          {
            "data-slot": "slider-track",
            className: "relative grow overflow-hidden rounded-none bg-muted data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1",
            children: /* @__PURE__ */ jsxRuntime.jsx(
              radixUi.Slider.Range,
              {
                "data-slot": "slider-range",
                className: "absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"
              }
            )
          }
        ),
        Array.from({ length: _values.length }, (_, index) => /* @__PURE__ */ jsxRuntime.jsx(
          radixUi.Slider.Thumb,
          {
            "data-slot": "slider-thumb",
            className: "relative block size-3 shrink-0 rounded-none border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
          },
          index
        ))
      ]
    }
  );
}
function SFSlider({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Slider,
    {
      className: cn(
        "[&_[data-slot=slider-track]]:rounded-none [&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-track]]:bg-muted",
        "[&_[data-slot=slider-range]]:bg-primary",
        "[&_[data-slot=slider-thumb]]:sf-focusable [&_[data-slot=slider-thumb]]:rounded-none [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-foreground [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:ring-0",
        className
      ),
      ...props
    }
  );
}
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}
function InputGroup({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "input-group",
      role: "group",
      className: cn(
        "group/input-group relative flex h-8 w-full min-w-0 items-center rounded-lg border border-input transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-disabled:bg-input/50 has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-disabled:bg-input/80 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
        className
      ),
      ...props
    }
  );
}
var inputGroupAddonVariants = classVarianceAuthority.cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
        "inline-end": "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
        "block-start": "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end": "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2"
      }
    },
    defaultVariants: {
      align: "inline-start"
    }
  }
);
function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      role: "group",
      "data-slot": "input-group-addon",
      "data-align": align,
      className: cn(inputGroupAddonVariants({ align }), className),
      onClick: (e) => {
        if (e.target.closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      },
      ...props
    }
  );
}
var inputGroupButtonVariants = classVarianceAuthority.cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "",
        "icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0"
      }
    },
    defaultVariants: {
      size: "xs"
    }
  }
);
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Button,
    {
      type,
      "data-size": size,
      variant,
      className: cn(inputGroupButtonVariants({ size }), className),
      ...props
    }
  );
}
function InputGroupText({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      className: cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function InputGroupInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Input,
    {
      "data-slot": "input-group-control",
      className: cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      ),
      ...props
    }
  );
}
function InputGroupTextarea({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Textarea,
    {
      "data-slot": "input-group-control",
      className: cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
        className
      ),
      ...props
    }
  );
}
function Command({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    cmdk.Command,
    {
      "data-slot": "command",
      className: cn(
        "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
        className
      ),
      ...props
    }
  );
}
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(Dialog, { ...props, children: [
    /* @__PURE__ */ jsxRuntime.jsxs(DialogHeader, { className: "sr-only", children: [
      /* @__PURE__ */ jsxRuntime.jsx(DialogTitle, { children: title }),
      /* @__PURE__ */ jsxRuntime.jsx(DialogDescription, { children: description })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx(
      DialogContent,
      {
        className: cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
          className
        ),
        showCloseButton,
        children
      }
    )
  ] });
}
function CommandInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { "data-slot": "command-input-wrapper", className: "p-1 pb-0", children: /* @__PURE__ */ jsxRuntime.jsxs(InputGroup, { className: "h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      cmdk.Command.Input,
      {
        "data-slot": "command-input",
        className: cn(
          "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ...props
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(InputGroupAddon, { children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.SearchIcon, { className: "size-4 shrink-0 opacity-50" }) })
  ] }) });
}
function CommandList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    cmdk.Command.List,
    {
      "data-slot": "command-list",
      className: cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      ),
      ...props
    }
  );
}
function CommandEmpty({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    cmdk.Command.Empty,
    {
      "data-slot": "command-empty",
      className: cn("py-6 text-center text-sm", className),
      ...props
    }
  );
}
function CommandGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    cmdk.Command.Group,
    {
      "data-slot": "command-group",
      className: cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      ),
      ...props
    }
  );
}
function CommandSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    cmdk.Command.Separator,
    {
      "data-slot": "command-separator",
      className: cn("-mx-1 h-px bg-border", className),
      ...props
    }
  );
}
function CommandItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    cmdk.Command.Item,
    {
      "data-slot": "command-item",
      className: cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CheckIcon, { className: "ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" })
      ]
    }
  );
}
function CommandShortcut({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      "data-slot": "command-shortcut",
      className: cn(
        "ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground",
        className
      ),
      ...props
    }
  );
}
function SFCommand({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Command,
    {
      className: cn(
        "rounded-none border-2 border-foreground bg-background",
        className
      ),
      ...props
    }
  );
}
function SFCommandDialog({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(CommandDialog, { className: cn("rounded-none", className), ...props });
}
function SFCommandInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    CommandInput,
    {
      className: cn("font-mono uppercase tracking-wider text-xs", className),
      ...props
    }
  );
}
function SFCommandList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    CommandList,
    {
      className: cn("font-mono text-xs", className),
      ...props
    }
  );
}
function SFCommandEmpty({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    CommandEmpty,
    {
      className: cn("font-mono uppercase tracking-wider text-xs", className),
      ...props
    }
  );
}
function SFCommandGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    CommandGroup,
    {
      className: cn(
        "**:[[cmdk-group-heading]]:font-mono **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-[0.15em] **:[[cmdk-group-heading]]:text-[var(--text-xs)]",
        className
      ),
      ...props
    }
  );
}
function SFCommandItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    CommandItem,
    {
      className: cn(
        "rounded-none font-mono uppercase tracking-wider text-xs cursor-pointer data-selected:bg-foreground data-selected:text-background",
        className
      ),
      ...props
    }
  );
}
function SFCommandShortcut({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    CommandShortcut,
    {
      className: cn("font-mono uppercase tracking-wider text-xs", className),
      ...props
    }
  );
}
function SFCommandSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    CommandSeparator,
    {
      className: cn("bg-foreground h-[var(--border-element)]", className),
      ...props
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}
function SFSkeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Skeleton,
    {
      role: "status",
      "aria-label": "Loading...",
      className: cn(
        "rounded-none animate-none sf-skeleton",
        className
      ),
      ...props
    }
  );
}
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Popover.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Popover.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Popover.Portal, { children: /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Popover.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      ),
      ...props
    }
  ) });
}
function PopoverHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "popover-header",
      className: cn("flex flex-col gap-0.5 text-sm", className),
      ...props
    }
  );
}
function PopoverTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "popover-title",
      className: cn("font-heading font-medium", className),
      ...props
    }
  );
}
function PopoverDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "p",
    {
      "data-slot": "popover-description",
      className: cn("text-muted-foreground", className),
      ...props
    }
  );
}
function SFPopover(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(Popover, { ...props });
}
function SFPopoverTrigger(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(PopoverTrigger, { ...props });
}
function SFPopoverContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    PopoverContent,
    {
      className: cn(
        "rounded-none border-2 border-foreground bg-background shadow-none ring-0",
        className
      ),
      ...props
    }
  );
}
function SFPopoverHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    PopoverHeader,
    {
      className: cn("border-b-2 border-foreground pb-2", className),
      ...props
    }
  );
}
function SFPopoverTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    PopoverTitle,
    {
      className: cn("font-mono uppercase tracking-wider text-xs", className),
      ...props
    }
  );
}
function SFPopoverDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    PopoverDescription,
    {
      className: cn("text-muted-foreground text-xs", className),
      ...props
    }
  );
}
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    radixUi.ScrollArea.Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          radixUi.ScrollArea.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntime.jsx(radixUi.ScrollArea.Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.ScrollArea.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      "data-orientation": orientation,
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        radixUi.ScrollArea.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "relative flex-1 rounded-none bg-border"
        }
      )
    }
  );
}
function SFScrollArea({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    ScrollArea,
    {
      className: cn(
        "[&_[data-slot=scroll-area-thumb]]:rounded-none [&_[data-slot=scroll-area-thumb]]:bg-foreground/30",
        className
      ),
      ...props
    }
  );
}
function SFScrollBar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    ScrollBar,
    {
      className: cn(
        "rounded-none [&_[data-slot=scroll-area-scrollbar]]:rounded-none",
        className
      ),
      ...props
    }
  );
}
var labelVariants = classVarianceAuthority.cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Label.Root,
    {
      className: cn(labelVariants(), className),
      ...props
    }
  );
}
function SFLabel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Label,
    {
      className: cn(
        "font-mono uppercase tracking-wider text-xs",
        className
      ),
      ...props
    }
  );
}
var Select = radixUi.Select.Root;
var SelectGroup = radixUi.Select.Group;
var SelectValue = radixUi.Select.Value;
function SelectTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    radixUi.Select.Trigger,
    {
      className: cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsx(radixUi.Select.Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { className: "h-4 w-4 opacity-50" }) })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Select.ScrollUpButton,
    {
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronUp, { className: "h-4 w-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Select.ScrollDownButton,
    {
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDown, { className: "h-4 w-4" })
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Select.Portal, { children: /* @__PURE__ */ jsxRuntime.jsxs(
    radixUi.Select.Content,
    {
      className: cn(
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsxRuntime.jsx(
          radixUi.Select.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectLabel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Select.Label,
    {
      className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
      ...props
    }
  );
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    radixUi.Select.Item,
    {
      className: cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx(radixUi.Select.ItemIndicator, { children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Check, { className: "h-4 w-4" }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(radixUi.Select.ItemText, { children })
      ]
    }
  );
}
function SFSelect(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(Select, { ...props });
}
function SFSelectTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SelectTrigger,
    {
      className: cn(
        "sf-focusable sf-border-draw-focus rounded-none border-2 border-foreground bg-background font-mono uppercase tracking-wider text-xs",
        "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0",
        className
      ),
      ...props
    }
  );
}
function SFSelectContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SelectContent,
    {
      className: cn(
        "rounded-none border-2 border-foreground bg-background shadow-none",
        className
      ),
      ...props
    }
  );
}
function SFSelectItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SelectItem,
    {
      className: cn(
        "rounded-none font-mono uppercase tracking-wider text-xs",
        "focus:bg-foreground focus:text-background",
        className
      ),
      ...props
    }
  );
}
function SFSelectValue(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(SelectValue, { ...props });
}
function SFSelectGroup(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(SelectGroup, { ...props });
}
function SFSelectLabel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SelectLabel,
    {
      className: cn(
        "rounded-none font-mono uppercase tracking-wider text-[var(--text-2xs)] text-muted-foreground px-2 py-1.5",
        className
      ),
      ...props
    }
  );
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Checkbox.Root,
    {
      className: cn(
        "grid place-content-center peer h-4 w-4 shrink-0 rounded-none border-2 border-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        radixUi.Checkbox.Indicator,
        {
          className: cn("grid place-content-center text-current"),
          children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Check, { className: "h-4 w-4" })
        }
      )
    }
  );
}
function SFCheckbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Checkbox,
    {
      className: cn(
        "sf-focusable rounded-none border-2 border-foreground",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      ),
      ...props
    }
  );
}
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.RadioGroup.Root,
    {
      className: cn("grid gap-2", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.RadioGroup.Item,
    {
      className: cn(
        "aspect-square h-4 w-4 rounded-none border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(radixUi.RadioGroup.Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-2 w-2 bg-current" }) })
    }
  );
}
function SFRadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(RadioGroup, { className: cn("grid gap-2", className), ...props });
}
function SFRadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    RadioGroupItem,
    {
      className: cn(
        "sf-focusable rounded-none border-2 border-foreground",
        "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      ),
      ...props
    }
  );
}
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Switch.Root,
    {
      className: cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-none border-2 border-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=unchecked]:bg-input",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        radixUi.Switch.Thumb,
        {
          className: cn(
            "pointer-events-none block h-5 w-5 rounded-none bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
function SFSwitch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Switch,
    {
      className: cn(
        "sf-focusable rounded-none border-2 border-foreground",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        "data-[state=unchecked]:bg-transparent",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "[&>span]:sf-toggle-snap",
        className
      ),
      ...props
    }
  );
}
function SFTextarea({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Textarea,
    {
      className: cn(
        "sf-focusable sf-border-draw-focus rounded-none border-2 border-foreground bg-background",
        "font-mono uppercase tracking-wider text-xs",
        "placeholder:text-muted-foreground placeholder:uppercase placeholder:tracking-wider",
        "shadow-none focus-visible:ring-0",
        className
      ),
      ...props
    }
  );
}
var alertVariants = classVarianceAuthority.cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Alert({
  className,
  variant,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "alert",
      role: "alert",
      className: cn(alertVariants({ variant }), className),
      ...props
    }
  );
}
function AlertTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "alert-title",
      className: cn(
        "font-heading font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      ),
      ...props
    }
  );
}
function AlertDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "alert-description",
      className: cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      ),
      ...props
    }
  );
}
var sfAlertVariants = classVarianceAuthority.cva(
  "rounded-none border-2 font-mono text-sm",
  {
    variants: {
      intent: {
        info: "border-primary bg-primary/10 text-foreground [&>svg]:text-primary",
        warning: "border-accent bg-accent/10 text-foreground [&>svg]:text-accent",
        destructive: "border-destructive bg-destructive/10 text-foreground [&>svg]:text-destructive",
        success: "border-success bg-success/10 text-foreground [&>svg]:text-success"
      }
    },
    defaultVariants: {
      intent: "info"
    }
  }
);
function SFAlert({ intent, className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Alert,
    {
      className: cn(sfAlertVariants({ intent }), className),
      ...props
    }
  );
}
function SFAlertTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    AlertTitle,
    {
      className: cn("font-mono uppercase tracking-wider", className),
      ...props
    }
  );
}
function SFAlertDescription(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(AlertDescription, { ...props });
}
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.AlertDialog.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.AlertDialog.Trigger, { "data-slot": "alert-dialog-trigger", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.AlertDialog.Portal, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.AlertDialog.Overlay,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "fixed inset-0 z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntime.jsx(
      radixUi.AlertDialog.Content,
      {
        "data-slot": "alert-dialog-content",
        "data-size": size,
        className: cn(
          "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      ),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.AlertDialog.Title,
    {
      "data-slot": "alert-dialog-title",
      className: cn(
        "font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      ),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.AlertDialog.Description,
    {
      "data-slot": "alert-dialog-description",
      className: cn(
        "text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      ),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(Button, { variant, size, asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.AlertDialog.Action,
    {
      "data-slot": "alert-dialog-action",
      className: cn(className),
      ...props
    }
  ) });
}
function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(Button, { variant, size, asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.AlertDialog.Cancel,
    {
      "data-slot": "alert-dialog-cancel",
      className: cn(className),
      ...props
    }
  ) });
}
function SFAlertDialog(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(AlertDialog, { ...props });
}
function SFAlertDialogTrigger(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(AlertDialogTrigger, { ...props });
}
function SFAlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    AlertDialogContent,
    {
      className: cn("rounded-none border-2 shadow-none", className),
      ...props
    }
  );
}
function SFAlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(AlertDialogHeader, { className: cn(className), ...props });
}
function SFAlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(AlertDialogFooter, { className: cn("rounded-none", className), ...props });
}
function SFAlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    AlertDialogTitle,
    {
      className: cn("font-mono uppercase tracking-wider", className),
      ...props
    }
  );
}
function SFAlertDialogDescription(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(AlertDialogDescription, { ...props });
}
function SFAlertDialogAction({
  loading,
  disabled,
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    AlertDialogAction,
    {
      disabled: disabled || loading,
      className: cn("rounded-none", className),
      ...props,
      children: [
        loading && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Loader2, { className: "mr-2 size-4 animate-spin" }),
        children
      ]
    }
  );
}
function SFAlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(AlertDialogCancel, { className: cn("rounded-none", className), ...props });
}
function Collapsible({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Collapsible.Root, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Collapsible.CollapsibleTrigger,
    {
      "data-slot": "collapsible-trigger",
      ...props
    }
  );
}
function CollapsibleContent({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Collapsible.CollapsibleContent,
    {
      "data-slot": "collapsible-content",
      ...props
    }
  );
}
function SFCollapsible(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(Collapsible, { ...props });
}
function SFCollapsibleTrigger(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(CollapsibleTrigger, { ...props });
}
function SFCollapsibleContent(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(CollapsibleContent, { ...props });
}
function Avatar({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Avatar.Root,
    {
      "data-slot": "avatar",
      "data-size": size,
      className: cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Avatar.Image,
    {
      "data-slot": "avatar-image",
      className: cn(
        "aspect-square size-full rounded-full object-cover",
        className
      ),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Avatar.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      ),
      ...props
    }
  );
}
function SFAvatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Avatar,
    {
      className: cn("rounded-none after:rounded-none", className),
      ...props
    }
  );
}
function SFAvatarImage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(AvatarImage, { className: cn("rounded-none", className), ...props });
}
function SFAvatarFallback({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(AvatarFallback, { className: cn("rounded-none", className), ...props, children: children ?? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.User, { className: "size-[60%] text-foreground" }) });
}
function Breadcrumb({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "nav",
    {
      "aria-label": "breadcrumb",
      "data-slot": "breadcrumb",
      className: cn(className),
      ...props
    }
  );
}
function BreadcrumbList({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "ol",
    {
      "data-slot": "breadcrumb-list",
      className: cn(
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground",
        className
      ),
      ...props
    }
  );
}
function BreadcrumbItem({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "li",
    {
      "data-slot": "breadcrumb-item",
      className: cn("inline-flex items-center gap-1", className),
      ...props
    }
  );
}
function BreadcrumbLink({
  asChild,
  className,
  ...props
}) {
  const Comp = asChild ? radixUi.Slot.Root : "a";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      "data-slot": "breadcrumb-link",
      className: cn("transition-colors hover:text-foreground", className),
      ...props
    }
  );
}
function BreadcrumbPage({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      "data-slot": "breadcrumb-page",
      role: "link",
      "aria-disabled": "true",
      "aria-current": "page",
      className: cn("font-normal text-foreground", className),
      ...props
    }
  );
}
function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "li",
    {
      "data-slot": "breadcrumb-separator",
      role: "presentation",
      "aria-hidden": "true",
      className: cn("[&>svg]:size-3.5", className),
      ...props,
      children: children ?? /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRightIcon, {})
    }
  );
}
function SFBreadcrumb(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(Breadcrumb, { ...props });
}
function SFBreadcrumbList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(BreadcrumbList, { className: cn("font-mono", className), ...props });
}
function SFBreadcrumbItem(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(BreadcrumbItem, { ...props });
}
function SFBreadcrumbLink(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(BreadcrumbLink, { ...props });
}
function SFBreadcrumbPage(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(BreadcrumbPage, { ...props });
}
function SFBreadcrumbSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(BreadcrumbSeparator, { className: cn("font-mono", className), ...props, children: "/" });
}
function Pagination({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "nav",
    {
      role: "navigation",
      "aria-label": "pagination",
      "data-slot": "pagination",
      className: cn("mx-auto flex w-full justify-center", className),
      ...props
    }
  );
}
function PaginationContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "ul",
    {
      "data-slot": "pagination-content",
      className: cn("flex items-center gap-0.5", className),
      ...props
    }
  );
}
function PaginationItem({ ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx("li", { "data-slot": "pagination-item", ...props });
}
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Button,
    {
      asChild: true,
      variant: isActive ? "outline" : "ghost",
      size,
      className: cn(className),
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "a",
        {
          "aria-current": isActive ? "page" : void 0,
          "data-slot": "pagination-link",
          "data-active": isActive,
          ...props
        }
      )
    }
  );
}
function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    PaginationLink,
    {
      "aria-label": "Go to previous page",
      size: "default",
      className: cn("pl-1.5!", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronLeftIcon, { "data-icon": "inline-start" }),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "hidden sm:block", children: text })
      ]
    }
  );
}
function PaginationNext({
  className,
  text = "Next",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    PaginationLink,
    {
      "aria-label": "Go to next page",
      size: "default",
      className: cn("pr-1.5!", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "hidden sm:block", children: text }),
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronRightIcon, { "data-icon": "inline-end" })
      ]
    }
  );
}
function SFPagination({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(Pagination, { className: cn("font-mono", className), ...props });
}
function SFPaginationContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(PaginationContent, { className: cn("gap-0", className), ...props });
}
function SFPaginationItem(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(PaginationItem, { ...props });
}
function SFPaginationLink({
  className,
  isActive,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    PaginationLink,
    {
      isActive,
      className: cn(
        "rounded-none border-2 border-foreground uppercase tracking-wider text-xs font-mono",
        isActive ? "bg-foreground text-background hover:bg-foreground hover:text-background" : "bg-transparent text-foreground hover:bg-foreground hover:text-background",
        className
      ),
      ...props
    }
  );
}
function SFPaginationPrevious({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    PaginationPrevious,
    {
      className: cn(
        "rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs",
        className
      ),
      ...props
    }
  );
}
function SFPaginationNext({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    PaginationNext,
    {
      className: cn(
        "rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs",
        className
      ),
      ...props
    }
  );
}
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    radixUi.NavigationMenu.Root,
    {
      "data-slot": "navigation-menu",
      "data-viewport": viewport,
      className: cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      ),
      ...props,
      children: [
        children,
        viewport && /* @__PURE__ */ jsxRuntime.jsx(NavigationMenuViewport, {})
      ]
    }
  );
}
function NavigationMenuList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.NavigationMenu.List,
    {
      "data-slot": "navigation-menu-list",
      className: cn(
        "group flex flex-1 list-none items-center justify-center gap-0",
        className
      ),
      ...props
    }
  );
}
function NavigationMenuItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.NavigationMenu.Item,
    {
      "data-slot": "navigation-menu-item",
      className: cn("relative", className),
      ...props
    }
  );
}
var navigationMenuTriggerStyle = classVarianceAuthority.cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted data-open:bg-muted/50 data-open:hover:bg-muted data-open:focus:bg-muted"
);
function NavigationMenuTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    radixUi.NavigationMenu.Trigger,
    {
      "data-slot": "navigation-menu-trigger",
      className: cn(navigationMenuTriggerStyle(), "group", className),
      ...props,
      children: [
        children,
        " ",
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDownIcon, { className: "relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180", "aria-hidden": "true" })
      ]
    }
  );
}
function NavigationMenuContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.NavigationMenu.Content,
    {
      "data-slot": "navigation-menu-content",
      className: cn(
        "top-0 left-0 w-full p-1 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95",
        className
      ),
      ...props
    }
  );
}
function NavigationMenuViewport({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      className: cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      ),
      children: /* @__PURE__ */ jsxRuntime.jsx(
        radixUi.NavigationMenu.Viewport,
        {
          "data-slot": "navigation-menu-viewport",
          className: cn(
            "origin-top-center relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 duration-100 md:w-(--radix-navigation-menu-viewport-width) data-open:animate-in data-open:zoom-in-90 data-closed:animate-out data-closed:zoom-out-90",
            className
          ),
          ...props
        }
      )
    }
  );
}
function NavigationMenuLink({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.NavigationMenu.Link,
    {
      "data-slot": "navigation-menu-link",
      className: cn(
        "flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function SFNavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    NavigationMenu,
    {
      viewport,
      className: cn("rounded-none font-mono", className),
      ...props,
      children
    }
  );
}
function SFNavigationMenuList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(NavigationMenuList, { className: cn(className), ...props });
}
function SFNavigationMenuItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(NavigationMenuItem, { className: cn(className), ...props });
}
function SFNavigationMenuTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    NavigationMenuTrigger,
    {
      className: cn(
        "sf-focusable rounded-none font-mono uppercase tracking-wider text-xs border-2 border-transparent hover:border-foreground data-popup-open:border-foreground transition-colors duration-[var(--duration-fast)]",
        "focus-visible:ring-0 focus-visible:outline-none",
        className
      ),
      ...props
    }
  );
}
function SFNavigationMenuContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    NavigationMenuContent,
    {
      className: cn("rounded-none", className),
      ...props
    }
  );
}
function SFNavigationMenuLink({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    NavigationMenuLink,
    {
      className: cn(
        "rounded-none font-mono text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors",
        className
      ),
      ...props
    }
  );
}
function SFNavigationMenuViewport({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    NavigationMenuViewport,
    {
      className: cn(
        "rounded-none border-2 border-foreground shadow-none ring-0",
        className
      ),
      ...props
    }
  );
}
function SFNavigationMenuMobile({
  children,
  className,
  title = "NAVIGATION"
}) {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: cn("md:hidden", className), children: /* @__PURE__ */ jsxRuntime.jsxs(SFSheet, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      SFSheetTrigger,
      {
        "aria-label": "Open navigation menu",
        className: "sf-focusable sf-pressable inline-flex items-center justify-center size-10 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors",
        children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Menu, { className: "size-5" })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(SFSheetContent, { side: "left", children: [
      /* @__PURE__ */ jsxRuntime.jsx(SFSheetHeader, { children: /* @__PURE__ */ jsxRuntime.jsx(SFSheetTitle, { children: title }) }),
      /* @__PURE__ */ jsxRuntime.jsx("nav", { className: "flex flex-col gap-1 mt-4", children })
    ] })
  ] }) });
}
var sfToggleGroupItemVariants = classVarianceAuthority.cva(
  "sf-pressable sf-focusable rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs transition-colors duration-[var(--duration-fast)]",
  {
    variants: {
      intent: {
        ghost: "bg-transparent text-foreground hover:bg-foreground hover:text-background data-[state=on]:bg-foreground data-[state=on]:text-background",
        primary: "bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
      },
      size: {
        sm: "h-8 min-w-8 px-3",
        md: "h-10 min-w-10 px-4",
        lg: "h-12 min-w-12 px-6"
      }
    },
    defaultVariants: {
      intent: "ghost",
      size: "md"
    }
  }
);
var SFToggleGroupContext = React7__namespace.createContext({});
function SFToggleGroup({
  className,
  intent,
  size,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.ToggleGroup.Root,
    {
      "data-slot": "toggle-group",
      className: cn(
        "flex w-fit items-center gap-0 rounded-none",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(SFToggleGroupContext.Provider, { value: { intent, size }, children })
    }
  );
}
function SFToggleGroupItem({
  className,
  intent,
  size,
  children,
  ...props
}) {
  const context = React7__namespace.useContext(SFToggleGroupContext);
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.ToggleGroup.Item,
    {
      "data-slot": "toggle-group-item",
      className: cn(
        sfToggleGroupItemVariants({
          intent: context.intent ?? intent,
          size: context.size ?? size
        }),
        className
      ),
      ...props,
      children
    }
  );
}
function SFInputGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    InputGroup,
    {
      className: cn("rounded-none border-foreground", className),
      ...props
    }
  );
}
function SFInputGroupAddon({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    InputGroupAddon,
    {
      className: cn("rounded-none [&>kbd]:rounded-none", className),
      ...props
    }
  );
}
function SFInputGroupButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    InputGroupButton,
    {
      className: cn("rounded-none", className),
      ...props
    }
  );
}
function SFInputGroupText({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(InputGroupText, { className: cn("rounded-none", className), ...props });
}
function SFInputGroupInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    InputGroupInput,
    {
      className: cn("rounded-none", className),
      ...props
    }
  );
}
function SFInputGroupTextarea({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    InputGroupTextarea,
    {
      className: cn("rounded-none", className),
      ...props
    }
  );
}
function InputOTP({
  className,
  containerClassName,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    inputOtp.OTPInput,
    {
      "data-slot": "input-otp",
      containerClassName: cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      ),
      spellCheck: false,
      className: cn("disabled:cursor-not-allowed", className),
      ...props
    }
  );
}
function InputOTPGroup({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "input-otp-group",
      className: cn(
        "flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}
function InputOTPSlot({
  index,
  className,
  ...props
}) {
  const inputOTPContext = React7__namespace.useContext(inputOtp.OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      "data-slot": "input-otp-slot",
      "data-active": isActive,
      className: cn(
        "relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" }) })
      ]
    }
  );
}
function InputOTPSeparator({ ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "input-otp-separator",
      className: "flex items-center [&_svg:not([class*='size-'])]:size-4",
      role: "separator",
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        lucideReact.MinusIcon,
        {}
      )
    }
  );
}
function SFInputOTP({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(InputOTP, { className: cn("font-mono", className), ...props });
}
function SFInputOTPGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(InputOTPGroup, { className: cn("rounded-none", className), ...props });
}
function SFInputOTPSlot({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    InputOTPSlot,
    {
      className: cn(
        "rounded-none border-2 border-foreground first:rounded-none last:rounded-none data-[active=true]:border-primary data-[active=true]:ring-1 data-[active=true]:ring-primary",
        className
      ),
      ...props
    }
  );
}
function SFInputOTPSeparator(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(InputOTPSeparator, { ...props });
}
function HoverCard({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.HoverCard.Root, { "data-slot": "hover-card", ...props });
}
function HoverCardTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.HoverCard.Trigger, { "data-slot": "hover-card-trigger", ...props });
}
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.HoverCard.Portal, { "data-slot": "hover-card-portal", children: /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.HoverCard.Content,
    {
      "data-slot": "hover-card-content",
      align,
      sideOffset,
      className: cn(
        "z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      ),
      ...props
    }
  ) });
}
function SFHoverCard(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(HoverCard, { ...props });
}
function SFHoverCardTrigger(props) {
  return /* @__PURE__ */ jsxRuntime.jsx(HoverCardTrigger, { ...props });
}
function SFHoverCardContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    HoverCardContent,
    {
      className: cn(
        "rounded-none border-2 border-foreground bg-background shadow-none ring-0",
        className
      ),
      ...props
    }
  );
}

// lib/theme.ts
function toggleTheme(currentDark) {
  const next = !currentDark;
  try {
    localStorage.setItem("sf-theme", next ? "dark" : "light");
  } catch {
  }
  const root = document.documentElement;
  root.classList.add("sf-no-transition");
  root.classList.toggle("dark", next);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.classList.remove("sf-no-transition");
    });
  });
  return next;
}
var SignalframeContext = React7.createContext(null);
async function getGsap() {
  try {
    const mod = await import('gsap');
    return mod.default ?? mod;
  } catch {
    return null;
  }
}
function createSignalframeUX(config = {}) {
  function SignalframeProvider({ children }) {
    const [isDark, setIsDark] = React7.useState(true);
    const [prefersReduced, setPrefersReduced] = React7.useState(false);
    React7.useEffect(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    }, []);
    const prefersReducedRef = React7.useRef(prefersReduced);
    React7.useEffect(() => {
      prefersReducedRef.current = prefersReduced;
    }, [prefersReduced]);
    React7.useEffect(() => {
      const pref = config.motionPreference ?? "system";
      if (pref === "reduced") {
        getGsap().then((gsap) => {
          if (!gsap) return;
          gsap.globalTimeline.timeScale(0);
        }).catch(() => {
        });
        setPrefersReduced(true);
        return;
      }
      if (pref === "full") {
        getGsap().then((gsap) => {
          if (!gsap) return;
          gsap.globalTimeline.timeScale(1);
        }).catch(() => {
        });
        setPrefersReduced(false);
        return;
      }
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      const apply = (matches) => {
        getGsap().then((gsap) => {
          if (!gsap) return;
          gsap.globalTimeline.timeScale(matches ? 0 : 1);
        }).catch(() => {
        });
        setPrefersReduced(matches);
      };
      apply(mql.matches);
      const handler = (e) => apply(e.matches);
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }, []);
    const setTheme = (theme) => {
      const wantDark = theme === "dark";
      if (isDark !== wantDark) {
        const nextDark = toggleTheme(isDark);
        setIsDark(nextDark);
      }
    };
    const motion = React7.useMemo(() => ({
      pause: () => {
        getGsap().then((gsap) => gsap?.globalTimeline.pause()).catch(() => {
        });
      },
      resume: () => {
        getGsap().then((gsap) => {
          if (!prefersReducedRef.current) gsap?.globalTimeline.resume();
        }).catch(() => {
        });
      },
      prefersReduced
    }), [prefersReduced]);
    return /* @__PURE__ */ jsxRuntime.jsx(SignalframeContext.Provider, { value: { theme: isDark ? "dark" : "light", setTheme, motion }, children });
  }
  function useSignalframe2() {
    const ctx = React7.useContext(SignalframeContext);
    if (ctx === null) {
      throw new Error(
        "[SignalframeUX] useSignalframe() must be called inside a <SignalframeProvider>. Wrap your app root with createSignalframeUX(config) and mount the returned SignalframeProvider."
      );
    }
    return ctx;
  }
  return { SignalframeProvider, useSignalframe: useSignalframe2 };
}
function useSignalframe() {
  const ctx = React7.useContext(SignalframeContext);
  if (ctx === null) {
    throw new Error(
      "[SignalframeUX] useSignalframe() must be called inside a <SignalframeProvider>. Wrap your app root with createSignalframeUX(config) and mount the returned SignalframeProvider."
    );
  }
  return ctx;
}

// lib/grain.ts
var GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='sf-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sf-grain)'/%3E%3C/svg%3E")`;
var SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
var SCRAMBLE_KEY = "__sf_scramble";
function getScrambleState() {
  const g = globalThis;
  if (!g[SCRAMBLE_KEY]) {
    g[SCRAMBLE_KEY] = { registry: /* @__PURE__ */ new Map(), raf: 0, mountTime: 0 };
  }
  return g[SCRAMBLE_KEY];
}
function scrambleTick() {
  const s = getScrambleState();
  const now = Date.now();
  let allDone = true;
  s.registry.forEach((entry) => {
    if (entry.done) return;
    allDone = false;
    if (!entry.started) {
      if (now - s.mountTime < entry.delay) return;
      entry.started = true;
      entry.startTime = now;
    }
    const elapsed = now - entry.startTime;
    const progress = Math.min(elapsed / entry.duration, 1);
    const chars = entry.target.split("");
    const result = chars.map((c, i) => {
      if (c === " ") return " ";
      const settleAt = i / chars.length * 0.7 + 0.3;
      if (progress >= settleAt || entry.settled.has(i)) {
        entry.settled.add(i);
        return c;
      }
      return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
    });
    entry.setText(result.join(""));
    if (entry.settled.size >= chars.filter((c) => c !== " ").length) {
      entry.done = true;
    }
  });
  if (!allDone) {
    s.raf = requestAnimationFrame(scrambleTick);
  } else {
    s.raf = 0;
  }
}
function useScrambleText(target, delay, duration = 600) {
  const [text, setText] = React7.useState(target);
  const reactId = React7.useId();
  const idRef = React7.useRef(reactId);
  React7.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 768) return;
    const id = idRef.current;
    const s = getScrambleState();
    setText(target.split("").map(
      (c) => c === " " ? " " : SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]
    ).join(""));
    s.registry.set(id, {
      target,
      delay,
      duration,
      settled: /* @__PURE__ */ new Set(),
      startTime: 0,
      started: false,
      done: false,
      setText
    });
    if (s.registry.size === 1) {
      s.mountTime = Date.now();
    }
    if (!s.raf) {
      s.raf = requestAnimationFrame(scrambleTick);
    }
    return () => {
      s.registry.delete(id);
      if (s.registry.size === 0) {
        if (s.raf) {
          cancelAnimationFrame(s.raf);
          s.raf = 0;
        }
        s.mountTime = 0;
      }
    };
  }, [target, delay, duration]);
  return text;
}
var SESSION_KEYS = {
  COMPONENTS_FILTER: "sfux.components.filter",
  TOKENS_TAB: "sfux.tokens.tab",
  DETAIL_OPEN: "sfux.detail.open",
  COMPONENTS_LAYER: "sfux.components.layer",
  // layer filter persistence (FRAME | SIGNAL | ALL)
  COMPONENTS_PATTERN: "sfux.components.pattern"
  // pattern filter persistence (A | B | C | ALL)
};
function useSessionState(key, defaultValue) {
  const [state, setState] = React7.useState(defaultValue);
  React7.useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored));
      }
    } catch {
    }
  }, [key]);
  const set = React7.useCallback(
    (value) => {
      setState(value);
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch {
      }
    },
    [key]
  );
  return [state, set];
}

exports.GRAIN_SVG = GRAIN_SVG;
exports.SESSION_KEYS = SESSION_KEYS;
exports.SFAlert = SFAlert;
exports.SFAlertDescription = SFAlertDescription;
exports.SFAlertDialog = SFAlertDialog;
exports.SFAlertDialogAction = SFAlertDialogAction;
exports.SFAlertDialogCancel = SFAlertDialogCancel;
exports.SFAlertDialogContent = SFAlertDialogContent;
exports.SFAlertDialogDescription = SFAlertDialogDescription;
exports.SFAlertDialogFooter = SFAlertDialogFooter;
exports.SFAlertDialogHeader = SFAlertDialogHeader;
exports.SFAlertDialogTitle = SFAlertDialogTitle;
exports.SFAlertDialogTrigger = SFAlertDialogTrigger;
exports.SFAlertTitle = SFAlertTitle;
exports.SFAvatar = SFAvatar;
exports.SFAvatarFallback = SFAvatarFallback;
exports.SFAvatarImage = SFAvatarImage;
exports.SFBadge = SFBadge;
exports.SFBreadcrumb = SFBreadcrumb;
exports.SFBreadcrumbItem = SFBreadcrumbItem;
exports.SFBreadcrumbLink = SFBreadcrumbLink;
exports.SFBreadcrumbList = SFBreadcrumbList;
exports.SFBreadcrumbPage = SFBreadcrumbPage;
exports.SFBreadcrumbSeparator = SFBreadcrumbSeparator;
exports.SFButton = SFButton;
exports.SFCard = SFCard;
exports.SFCardContent = SFCardContent;
exports.SFCardDescription = SFCardDescription;
exports.SFCardFooter = SFCardFooter;
exports.SFCardHeader = SFCardHeader;
exports.SFCardTitle = SFCardTitle;
exports.SFCheckbox = SFCheckbox;
exports.SFCollapsible = SFCollapsible;
exports.SFCollapsibleContent = SFCollapsibleContent;
exports.SFCollapsibleTrigger = SFCollapsibleTrigger;
exports.SFCommand = SFCommand;
exports.SFCommandDialog = SFCommandDialog;
exports.SFCommandEmpty = SFCommandEmpty;
exports.SFCommandGroup = SFCommandGroup;
exports.SFCommandInput = SFCommandInput;
exports.SFCommandItem = SFCommandItem;
exports.SFCommandList = SFCommandList;
exports.SFCommandSeparator = SFCommandSeparator;
exports.SFCommandShortcut = SFCommandShortcut;
exports.SFContainer = SFContainer;
exports.SFDialog = SFDialog;
exports.SFDialogClose = SFDialogClose;
exports.SFDialogContent = SFDialogContent;
exports.SFDialogDescription = SFDialogDescription;
exports.SFDialogFooter = SFDialogFooter;
exports.SFDialogHeader = SFDialogHeader;
exports.SFDialogTitle = SFDialogTitle;
exports.SFDialogTrigger = SFDialogTrigger;
exports.SFDropdownMenu = SFDropdownMenu;
exports.SFDropdownMenuContent = SFDropdownMenuContent;
exports.SFDropdownMenuGroup = SFDropdownMenuGroup;
exports.SFDropdownMenuItem = SFDropdownMenuItem;
exports.SFDropdownMenuLabel = SFDropdownMenuLabel;
exports.SFDropdownMenuSeparator = SFDropdownMenuSeparator;
exports.SFDropdownMenuShortcut = SFDropdownMenuShortcut;
exports.SFDropdownMenuTrigger = SFDropdownMenuTrigger;
exports.SFGrid = SFGrid;
exports.SFHoverCard = SFHoverCard;
exports.SFHoverCardContent = SFHoverCardContent;
exports.SFHoverCardTrigger = SFHoverCardTrigger;
exports.SFInput = SFInput;
exports.SFInputGroup = SFInputGroup;
exports.SFInputGroupAddon = SFInputGroupAddon;
exports.SFInputGroupButton = SFInputGroupButton;
exports.SFInputGroupInput = SFInputGroupInput;
exports.SFInputGroupText = SFInputGroupText;
exports.SFInputGroupTextarea = SFInputGroupTextarea;
exports.SFInputOTP = SFInputOTP;
exports.SFInputOTPGroup = SFInputOTPGroup;
exports.SFInputOTPSeparator = SFInputOTPSeparator;
exports.SFInputOTPSlot = SFInputOTPSlot;
exports.SFLabel = SFLabel;
exports.SFNavigationMenu = SFNavigationMenu;
exports.SFNavigationMenuContent = SFNavigationMenuContent;
exports.SFNavigationMenuItem = SFNavigationMenuItem;
exports.SFNavigationMenuLink = SFNavigationMenuLink;
exports.SFNavigationMenuList = SFNavigationMenuList;
exports.SFNavigationMenuMobile = SFNavigationMenuMobile;
exports.SFNavigationMenuTrigger = SFNavigationMenuTrigger;
exports.SFNavigationMenuViewport = SFNavigationMenuViewport;
exports.SFPagination = SFPagination;
exports.SFPaginationContent = SFPaginationContent;
exports.SFPaginationItem = SFPaginationItem;
exports.SFPaginationLink = SFPaginationLink;
exports.SFPaginationNext = SFPaginationNext;
exports.SFPaginationPrevious = SFPaginationPrevious;
exports.SFPopover = SFPopover;
exports.SFPopoverContent = SFPopoverContent;
exports.SFPopoverDescription = SFPopoverDescription;
exports.SFPopoverHeader = SFPopoverHeader;
exports.SFPopoverTitle = SFPopoverTitle;
exports.SFPopoverTrigger = SFPopoverTrigger;
exports.SFRadioGroup = SFRadioGroup;
exports.SFRadioGroupItem = SFRadioGroupItem;
exports.SFScrollArea = SFScrollArea;
exports.SFScrollBar = SFScrollBar;
exports.SFSection = SFSection;
exports.SFSelect = SFSelect;
exports.SFSelectContent = SFSelectContent;
exports.SFSelectGroup = SFSelectGroup;
exports.SFSelectItem = SFSelectItem;
exports.SFSelectLabel = SFSelectLabel;
exports.SFSelectTrigger = SFSelectTrigger;
exports.SFSelectValue = SFSelectValue;
exports.SFSeparator = SFSeparator;
exports.SFSheet = SFSheet;
exports.SFSheetClose = SFSheetClose;
exports.SFSheetContent = SFSheetContent;
exports.SFSheetDescription = SFSheetDescription;
exports.SFSheetFooter = SFSheetFooter;
exports.SFSheetHeader = SFSheetHeader;
exports.SFSheetTitle = SFSheetTitle;
exports.SFSheetTrigger = SFSheetTrigger;
exports.SFSkeleton = SFSkeleton;
exports.SFSlider = SFSlider;
exports.SFStack = SFStack;
exports.SFSwitch = SFSwitch;
exports.SFTable = SFTable;
exports.SFTableBody = SFTableBody;
exports.SFTableCell = SFTableCell;
exports.SFTableHead = SFTableHead;
exports.SFTableHeader = SFTableHeader;
exports.SFTableRow = SFTableRow;
exports.SFTabs = SFTabs;
exports.SFTabsContent = SFTabsContent;
exports.SFTabsList = SFTabsList;
exports.SFTabsTrigger = SFTabsTrigger;
exports.SFText = SFText;
exports.SFTextarea = SFTextarea;
exports.SFToggle = SFToggle;
exports.SFToggleGroup = SFToggleGroup;
exports.SFToggleGroupItem = SFToggleGroupItem;
exports.SFTooltip = SFTooltip;
exports.SFTooltipContent = SFTooltipContent;
exports.SFTooltipTrigger = SFTooltipTrigger;
exports.cn = cn;
exports.createSignalframeUX = createSignalframeUX;
exports.toggleTheme = toggleTheme;
exports.useScrambleText = useScrambleText;
exports.useSessionState = useSessionState;
exports.useSignalframe = useSignalframe;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map