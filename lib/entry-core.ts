// SignalframeUX Core — SF components, layout primitives, hooks, utilities
// Zero animation library or renderer dependencies in this entry point

// ── Layout Primitives ────────────────────────────────────────────────────────
export { SFContainer } from "../components/sf/sf-container";
export { SFSection } from "../components/sf/sf-section";
export { SFStack } from "../components/sf/sf-stack";
export { SFGrid } from "../components/sf/sf-grid";
export { SFText, type TextVariant } from "../components/sf/sf-text";

// ── Interactive Components ───────────────────────────────────────────────────
export { SFButton } from "../components/sf/sf-button";
export {
  SFCard,
  SFCardHeader,
  SFCardTitle,
  SFCardDescription,
  SFCardContent,
  SFCardFooter,
} from "../components/sf/sf-card";
export { SFInput } from "../components/sf/sf-input";
export { SFBadge } from "../components/sf/sf-badge";
export {
  SFTabs,
  SFTabsList,
  SFTabsTrigger,
  SFTabsContent,
} from "../components/sf/sf-tabs";
export { SFSeparator } from "../components/sf/sf-separator";
export {
  SFTable,
  SFTableHeader,
  SFTableHead,
  SFTableBody,
  SFTableRow,
  SFTableCell,
} from "../components/sf/sf-table";
export {
  SFTooltip,
  SFTooltipContent,
  SFTooltipTrigger,
} from "../components/sf/sf-tooltip";
export {
  SFDialog,
  SFDialogTrigger,
  SFDialogClose,
  SFDialogContent,
  SFDialogHeader,
  SFDialogFooter,
  SFDialogTitle,
  SFDialogDescription,
} from "../components/sf/sf-dialog";
export {
  SFSheet,
  SFSheetTrigger,
  SFSheetClose,
  SFSheetContent,
  SFSheetHeader,
  SFSheetFooter,
  SFSheetTitle,
  SFSheetDescription,
} from "../components/sf/sf-sheet";
export {
  SFDropdownMenu,
  SFDropdownMenuTrigger,
  SFDropdownMenuContent,
  SFDropdownMenuGroup,
  SFDropdownMenuItem,
  SFDropdownMenuLabel,
  SFDropdownMenuSeparator,
  SFDropdownMenuShortcut,
} from "../components/sf/sf-dropdown-menu";
export { SFToggle } from "../components/sf/sf-toggle";
export { SFSlider } from "../components/sf/sf-slider";
export {
  SFCommand,
  SFCommandDialog,
  SFCommandInput,
  SFCommandList,
  SFCommandEmpty,
  SFCommandGroup,
  SFCommandItem,
  SFCommandSeparator,
  SFCommandShortcut,
} from "../components/sf/sf-command";
export { SFSkeleton } from "../components/sf/sf-skeleton";
export {
  SFPopover,
  SFPopoverTrigger,
  SFPopoverContent,
  SFPopoverHeader,
  SFPopoverTitle,
  SFPopoverDescription,
} from "../components/sf/sf-popover";
export { SFScrollArea, SFScrollBar } from "../components/sf/sf-scroll-area";
export { SFLabel } from "../components/sf/sf-label";
export {
  SFSelect,
  SFSelectTrigger,
  SFSelectContent,
  SFSelectGroup,
  SFSelectItem,
  SFSelectLabel,
  SFSelectValue,
} from "../components/sf/sf-select";
export { SFCheckbox } from "../components/sf/sf-checkbox";
export { SFRadioGroup, SFRadioGroupItem } from "../components/sf/sf-radio-group";
export { SFSwitch } from "../components/sf/sf-switch";
export { SFTextarea } from "../components/sf/sf-textarea";

// ── Feedback ─────────────────────────────────────────────────────────────────
export {
  SFAlert,
  SFAlertTitle,
  SFAlertDescription,
} from "../components/sf/sf-alert";
export {
  SFAlertDialog,
  SFAlertDialogTrigger,
  SFAlertDialogContent,
  SFAlertDialogHeader,
  SFAlertDialogFooter,
  SFAlertDialogTitle,
  SFAlertDialogDescription,
  SFAlertDialogAction,
  SFAlertDialogCancel,
} from "../components/sf/sf-alert-dialog";
export {
  SFCollapsible,
  SFCollapsibleTrigger,
  SFCollapsibleContent,
} from "../components/sf/sf-collapsible";
// NOTE: SFEmptyState uses ScrambleText → gsap-split → gsap (transitive GSAP dep)
// Exported from animation entry (entry-animation.ts), not core.

// ── Navigation ────────────────────────────────────────────────────────────────
export {
  SFAvatar,
  SFAvatarImage,
  SFAvatarFallback,
} from "../components/sf/sf-avatar";
export {
  SFBreadcrumb,
  SFBreadcrumbList,
  SFBreadcrumbItem,
  SFBreadcrumbLink,
  SFBreadcrumbPage,
  SFBreadcrumbSeparator,
} from "../components/sf/sf-breadcrumb";
export {
  SFPagination,
  SFPaginationContent,
  SFPaginationItem,
  SFPaginationLink,
  SFPaginationPrevious,
  SFPaginationNext,
} from "../components/sf/sf-pagination";
export {
  SFNavigationMenu,
  SFNavigationMenuList,
  SFNavigationMenuItem,
  SFNavigationMenuTrigger,
  SFNavigationMenuContent,
  SFNavigationMenuLink,
  SFNavigationMenuViewport,
  SFNavigationMenuMobile,
} from "../components/sf/sf-navigation-menu";

// ── Multi-Step & Selection ────────────────────────────────────────────────────
export { SFToggleGroup, SFToggleGroupItem } from "../components/sf/sf-toggle-group";
// NOTE: SFStepper imports SFProgress which imports gsap-core → gsap (transitive dep)
// Exported from animation entry (entry-animation.ts), not core.

// ── Forms — Extended ──────────────────────────────────────────────────────────
export {
  SFInputGroup,
  SFInputGroupAddon,
  SFInputGroupButton,
  SFInputGroupText,
  SFInputGroupInput,
  SFInputGroupTextarea,
} from "../components/sf/sf-input-group";
export {
  SFInputOTP,
  SFInputOTPGroup,
  SFInputOTPSlot,
  SFInputOTPSeparator,
} from "../components/sf/sf-input-otp";

// ── Overlays ──────────────────────────────────────────────────────────────────
export {
  SFHoverCard,
  SFHoverCardTrigger,
  SFHoverCardContent,
} from "../components/sf/sf-hover-card";

// ── Config Provider (refactored — dynamic animation import only) ──────────────
export { createSignalframeUX, useSignalframe } from "./signalframe-provider";
export type { SignalframeUXConfig, UseSignalframeReturn } from "./signalframe-provider";

// ── Core Utilities ────────────────────────────────────────────────────────────
export { cn } from "./utils";
export { toggleTheme } from "./theme";
export { GRAIN_SVG } from "./grain";

// ── Hooks (animation-library-free) ───────────────────────────────────────────
// use-nav-reveal: ScrollTrigger dependency — lives in animation entry
// use-signal-scene: renderer dependency — lives in webgl entry
// use-scroll-restoration: router dependency — excluded per D-05
export { useScrambleText } from "../hooks/use-scramble-text";
export { useSessionState, SESSION_KEYS } from "../hooks/use-session-state";
