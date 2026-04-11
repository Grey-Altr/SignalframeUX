'use strict';

var React = require('react');
var radixUi = require('radix-ui');
var clsx = require('clsx');
var tailwindMerge = require('tailwind-merge');
var lucideReact = require('lucide-react');
var jsxRuntime = require('react/jsx-runtime');
var gsap = require('gsap');
var ScrollTrigger = require('gsap/ScrollTrigger');
var Observer = require('gsap/Observer');
var react = require('@gsap/react');
var sonner = require('sonner');
var SplitText = require('gsap/SplitText');
var ScrambleTextPlugin = require('gsap/ScrambleTextPlugin');
var CustomEase$1 = require('gsap/CustomEase');
var Flip = require('gsap/Flip');
var DrawSVGPlugin = require('gsap/DrawSVGPlugin');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

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

var React__namespace = /*#__PURE__*/_interopNamespace(React);
var gsap__default = /*#__PURE__*/_interopDefault(gsap);

// components/sf/sf-accordion.tsx
function cn(...inputs) {
  return tailwindMerge.twMerge(clsx.clsx(inputs));
}
function Accordion({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Accordion.Root,
    {
      "data-slot": "accordion",
      className: cn("flex w-full flex-col", className),
      ...props
    }
  );
}
function AccordionItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Accordion.Item,
    {
      "data-slot": "accordion-item",
      className: cn("not-last:border-b", className),
      ...props
    }
  );
}
function AccordionTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(radixUi.Accordion.Header, { className: "flex", children: /* @__PURE__ */ jsxRuntime.jsxs(
    radixUi.Accordion.Trigger,
    {
      "data-slot": "accordion-trigger",
      className: cn(
        "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDownIcon, { "data-slot": "accordion-trigger-icon", className: "pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" }),
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronUpIcon, { "data-slot": "accordion-trigger-icon", className: "pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" })
      ]
    }
  ) });
}
function AccordionContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Accordion.Content,
    {
      "data-slot": "accordion-content",
      className: "overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up",
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "div",
        {
          className: cn(
            "h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
            className
          ),
          children
        }
      )
    }
  );
}
if (typeof window !== "undefined") {
  gsap__default.default.registerPlugin(ScrollTrigger.ScrollTrigger, Observer.Observer, react.useGSAP);
}
function SFAccordion({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    Accordion,
    {
      className: cn("flex w-full flex-col", className),
      ...props
    }
  );
}
function SFAccordionItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    AccordionItem,
    {
      className: cn(
        "rounded-none border-b border-foreground/20",
        className
      ),
      ...props
    }
  );
}
function SFAccordionTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    AccordionTrigger,
    {
      className: cn("rounded-none", className),
      ...props
    }
  );
}
function SFAccordionContent({
  className,
  children,
  ...props
}) {
  const contentRef = React.useRef(null);
  const tweenRef = React.useRef(null);
  const animateChildren = React.useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const childElements = el.children;
    if (childElements.length === 0) return;
    if (tweenRef.current) {
      tweenRef.current.kill();
    }
    tweenRef.current = gsap__default.default.fromTo(
      childElements,
      { opacity: 0, y: 8 },
      {
        opacity: 1,
        y: 0,
        duration: 0.2,
        stagger: 0.05,
        ease: "power2.out"
      }
    );
  }, []);
  React.useEffect(() => {
    animateChildren();
    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
    };
  }, [animateChildren]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    AccordionContent,
    {
      className: cn("rounded-none", className),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx("div", { ref: contentRef, children })
    }
  );
}
function SFProgress({ className, value, ...props }) {
  const indicatorRef = React.useRef(null);
  React.useEffect(() => {
    const el = indicatorRef.current;
    if (!el) return;
    const targetX = -(100 - (value || 0));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap__default.default.set(el, { xPercent: targetX });
      return;
    }
    const tween = gsap__default.default.to(el, {
      xPercent: targetX,
      duration: 0.2,
      ease: "power2.out"
    });
    return () => {
      tween.kill();
    };
  }, [value]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    radixUi.Progress.Root,
    {
      "data-slot": "progress",
      className: cn(
        "relative flex h-1 w-full items-center overflow-x-hidden rounded-none bg-muted",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        radixUi.Progress.Indicator,
        {
          ref: indicatorRef,
          "data-slot": "progress-indicator",
          className: "size-full flex-1 rounded-none bg-primary",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
var statusColors = {
  active: "bg-success",
  idle: "bg-accent",
  offline: "bg-muted-foreground"
};
function SFStatusDot({ status = "idle", className }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (status !== "active" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap__default.default.to(ref.current, {
      opacity: 0.4,
      duration: 0.2,
      ease: "power2.out",
      repeat: -1,
      yoyo: true
    });
    return () => {
      tween.kill();
    };
  }, [status]);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      ref,
      role: "status",
      "aria-label": status,
      className: cn("size-2", statusColors[status], className)
    }
  );
}
var intentBorder = {
  default: "border-foreground",
  success: "border-success",
  destructive: "border-destructive",
  warning: "border-warning"
};
function SFToastContent({
  title,
  description,
  icon,
  intent = "default",
  onDismiss
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap__default.default.fromTo(
      ref.current,
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.2, ease: "power2.out" }
    );
    return () => {
      tween.kill();
    };
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      ref,
      className: cn(
        "flex flex-row items-start border-2 bg-background text-foreground font-mono rounded-none p-4 shadow-none",
        intentBorder[intent] ?? intentBorder.default
      ),
      children: [
        icon && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "mr-3 mt-0.5 shrink-0", children: icon }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm font-mono uppercase tracking-wider", children: title }),
          description && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: description })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(
          "button",
          {
            type: "button",
            onClick: onDismiss,
            "aria-label": "Dismiss",
            className: "ml-3 shrink-0 text-foreground hover:text-primary transition-colors duration-100",
            children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "size-4" })
          }
        )
      ]
    }
  );
}
function SFToaster() {
  return /* @__PURE__ */ jsxRuntime.jsx(
    sonner.Toaster,
    {
      position: "bottom-left",
      theme: "dark",
      toastOptions: { unstyled: true },
      gap: 8,
      offset: 16,
      style: { zIndex: 100 }
    }
  );
}
var sfToast = {
  default: (title, opts) => sonner.toast.custom((id) => /* @__PURE__ */ jsxRuntime.jsx(SFToastContent, { title, onDismiss: () => sonner.toast.dismiss(id), ...opts })),
  success: (title, opts) => sonner.toast.custom((id) => /* @__PURE__ */ jsxRuntime.jsx(
    SFToastContent,
    {
      title,
      icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Check, { className: "size-4" }),
      intent: "success",
      onDismiss: () => sonner.toast.dismiss(id),
      ...opts
    }
  )),
  error: (title, opts) => sonner.toast.custom((id) => /* @__PURE__ */ jsxRuntime.jsx(
    SFToastContent,
    {
      title,
      icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertTriangle, { className: "size-4" }),
      intent: "destructive",
      onDismiss: () => sonner.toast.dismiss(id),
      ...opts
    }
  )),
  warning: (title, opts) => sonner.toast.custom((id) => /* @__PURE__ */ jsxRuntime.jsx(
    SFToastContent,
    {
      title,
      icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertCircle, { className: "size-4" }),
      intent: "warning",
      onDismiss: () => sonner.toast.dismiss(id),
      ...opts
    }
  )),
  info: (title, opts) => sonner.toast.custom((id) => /* @__PURE__ */ jsxRuntime.jsx(
    SFToastContent,
    {
      title,
      icon: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Info, { className: "size-4" }),
      onDismiss: () => sonner.toast.dismiss(id),
      ...opts
    }
  ))
};
function getConnectorValue(status) {
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
function SFStepper({ activeStep: _activeStep, children, className }) {
  const steps = React__namespace.Children.toArray(children);
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      role: "group",
      "aria-label": "Progress steps",
      className: cn("flex flex-col", className),
      children: steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const stepElement = step;
        const status = stepElement.props?.status ?? "pending";
        return /* @__PURE__ */ jsxRuntime.jsxs(React__namespace.Fragment, { children: [
          step,
          !isLast && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex justify-center py-1 pl-4", children: /* @__PURE__ */ jsxRuntime.jsx(
            SFProgress,
            {
              value: getConnectorValue(status),
              className: cn(
                "h-8 w-1 [writing-mode:vertical-lr]",
                status === "error" && "bg-destructive/20 [&_[data-slot=progress-indicator]]:bg-destructive"
              )
            }
          ) })
        ] }, index);
      })
    }
  );
}
function SFStep({
  status = "pending",
  label,
  description,
  children,
  className
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      role: "listitem",
      "data-status": status,
      className: cn("flex items-start gap-3", className),
      children: [
        /* @__PURE__ */ jsxRuntime.jsxs(
          "div",
          {
            className: cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-foreground font-mono text-xs",
              status === "complete" && "bg-primary text-primary-foreground border-primary",
              status === "active" && "bg-foreground text-background",
              status === "error" && "bg-destructive text-destructive-foreground border-destructive",
              status === "pending" && "bg-transparent text-foreground"
            ),
            "aria-hidden": "true",
            children: [
              status === "complete" && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Check, { className: "size-4" }),
              status === "error" && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.AlertCircle, { className: "size-4" }),
              (status === "active" || status === "pending") && null
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-col justify-center min-h-8", children: [
          label && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-mono uppercase tracking-wider text-sm leading-tight", children: label }),
          description && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-muted-foreground text-xs mt-0.5", children: description }),
          children
        ] })
      ]
    }
  );
}

// lib/gsap-easings.ts
function registerSFEasings() {
  CustomEase.create(
    "sf-snap",
    "M0,0 C0.14,0 0.27,0.5 0.5,0.5 0.73,0.5 0.86,1 1,1"
  );
  CustomEase.create("sf-punch", "M0,0 C0.7,0 0.3,1.5 1,1");
}

// lib/gsap-split.ts
if (typeof window !== "undefined") {
  gsap__default.default.registerPlugin(ScrollTrigger.ScrollTrigger, SplitText.SplitText, ScrambleTextPlugin.ScrambleTextPlugin, CustomEase$1.CustomEase, react.useGSAP);
  registerSFEasings();
}
var SF_CHARS = "!<>-_\\/[]{}\u2014=+*^?#01\u30B7\u30B0\u30CA\u30EB";
function ScrambleText({
  text,
  className,
  trigger = "hover",
  chars = SF_CHARS
}) {
  const ref = React.useRef(null);
  const { contextSafe } = react.useGSAP(
    () => {
      if (trigger === "load" && ref.current) {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        gsap__default.default.from(ref.current, {
          duration: 1,
          scrambleText: {
            text: "",
            chars,
            revealDelay: 0.5,
            speed: 0.3
          }
        });
      }
    },
    { scope: ref, dependencies: [trigger] }
  );
  const handleHover = contextSafe(() => {
    if (!ref.current) return;
    gsap__default.default.to(ref.current, {
      duration: 0.8,
      scrambleText: {
        text,
        chars,
        revealDelay: 0.3,
        speed: 0.4
      }
    });
  });
  return /* @__PURE__ */ jsxRuntime.jsx(
    "span",
    {
      ref,
      className,
      "aria-label": text,
      onMouseEnter: trigger === "hover" ? handleHover : void 0,
      onFocus: trigger === "hover" ? handleHover : void 0,
      children: /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": "true", children: text })
    }
  );
}
var BAYER_DITHER_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAADFJREFUGFdj/P///38GBgZGRkZGBhBgAAMmJiYGZMDIyAgXAAuAAchqRrgqsCBIFQMAAPwJBgmjMXwAAAAASUVORK5CYII=";
function SFEmptyState({
  title,
  scramble = false,
  action,
  className,
  children
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    "div",
    {
      className: cn(
        "relative flex flex-col items-center justify-center py-16 px-8 text-center font-mono uppercase tracking-wider",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            "aria-hidden": "true",
            className: "absolute inset-0 opacity-[0.04] pointer-events-none",
            style: {
              backgroundImage: `url("${BAYER_DITHER_URI}")`,
              backgroundSize: "8px 8px",
              imageRendering: "pixelated"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "relative z-10", children: [
          scramble ? /* @__PURE__ */ jsxRuntime.jsx(
            ScrambleText,
            {
              text: title,
              className: "text-lg mb-4 block",
              trigger: "load"
            }
          ) : /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-lg mb-4 text-foreground", children: title }),
          children && /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground mb-6", children }),
          action
        ] })
      ]
    }
  );
}
function useNavReveal(triggerRef) {
  React.useEffect(() => {
    document.body.dataset.navVisible = "false";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.dataset.navVisible = "true";
      return () => {
        document.body.dataset.navVisible = "true";
      };
    }
    const trigger = triggerRef.current;
    if (!trigger) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[useNavReveal] triggerRef.current is null -- subpages MUST pass their <header> element ref. Showing nav as fallback."
        );
      }
      document.body.dataset.navVisible = "true";
      return () => {
        document.body.dataset.navVisible = "true";
      };
    }
    const st = ScrollTrigger.ScrollTrigger.create({
      trigger,
      start: "bottom top",
      onEnter: () => {
        document.body.dataset.navVisible = "true";
      },
      onLeaveBack: () => {
        document.body.dataset.navVisible = "false";
      }
    });
    return () => {
      st.kill();
      document.body.dataset.navVisible = "true";
    };
  }, [triggerRef]);
}
if (typeof window !== "undefined") {
  gsap__default.default.registerPlugin(
    ScrollTrigger.ScrollTrigger,
    SplitText.SplitText,
    ScrambleTextPlugin.ScrambleTextPlugin,
    Flip.Flip,
    CustomEase$1.CustomEase,
    Observer.Observer,
    react.useGSAP
  );
  registerSFEasings();
}
var motionCleanup = null;
function initReducedMotion() {
  if (typeof window === "undefined") return () => {
  };
  motionCleanup?.();
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  if (prefersReduced.matches) {
    gsap__default.default.globalTimeline.timeScale(0);
  }
  const handler = (e) => {
    gsap__default.default.globalTimeline.timeScale(e.matches ? 0 : 1);
  };
  prefersReduced.addEventListener("change", handler);
  motionCleanup = () => {
    prefersReduced.removeEventListener("change", handler);
    motionCleanup = null;
  };
  return motionCleanup;
}
if (typeof window !== "undefined") {
  gsap__default.default.registerPlugin(ScrollTrigger.ScrollTrigger, DrawSVGPlugin.DrawSVGPlugin);
}

Object.defineProperty(exports, "ScrambleTextPlugin", {
  enumerable: true,
  get: function () { return ScrambleTextPlugin.ScrambleTextPlugin; }
});
Object.defineProperty(exports, "DrawSVGPlugin", {
  enumerable: true,
  get: function () { return DrawSVGPlugin.DrawSVGPlugin; }
});
exports.SFAccordion = SFAccordion;
exports.SFAccordionContent = SFAccordionContent;
exports.SFAccordionItem = SFAccordionItem;
exports.SFAccordionTrigger = SFAccordionTrigger;
exports.SFEmptyState = SFEmptyState;
exports.SFProgress = SFProgress;
exports.SFStatusDot = SFStatusDot;
exports.SFStep = SFStep;
exports.SFStepper = SFStepper;
exports.SFToaster = SFToaster;
exports.initReducedMotion = initReducedMotion;
exports.registerSFEasings = registerSFEasings;
exports.sfToast = sfToast;
exports.useNavReveal = useNavReveal;
//# sourceMappingURL=animation.cjs.map
//# sourceMappingURL=animation.cjs.map