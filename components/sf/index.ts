// Layout Primitives
export { SFContainer } from "./sf-container";
export { SFSection } from "./sf-section";
export { SFPanel, type PanelMode } from "./sf-panel";
export { SFStack } from "./sf-stack";
export { SFGrid } from "./sf-grid";
export { SFText, type TextVariant } from "./sf-text";

export { SFButton } from "./sf-button";
export {
  SFCard,
  SFCardHeader,
  SFCardTitle,
  SFCardDescription,
  SFCardContent,
  SFCardFooter,
} from "./sf-card";
export { SFInput } from "./sf-input";
export { SFBadge } from "./sf-badge";
export {
  SFTabs,
  SFTabsList,
  SFTabsTrigger,
  SFTabsContent,
} from "./sf-tabs";
export { SFSeparator } from "./sf-separator";
export {
  SFTable,
  SFTableHeader,
  SFTableHead,
  SFTableBody,
  SFTableRow,
  SFTableCell,
} from "./sf-table";
export { SFTooltip, SFTooltipContent, SFTooltipTrigger } from "./sf-tooltip";

// New wrappers
export {
  SFDialog,
  SFDialogTrigger,
  SFDialogClose,
  SFDialogContent,
  SFDialogHeader,
  SFDialogFooter,
  SFDialogTitle,
  SFDialogDescription,
} from "./sf-dialog";
export {
  SFSheet,
  SFSheetTrigger,
  SFSheetClose,
  SFSheetContent,
  SFSheetHeader,
  SFSheetFooter,
  SFSheetTitle,
  SFSheetDescription,
} from "./sf-sheet";
export {
  SFDropdownMenu,
  SFDropdownMenuTrigger,
  SFDropdownMenuContent,
  SFDropdownMenuGroup,
  SFDropdownMenuItem,
  SFDropdownMenuLabel,
  SFDropdownMenuSeparator,
  SFDropdownMenuShortcut,
} from "./sf-dropdown-menu";
export { SFToggle } from "./sf-toggle";
export { SFSlider } from "./sf-slider";
// SFCommand* — NOT re-exported from the barrel. cmdk (~12 kB gz) + nested
// radix-dialog/primitives add up. Only CommandPalette consumes these; import
// directly to keep the barrel tree-shakeable:
//   import { SFCommand, ... } from "@/components/sf/sf-command";
export { SFSkeleton } from "./sf-skeleton";
export {
  SFPopover,
  SFPopoverTrigger,
  SFPopoverContent,
  SFPopoverHeader,
  SFPopoverTitle,
  SFPopoverDescription,
} from "./sf-popover";
export { SFScrollArea, SFScrollBar } from "./sf-scroll-area";
export { SFLabel } from "./sf-label";
export {
  SFSelect,
  SFSelectTrigger,
  SFSelectContent,
  SFSelectGroup,
  SFSelectItem,
  SFSelectLabel,
  SFSelectValue,
} from "./sf-select";
export { SFCheckbox } from "./sf-checkbox";
export { SFRadioGroup, SFRadioGroupItem } from "./sf-radio-group";
export { SFSwitch } from "./sf-switch";
export { SFTextarea } from "./sf-textarea";

// Feedback
export { SFAlert, SFAlertTitle, SFAlertDescription } from "./sf-alert";
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
} from "./sf-alert-dialog";
export {
  SFCollapsible,
  SFCollapsibleTrigger,
  SFCollapsibleContent,
} from "./sf-collapsible";
export { SFEmptyState } from "./sf-empty-state";
export {
  SFAccordion,
  SFAccordionItem,
  SFAccordionTrigger,
  SFAccordionContent,
} from "./sf-accordion";
export { SFProgress } from "./sf-progress";
// SFToaster / sfToast — NOT re-exported from the barrel. Pulling these eagerly
// through the barrel drags sonner (~33 kB gz) into every consumer's critical
// path. Import directly when needed:
//   import { SFToasterLazy } from "@/components/sf/sf-toast-lazy"; // mount
//   import { sfToast } from "@/components/sf/sf-toast";           // imperative API

// Navigation
export { SFAvatar, SFAvatarImage, SFAvatarFallback } from "./sf-avatar";
export {
  SFBreadcrumb,
  SFBreadcrumbList,
  SFBreadcrumbItem,
  SFBreadcrumbLink,
  SFBreadcrumbPage,
  SFBreadcrumbSeparator,
} from "./sf-breadcrumb";
export {
  SFPagination,
  SFPaginationContent,
  SFPaginationItem,
  SFPaginationLink,
  SFPaginationPrevious,
  SFPaginationNext,
} from "./sf-pagination";
export {
  SFNavigationMenu,
  SFNavigationMenuList,
  SFNavigationMenuItem,
  SFNavigationMenuTrigger,
  SFNavigationMenuContent,
  SFNavigationMenuLink,
  SFNavigationMenuViewport,
  SFNavigationMenuMobile,
} from "./sf-navigation-menu";

// Multi-Step & Selection
export { SFToggleGroup, SFToggleGroupItem } from "./sf-toggle-group";
export { SFStepper, SFStep } from "./sf-stepper";

// Data Display
export { SFStatusDot, type SFStatusDotStatus } from "./sf-status-dot";

// Forms — Extended
export {
  SFInputGroup,
  SFInputGroupAddon,
  SFInputGroupButton,
  SFInputGroupText,
  SFInputGroupInput,
  SFInputGroupTextarea,
} from "./sf-input-group";
export {
  SFInputOTP,
  SFInputOTPGroup,
  SFInputOTPSlot,
  SFInputOTPSeparator,
} from "./sf-input-otp";

// Symbols
export { CDSymbol } from "./cd-symbol";

// Overlays
export { SFHoverCard, SFHoverCardTrigger, SFHoverCardContent } from "./sf-hover-card";

// Effects Subsystem — NOT re-exported from the barrel. Importing this eagerly
// pulls three.js (~130 kB gz) into every consumer's critical path. Consumers
// that need it must import the lazy variant directly:
//   import { SFSignalComposerLazy } from "@/components/animation/sf-signal-composer-lazy";
// Types still import-able from the non-barrel path:
//   import type { EffectPassName, SFSignalComposerProps } from "@/components/animation/sf-signal-composer";
