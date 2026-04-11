import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import * as React$1 from 'react';
import React__default from 'react';
import { Tabs as Tabs$1, Separator as Separator$1, Tooltip as Tooltip$1, Dialog as Dialog$1, DropdownMenu as DropdownMenu$1, Toggle as Toggle$1, Slider as Slider$1, Popover as Popover$1, ScrollArea as ScrollArea$1, Label as Label$1, Select as Select$1, Checkbox as Checkbox$1, RadioGroup as RadioGroup$1, Switch as Switch$1, AlertDialog as AlertDialog$1, Collapsible as Collapsible$1, Avatar as Avatar$1, NavigationMenu as NavigationMenu$1, ToggleGroup, HoverCard as HoverCard$1 } from 'radix-ui';
import { Command as Command$1 } from 'cmdk';
import { OTPInput } from 'input-otp';
import { ClassValue } from 'clsx';

declare const sfContainerVariants: (props?: ({
    width?: "wide" | "content" | "full" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SFContainerProps extends React__default.ComponentProps<"div">, VariantProps<typeof sfContainerVariants> {
}
/**
 * Responsive page container — FRAME layer layout primitive.
 *
 * Enforces max-width tokens and responsive gutters defined in globals.css.
 * Default width is "wide" for most page sections. Use "content" for
 * prose/readable text columns.
 *
 * @param width - Max-width variant. "wide" | "content" | "full"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFContainer width="content">
 *   <SFText variant="body">Readable prose column</SFText>
 * </SFContainer>
 */
declare const SFContainer: React__default.ForwardRefExoticComponent<Omit<SFContainerProps, "ref"> & React__default.RefAttributes<HTMLDivElement>>;

interface SFSectionProps extends React__default.ComponentProps<"section"> {
    label?: string;
    bgShift?: "white" | "black";
    spacing?: "8" | "12" | "16" | "24";
}
/**
 * Semantic page section — FRAME layer layout primitive.
 *
 * Renders a `<section>` with data-section always present. Applies
 * spacing variant mapped to blessed stops. Supports optional
 * data-section-label (CSS ::before content) and data-bg-shift
 * (scroll-triggered background toggle via GSAP).
 *
 * @param label - Optional label string applied as data-section-label
 * @param bgShift - Background shift value for GSAP scroll targeting. "white" or "black".
 * @param spacing - Vertical padding from blessed stops. "8" | "12" | "16" | "24"
 * @param className - Merged via cn() after spacing class
 *
 * @example
 * <SFSection label="Work" spacing="24" bgShift="white">
 *   <SFContainer>Content here</SFContainer>
 * </SFSection>
 */
declare const SFSection: React__default.ForwardRefExoticComponent<Omit<SFSectionProps, "ref"> & React__default.RefAttributes<HTMLElement>>;

declare const sfStackVariants: (props?: ({
    direction?: "horizontal" | "vertical" | null | undefined;
    gap?: "8" | "12" | "16" | "24" | "1" | "2" | "3" | "4" | "6" | null | undefined;
    align?: "center" | "start" | "end" | "stretch" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SFStackProps extends React__default.ComponentProps<"div">, VariantProps<typeof sfStackVariants> {
}
/**
 * Vertical rhythm container — FRAME layer layout primitive.
 *
 * Flex container with gap variants mapped to blessed spacing stops.
 * Defaults to vertical column layout with stretch alignment. Use
 * direction="horizontal" for inline/row arrangements.
 *
 * @param direction - Flex direction. "vertical" | "horizontal"
 * @param gap - Gap between children, maps to blessed stops. "1" | "2" | "3" | "4" | "6" | "8" | "12" | "16" | "24"
 * @param align - Flex alignment. "start" | "center" | "end" | "stretch"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFStack gap="8" align="start">
 *   <SFText variant="heading-2">Title</SFText>
 *   <SFText variant="body">Description</SFText>
 * </SFStack>
 */
declare const SFStack: React__default.ForwardRefExoticComponent<Omit<SFStackProps, "ref"> & React__default.RefAttributes<HTMLDivElement>>;

declare const sfGridVariants: (props?: ({
    cols?: "auto" | "1" | "2" | "3" | "4" | null | undefined;
    gap?: "8" | "4" | "6" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SFGridProps extends React__default.ComponentProps<"div">, VariantProps<typeof sfGridVariants> {
}
/**
 * Responsive column grid — FRAME layer layout primitive.
 *
 * CSS grid container with responsive breakpoint behavior built into
 * the cols variant. Each value encodes mobile-first column progression
 * (e.g., cols="3" renders 1 col → 2 col → 3 col across breakpoints).
 *
 * @param cols - Column count with built-in responsive scaling. "1" | "2" | "3" | "4" | "auto"
 * @param gap - Grid gap from blessed stops. "4" | "6" | "8"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFGrid cols="3" gap="6">
 *   <SFCard>Item 1</SFCard>
 *   <SFCard>Item 2</SFCard>
 *   <SFCard>Item 3</SFCard>
 * </SFGrid>
 */
declare const SFGrid: React__default.ForwardRefExoticComponent<Omit<SFGridProps, "ref"> & React__default.RefAttributes<HTMLDivElement>>;

type TextVariant = "heading-1" | "heading-2" | "heading-3" | "body" | "small";
type TextElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "label";
interface SFTextProps extends React__default.HTMLAttributes<HTMLElement> {
    variant: TextVariant;
    as?: TextElement;
    className?: string;
}
/**
 * Semantic text primitive — FRAME layer typography enforcer.
 *
 * Maps semantic variants to typography alias classes (text-heading-1 etc.)
 * defined in globals.css. Defaults to the appropriate HTML element for each
 * variant (h1/h2/h3 for headings, p for body, span for small) but accepts
 * `as` for override. Polymorphic — ref is cast to React.Ref<any> per
 * TypeScript forwardRef polymorphic limitation.
 *
 * @param variant - Semantic text style. "heading-1" | "heading-2" | "heading-3" | "body" | "small"
 * @param as - Override rendered element tag. Defaults: h1/h2/h3/p/span per variant
 * @param className - Merged via cn() after variant class
 *
 * @example
 * <SFText variant="heading-1">Signal Frame</SFText>
 * <SFText variant="body" as="span">Inline body text</SFText>
 */
declare const SFText: React__default.ForwardRefExoticComponent<SFTextProps & React__default.RefAttributes<HTMLElement>>;

declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | null | undefined;
    size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, ...props }: React$1.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): React$1.JSX.Element;

declare const sfButtonVariants: (props?: ({
    intent?: "ghost" | "primary" | "signal" | null | undefined;
    size?: "sm" | "lg" | "md" | "xl" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SFButtonProps extends Omit<React.ComponentProps<typeof Button>, "size">, VariantProps<typeof sfButtonVariants> {
}
/**
 * Primary action button — FRAME layer interactive primitive.
 *
 * Enforces SF button contract: font-mono, uppercase, 2px border,
 * asymmetric hover timing (100ms in / 400ms out), and press transform
 * via .sf-pressable. "signal" intent uses primary border accent — use
 * for brand-level CTAs only.
 *
 * @param intent - Visual variant. "primary" | "ghost" | "signal"
 * @param size - Height and padding scale. "sm" | "md" | "lg" | "xl"
 * @param className - Merged via cn() — appended, never replaces base classes
 *
 * @example
 * <SFButton intent="primary" size="md">Launch</SFButton>
 * <SFButton intent="ghost" size="sm" onClick={handleCancel}>Cancel</SFButton>
 */
declare function SFButton({ intent, size, className, ...props }: SFButtonProps): React$1.JSX.Element;

declare function Card({ className, size, ...props }: React$1.ComponentProps<"div"> & {
    size?: "default" | "sm";
}): React$1.JSX.Element;
declare function CardHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CardTitle({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CardDescription({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CardContent({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function CardFooter({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;

interface SFCardProps extends React.ComponentProps<typeof Card> {
    hoverable?: boolean;
    /** Use clockwise magenta border-draw instead of simple color hover */
    borderDraw?: boolean;
}
/**
 * Content surface card — FRAME layer container primitive.
 *
 * Renders a bordered card with 2px foreground border and no shadow
 * (SF aesthetic contract: no elevation, only edge definition). Supports
 * optional hover color transition and SIGNAL-layer borderDraw animation.
 *
 * @param hoverable - Enables hover border color transition to primary
 * @param borderDraw - Replaces color hover with SIGNAL borderDraw animation (clockwise magenta stroke)
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFCard hoverable>
 *   <SFCardHeader><SFCardTitle>Project Alpha</SFCardTitle></SFCardHeader>
 *   <SFCardContent>Description text</SFCardContent>
 * </SFCard>
 */
declare function SFCard({ className, hoverable, borderDraw, ...props }: SFCardProps): React$1.JSX.Element;
/**
 * Sub-component of SFCard — renders the card header region with reduced bottom padding.
 * @example
 * <SFCardHeader><SFCardTitle>Project Alpha</SFCardTitle></SFCardHeader>
 */
declare function SFCardHeader({ className, ...props }: React.ComponentProps<typeof CardHeader>): React$1.JSX.Element;
/**
 * Sub-component of SFCard — renders the card title in font-mono uppercase.
 * @example
 * <SFCardTitle>Project Alpha</SFCardTitle>
 */
declare function SFCardTitle({ className, ...props }: React.ComponentProps<typeof CardTitle>): React$1.JSX.Element;
/**
 * Sub-component of SFCard — renders the card description in muted foreground at text-xs.
 * @example
 * <SFCardDescription>Updated 2 days ago</SFCardDescription>
 */
declare function SFCardDescription({ className, ...props }: React.ComponentProps<typeof CardDescription>): React$1.JSX.Element;
/**
 * Sub-component of SFCard — renders the main card body content region with p-4 padding.
 * @example
 * <SFCardContent>Body text or nested components go here.</SFCardContent>
 */
declare function SFCardContent({ className, ...props }: React.ComponentProps<typeof CardContent>): React$1.JSX.Element;
/**
 * Sub-component of SFCard — renders the card footer region, flush bottom with no top gap.
 * @example
 * <SFCardFooter><SFButton size="sm">View Details</SFButton></SFCardFooter>
 */
declare function SFCardFooter({ className, ...props }: React.ComponentProps<typeof CardFooter>): React$1.JSX.Element;

declare function Input({ className, type, ...props }: React$1.ComponentProps<"input">): React$1.JSX.Element;

/**
 * Text input field — FRAME layer form primitive.
 *
 * Enforces SF input contract: font-mono, uppercase, 2px foreground border,
 * sf-focusable keyboard indicator, and sf-border-draw-focus for SIGNAL-layer
 * focus animation. Placeholder inherits uppercase and tracking styles.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFInput placeholder="Enter value" />
 * <SFInput type="email" placeholder="you@studio.com" />
 */
declare function SFInput({ className, ...props }: React.ComponentProps<typeof Input>): React$1.JSX.Element;

declare const badgeVariants: (props?: ({
    variant?: "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Badge({ className, variant, asChild, ...props }: React$1.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
}): React$1.JSX.Element;

declare const sfBadgeVariants: (props?: ({
    intent?: "default" | "outline" | "primary" | "signal" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SFBadgeProps extends React.ComponentProps<typeof Badge>, VariantProps<typeof sfBadgeVariants> {
}
/**
 * Status indicator badge — FRAME layer label primitive.
 *
 * Renders a small monospace uppercase badge. Enforces 2px border,
 * font-mono, uppercase, and tracking-wider across all intents.
 * "signal" uses sf-yellow accent — use sparingly.
 *
 * @param intent - Visual variant. "default" | "primary" | "outline" | "signal"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFBadge intent="primary">Active</SFBadge>
 * <SFBadge intent="outline">Draft</SFBadge>
 */
declare function SFBadge({ intent, className, ...props }: SFBadgeProps): React$1.JSX.Element;

declare function Tabs({ className, orientation, ...props }: React$1.ComponentProps<typeof Tabs$1.Root>): React$1.JSX.Element;
declare const tabsListVariants: (props?: ({
    variant?: "line" | "default" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function TabsList({ className, variant, ...props }: React$1.ComponentProps<typeof Tabs$1.List> & VariantProps<typeof tabsListVariants>): React$1.JSX.Element;
declare function TabsTrigger({ className, ...props }: React$1.ComponentProps<typeof Tabs$1.Trigger>): React$1.JSX.Element;
declare function TabsContent({ className, ...props }: React$1.ComponentProps<typeof Tabs$1.Content>): React$1.JSX.Element;

/**
 * Tabbed interface — FRAME layer navigation primitive.
 *
 * Radix Tabs root wrapped with SF contract. Compose with
 * SFTabsList, SFTabsTrigger, and SFTabsContent for a full tab interface.
 * Triggers use underline active indicator (border-b-2) not background fill,
 * with muted → foreground color transition on hover.
 *
 * @example
 * <SFTabs defaultValue="overview">
 *   <SFTabsList>
 *     <SFTabsTrigger value="overview">Overview</SFTabsTrigger>
 *     <SFTabsTrigger value="specs">Specs</SFTabsTrigger>
 *   </SFTabsList>
 *   <SFTabsContent value="overview">Content here</SFTabsContent>
 * </SFTabs>
 */
declare function SFTabs(props: React.ComponentProps<typeof Tabs>): React$1.JSX.Element;
/**
 * Sub-component of SFTabs — tab navigation bar with 2px bottom border and no padding.
 * @example
 * <SFTabsList><SFTabsTrigger value="a">Tab A</SFTabsTrigger></SFTabsList>
 */
declare function SFTabsList({ className, ...props }: React.ComponentProps<typeof TabsList>): React$1.JSX.Element;
/**
 * Sub-component of SFTabs — tab button with underline active indicator and mono uppercase type.
 * @example
 * <SFTabsTrigger value="overview">Overview</SFTabsTrigger>
 */
declare function SFTabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFTabs — content panel shown when its matching tab trigger is active.
 * @example
 * <SFTabsContent value="overview">Overview content here</SFTabsContent>
 */
declare function SFTabsContent(props: React.ComponentProps<typeof TabsContent>): React$1.JSX.Element;

declare function Separator({ className, orientation, decorative, ...props }: React$1.ComponentProps<typeof Separator$1.Root>): React$1.JSX.Element;

interface SFSeparatorProps extends React.ComponentProps<typeof Separator> {
    weight?: "thin" | "normal" | "heavy";
}
/**
 * Visual divider — FRAME layer structural primitive.
 *
 * Radix Separator with SF foreground color and three weight variants
 * mapped to border token values. Supports both horizontal (default)
 * and vertical orientation.
 *
 * @param orientation - Layout direction. "horizontal" | "vertical"
 * @param weight - Line thickness variant. "thin" | "normal" | "heavy"
 * @param className - Merged via cn() after weight/orientation classes
 *
 * @example
 * <SFSeparator weight="normal" />
 * <SFSeparator orientation="vertical" weight="thin" className="h-6" />
 */
declare function SFSeparator({ className, weight, ...props }: SFSeparatorProps): React$1.JSX.Element;

declare function Table({ className, ...props }: React$1.ComponentProps<"table">): React$1.JSX.Element;
declare function TableHeader({ className, ...props }: React$1.ComponentProps<"thead">): React$1.JSX.Element;
declare function TableBody({ className, ...props }: React$1.ComponentProps<"tbody">): React$1.JSX.Element;
declare function TableRow({ className, ...props }: React$1.ComponentProps<"tr">): React$1.JSX.Element;
declare function TableHead({ className, ...props }: React$1.ComponentProps<"th">): React$1.JSX.Element;
declare function TableCell({ className, ...props }: React$1.ComponentProps<"td">): React$1.JSX.Element;

/**
 * Data table — FRAME layer data primitive.
 *
 * Semantically correct HTML table with SF styling: font-mono at text-xs
 * and 2px foreground outer border. Compose with SFTableHeader,
 * SFTableBody, SFTableRow, SFTableHead, and SFTableCell for full
 * table structure.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFTable>
 *   <SFTableHeader><SFTableRow><SFTableHead>Name</SFTableHead></SFTableRow></SFTableHeader>
 *   <SFTableBody><SFTableRow><SFTableCell>Alice</SFTableCell></SFTableRow></SFTableBody>
 * </SFTable>
 */
declare function SFTable({ className, ...props }: React.ComponentProps<typeof Table>): React$1.JSX.Element;
/**
 * Sub-component of SFTable — inverted header row (foreground background, background text).
 * @example
 * <SFTableHeader><SFTableRow><SFTableHead>Name</SFTableHead></SFTableRow></SFTableHeader>
 */
declare function SFTableHeader({ className, ...props }: React.ComponentProps<typeof TableHeader>): React$1.JSX.Element;
/**
 * Sub-component of SFTable — column heading cell in uppercase tracking-wider at text-xs.
 * @example
 * <SFTableHead>Status</SFTableHead>
 */
declare function SFTableHead({ className, ...props }: React.ComponentProps<typeof TableHead>): React$1.JSX.Element;
/**
 * Sub-component of SFTable — table row with muted border and subtle hover background.
 * @example
 * <SFTableRow><SFTableCell>Alice</SFTableCell></SFTableRow>
 */
declare function SFTableRow({ className, ...props }: React.ComponentProps<typeof TableRow>): React$1.JSX.Element;
/**
 * Sub-component of SFTable — data cell with consistent px-3 py-2 padding.
 * @example
 * <SFTableCell>alice@example.com</SFTableCell>
 */
declare function SFTableCell({ className, ...props }: React.ComponentProps<typeof TableCell>): React$1.JSX.Element;
/**
 * Sub-component of SFTable — table body container wrapping all data rows.
 * @example
 * <SFTableBody><SFTableRow><SFTableCell>Data</SFTableCell></SFTableRow></SFTableBody>
 */
declare function SFTableBody({ className, ...props }: React.ComponentProps<typeof TableBody>): React$1.JSX.Element;

declare function Tooltip({ ...props }: React$1.ComponentProps<typeof Tooltip$1.Root>): React$1.JSX.Element;
declare function TooltipTrigger({ ...props }: React$1.ComponentProps<typeof Tooltip$1.Trigger>): React$1.JSX.Element;
declare function TooltipContent({ className, sideOffset, children, ...props }: React$1.ComponentProps<typeof Tooltip$1.Content>): React$1.JSX.Element;

/**
 * Hover tooltip — FRAME layer contextual primitive.
 *
 * Radix Tooltip root wrapped with SF contract. Compose with
 * SFTooltipTrigger and SFTooltipContent for full tooltip behavior.
 * Content renders inverted (foreground bg, background text) in
 * font-mono uppercase with no border or border-radius.
 *
 * @example
 * <SFTooltip>
 *   <SFTooltipTrigger asChild><SFButton size="sm">?</SFButton></SFTooltipTrigger>
 *   <SFTooltipContent>Keyboard shortcut: ⌘K</SFTooltipContent>
 * </SFTooltip>
 */
declare function SFTooltip(props: React.ComponentProps<typeof Tooltip>): React$1.JSX.Element;
/**
 * Sub-component of SFTooltip — floating label in inverted mono uppercase with no border or radius.
 * @example
 * <SFTooltipContent>Keyboard shortcut: ⌘K</SFTooltipContent>
 */
declare function SFTooltipContent({ className, ...props }: React.ComponentProps<typeof TooltipContent>): React$1.JSX.Element;
/**
 * Sub-component of SFTooltip — trigger element that shows the tooltip on hover/focus.
 * @example
 * <SFTooltipTrigger asChild><SFButton size="sm">?</SFButton></SFTooltipTrigger>
 */
declare function SFTooltipTrigger(props: React.ComponentProps<typeof TooltipTrigger>): React$1.JSX.Element;

declare function Dialog({ ...props }: React$1.ComponentProps<typeof Dialog$1.Root>): React$1.JSX.Element;
declare function DialogTrigger({ ...props }: React$1.ComponentProps<typeof Dialog$1.Trigger>): React$1.JSX.Element;
declare function DialogClose({ ...props }: React$1.ComponentProps<typeof Dialog$1.Close>): React$1.JSX.Element;
declare function DialogContent({ className, children, showCloseButton, ...props }: React$1.ComponentProps<typeof Dialog$1.Content> & {
    showCloseButton?: boolean;
}): React$1.JSX.Element;
declare function DialogHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function DialogFooter({ className, showCloseButton, children, ...props }: React$1.ComponentProps<"div"> & {
    showCloseButton?: boolean;
}): React$1.JSX.Element;
declare function DialogTitle({ className, ...props }: React$1.ComponentProps<typeof Dialog$1.Title>): React$1.JSX.Element;
declare function DialogDescription({ className, ...props }: React$1.ComponentProps<typeof Dialog$1.Description>): React$1.JSX.Element;

/**
 * Modal dialog — FRAME layer overlay primitive.
 *
 * Radix Dialog root wrapped with SF contract. Compose with
 * SFDialogTrigger, SFDialogContent, SFDialogHeader, SFDialogTitle,
 * SFDialogDescription, SFDialogFooter, and SFDialogClose.
 * Content applies sharp corners, 2px border, no shadow.
 *
 * @example
 * <SFDialog>
 *   <SFDialogTrigger asChild><SFButton>Open</SFButton></SFDialogTrigger>
 *   <SFDialogContent>
 *     <SFDialogHeader><SFDialogTitle>Confirm</SFDialogTitle></SFDialogHeader>
 *   </SFDialogContent>
 * </SFDialog>
 */
declare function SFDialog(props: React.ComponentProps<typeof Dialog>): React$1.JSX.Element;
/**
 * Sub-component of SFDialog — trigger element that opens the dialog on interaction.
 * @example
 * <SFDialogTrigger asChild><SFButton>Open</SFButton></SFDialogTrigger>
 */
declare function SFDialogTrigger(props: React.ComponentProps<typeof DialogTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFDialog — close button that dismisses the dialog when activated.
 * @example
 * <SFDialogClose asChild><SFButton intent="ghost">Cancel</SFButton></SFDialogClose>
 */
declare function SFDialogClose(props: React.ComponentProps<typeof DialogClose>): React$1.JSX.Element;
/**
 * Sub-component of SFDialog — modal content panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFDialogContent><SFDialogHeader><SFDialogTitle>Title</SFDialogTitle></SFDialogHeader></SFDialogContent>
 */
declare function SFDialogContent({ className, ...props }: React.ComponentProps<typeof DialogContent>): React$1.JSX.Element;
/**
 * Sub-component of SFDialog — header region with 2px bottom border separating it from content.
 * @example
 * <SFDialogHeader><SFDialogTitle>Confirm Action</SFDialogTitle></SFDialogHeader>
 */
declare function SFDialogHeader({ className, ...props }: React.ComponentProps<typeof DialogHeader>): React$1.JSX.Element;
/**
 * Sub-component of SFDialog — footer region with 2px top border and muted background for action buttons.
 * @example
 * <SFDialogFooter><SFButton>Save</SFButton></SFDialogFooter>
 */
declare function SFDialogFooter({ className, ...props }: React.ComponentProps<typeof DialogFooter>): React$1.JSX.Element;
/**
 * Sub-component of SFDialog — dialog title in font-mono uppercase with letter-spacing.
 * @example
 * <SFDialogTitle>Confirm Deletion</SFDialogTitle>
 */
declare function SFDialogTitle({ className, ...props }: React.ComponentProps<typeof DialogTitle>): React$1.JSX.Element;
/**
 * Sub-component of SFDialog — supporting description text in muted foreground, uppercase, xs size.
 * @example
 * <SFDialogDescription>This action cannot be undone.</SFDialogDescription>
 */
declare function SFDialogDescription({ className, ...props }: React.ComponentProps<typeof DialogDescription>): React$1.JSX.Element;

declare function Sheet({ ...props }: React$1.ComponentProps<typeof Dialog$1.Root>): React$1.JSX.Element;
declare function SheetTrigger({ ...props }: React$1.ComponentProps<typeof Dialog$1.Trigger>): React$1.JSX.Element;
declare function SheetClose({ ...props }: React$1.ComponentProps<typeof Dialog$1.Close>): React$1.JSX.Element;
declare function SheetContent({ className, children, side, showCloseButton, ...props }: React$1.ComponentProps<typeof Dialog$1.Content> & {
    side?: "top" | "right" | "bottom" | "left";
    showCloseButton?: boolean;
}): React$1.JSX.Element;
declare function SheetHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function SheetFooter({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function SheetTitle({ className, ...props }: React$1.ComponentProps<typeof Dialog$1.Title>): React$1.JSX.Element;
declare function SheetDescription({ className, ...props }: React$1.ComponentProps<typeof Dialog$1.Description>): React$1.JSX.Element;

/**
 * Slide-out panel — FRAME layer overlay primitive.
 *
 * Radix Sheet root wrapped with SF contract. Compose with
 * SFSheetTrigger, SFSheetContent, SFSheetHeader, SFSheetTitle,
 * SFSheetDescription, SFSheetFooter, and SFSheetClose.
 * Content slides in from the edge with sharp corners and 2px border.
 *
 * @example
 * <SFSheet>
 *   <SFSheetTrigger asChild><SFButton>Open Panel</SFButton></SFSheetTrigger>
 *   <SFSheetContent side="right">
 *     <SFSheetHeader><SFSheetTitle>Settings</SFSheetTitle></SFSheetHeader>
 *   </SFSheetContent>
 * </SFSheet>
 */
declare function SFSheet(props: React.ComponentProps<typeof Sheet>): React$1.JSX.Element;
/**
 * Sub-component of SFSheet — trigger element that opens the slide-out panel on interaction.
 * @example
 * <SFSheetTrigger asChild><SFButton>Open Panel</SFButton></SFSheetTrigger>
 */
declare function SFSheetTrigger(props: React.ComponentProps<typeof SheetTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFSheet — close control that dismisses the panel when activated.
 * @example
 * <SFSheetClose asChild><SFButton intent="ghost">Close</SFButton></SFSheetClose>
 */
declare function SFSheetClose(props: React.ComponentProps<typeof SheetClose>): React$1.JSX.Element;
/**
 * Sub-component of SFSheet — slide-out content panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFSheetContent side="right"><SFSheetHeader><SFSheetTitle>Settings</SFSheetTitle></SFSheetHeader></SFSheetContent>
 */
declare function SFSheetContent({ className, ...props }: React.ComponentProps<typeof SheetContent>): React$1.JSX.Element;
/**
 * Sub-component of SFSheet — header region with 2px bottom border separating it from body content.
 * @example
 * <SFSheetHeader><SFSheetTitle>Settings</SFSheetTitle></SFSheetHeader>
 */
declare function SFSheetHeader({ className, ...props }: React.ComponentProps<typeof SheetHeader>): React$1.JSX.Element;
/**
 * Sub-component of SFSheet — footer region with 2px top border and muted background for action buttons.
 * @example
 * <SFSheetFooter><SFButton>Apply</SFButton></SFSheetFooter>
 */
declare function SFSheetFooter({ className, ...props }: React.ComponentProps<typeof SheetFooter>): React$1.JSX.Element;
/**
 * Sub-component of SFSheet — sheet title in font-mono uppercase with letter-spacing.
 * @example
 * <SFSheetTitle>Preferences</SFSheetTitle>
 */
declare function SFSheetTitle({ className, ...props }: React.ComponentProps<typeof SheetTitle>): React$1.JSX.Element;
/**
 * Sub-component of SFSheet — supporting description text in muted foreground, uppercase, xs size.
 * @example
 * <SFSheetDescription>Adjust your display preferences.</SFSheetDescription>
 */
declare function SFSheetDescription({ className, ...props }: React.ComponentProps<typeof SheetDescription>): React$1.JSX.Element;

declare function DropdownMenu({ ...props }: React$1.ComponentProps<typeof DropdownMenu$1.Root>): React$1.JSX.Element;
declare function DropdownMenuTrigger({ ...props }: React$1.ComponentProps<typeof DropdownMenu$1.Trigger>): React$1.JSX.Element;
declare function DropdownMenuContent({ className, align, sideOffset, ...props }: React$1.ComponentProps<typeof DropdownMenu$1.Content>): React$1.JSX.Element;
declare function DropdownMenuGroup({ ...props }: React$1.ComponentProps<typeof DropdownMenu$1.Group>): React$1.JSX.Element;
declare function DropdownMenuItem({ className, inset, variant, ...props }: React$1.ComponentProps<typeof DropdownMenu$1.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
}): React$1.JSX.Element;
declare function DropdownMenuLabel({ className, inset, ...props }: React$1.ComponentProps<typeof DropdownMenu$1.Label> & {
    inset?: boolean;
}): React$1.JSX.Element;
declare function DropdownMenuSeparator({ className, ...props }: React$1.ComponentProps<typeof DropdownMenu$1.Separator>): React$1.JSX.Element;
declare function DropdownMenuShortcut({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;

/**
 * Context menu — FRAME layer dropdown navigation primitive.
 *
 * Radix DropdownMenu root wrapped with SF contract. Compose with
 * SFDropdownMenuTrigger, SFDropdownMenuContent, SFDropdownMenuGroup,
 * SFDropdownMenuItem, SFDropdownMenuLabel, SFDropdownMenuSeparator,
 * and SFDropdownMenuShortcut for full context menu behavior.
 *
 * @example
 * <SFDropdownMenu>
 *   <SFDropdownMenuTrigger asChild><SFButton>Options</SFButton></SFDropdownMenuTrigger>
 *   <SFDropdownMenuContent>
 *     <SFDropdownMenuItem>Edit</SFDropdownMenuItem>
 *     <SFDropdownMenuSeparator />
 *     <SFDropdownMenuItem>Delete</SFDropdownMenuItem>
 *   </SFDropdownMenuContent>
 * </SFDropdownMenu>
 */
declare function SFDropdownMenu(props: React.ComponentProps<typeof DropdownMenu>): React$1.JSX.Element;
/**
 * Sub-component of SFDropdownMenu — trigger element that opens the dropdown on click.
 * @example
 * <SFDropdownMenuTrigger asChild><SFButton>Options</SFButton></SFDropdownMenuTrigger>
 */
declare function SFDropdownMenuTrigger(props: React.ComponentProps<typeof DropdownMenuTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFDropdownMenu — floating content panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFDropdownMenuContent><SFDropdownMenuItem>Edit</SFDropdownMenuItem></SFDropdownMenuContent>
 */
declare function SFDropdownMenuContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuContent>): React$1.JSX.Element;
/**
 * Sub-component of SFDropdownMenu — groups related items with a mono uppercase label heading.
 * @example
 * <SFDropdownMenuGroup><SFDropdownMenuLabel>File</SFDropdownMenuLabel><SFDropdownMenuItem>New</SFDropdownMenuItem></SFDropdownMenuGroup>
 */
declare function SFDropdownMenuGroup({ className, ...props }: React.ComponentProps<typeof DropdownMenuGroup>): React$1.JSX.Element;
/**
 * Sub-component of SFDropdownMenu — selectable menu item; inverts colors on focus/hover.
 * @example
 * <SFDropdownMenuItem onSelect={() => handleEdit()}>Edit</SFDropdownMenuItem>
 */
declare function SFDropdownMenuItem({ className, ...props }: React.ComponentProps<typeof DropdownMenuItem>): React$1.JSX.Element;
/**
 * Sub-component of SFDropdownMenu — non-interactive section label in muted foreground at xs size.
 * @example
 * <SFDropdownMenuLabel>File Actions</SFDropdownMenuLabel>
 */
declare function SFDropdownMenuLabel({ className, ...props }: React.ComponentProps<typeof DropdownMenuLabel>): React$1.JSX.Element;
/**
 * Sub-component of SFDropdownMenu — keyboard shortcut hint in mono uppercase, right-aligned in item.
 * @example
 * <SFDropdownMenuItem>Save<SFDropdownMenuShortcut>⌘S</SFDropdownMenuShortcut></SFDropdownMenuItem>
 */
declare function SFDropdownMenuShortcut({ className, ...props }: React.ComponentProps<typeof DropdownMenuShortcut>): React$1.JSX.Element;
/**
 * Sub-component of SFDropdownMenu — full-width foreground rule separating menu sections.
 * @example
 * <SFDropdownMenuSeparator />
 */
declare function SFDropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuSeparator>): React$1.JSX.Element;

declare const toggleVariants: (props?: ({
    variant?: "default" | "outline" | null | undefined;
    size?: "default" | "sm" | "lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Toggle({ className, variant, size, ...props }: React$1.ComponentProps<typeof Toggle$1.Root> & VariantProps<typeof toggleVariants>): React$1.JSX.Element;

declare const sfToggleVariants: (props?: ({
    intent?: "default" | "primary" | null | undefined;
    size?: "sm" | "lg" | "md" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SFToggleProps extends Omit<React.ComponentProps<typeof Toggle>, "size">, VariantProps<typeof sfToggleVariants> {
}
/**
 * Pressable toggle button — FRAME layer interactive primitive.
 *
 * Radix Toggle with SF styling: sharp corners, 2px border, sf-pressable
 * press transform, and inverted fill on active state. Use for binary
 * on/off controls like filter chips or view mode switches.
 *
 * @param intent - Visual variant. "default" | "primary"
 * @param size - Height and padding scale. "sm" | "md" | "lg"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFToggle intent="default" size="md">Grid</SFToggle>
 * <SFToggle intent="primary" pressed>Active</SFToggle>
 */
declare function SFToggle({ intent, size, className, ...props }: SFToggleProps): React$1.JSX.Element;

declare function Slider({ className, defaultValue, value, min, max, ...props }: React$1.ComponentProps<typeof Slider$1.Root>): React$1.JSX.Element;

/**
 * Range input slider — FRAME layer form primitive.
 *
 * Radix Slider with SF styling: square track (3px height), primary fill
 * for the active range, and a square thumb with sf-focusable indicator
 * and 2px foreground border. Inherits all Radix SliderProps.
 *
 * @param className - Merged via cn() after base slot-targeting classes
 *
 * @example
 * <SFSlider defaultValue={[50]} min={0} max={100} step={1} />
 * <SFSlider defaultValue={[20, 80]} min={0} max={100} />
 */
declare function SFSlider({ className, ...props }: React.ComponentProps<typeof Slider>): React$1.JSX.Element;

declare function Command({ className, ...props }: React$1.ComponentProps<typeof Command$1>): React$1.JSX.Element;
declare function CommandDialog({ title, description, children, className, showCloseButton, ...props }: React$1.ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
}): React$1.JSX.Element;
declare function CommandInput({ className, ...props }: React$1.ComponentProps<typeof Command$1.Input>): React$1.JSX.Element;
declare function CommandList({ className, ...props }: React$1.ComponentProps<typeof Command$1.List>): React$1.JSX.Element;
declare function CommandEmpty({ className, ...props }: React$1.ComponentProps<typeof Command$1.Empty>): React$1.JSX.Element;
declare function CommandGroup({ className, ...props }: React$1.ComponentProps<typeof Command$1.Group>): React$1.JSX.Element;
declare function CommandSeparator({ className, ...props }: React$1.ComponentProps<typeof Command$1.Separator>): React$1.JSX.Element;
declare function CommandItem({ className, children, ...props }: React$1.ComponentProps<typeof Command$1.Item>): React$1.JSX.Element;
declare function CommandShortcut({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;

/**
 * Command palette — FRAME layer search/navigation primitive.
 *
 * Radix Command wrapped with SF styling: sharp corners, 2px foreground
 * border, dark background. Compose with SFCommandInput, SFCommandList,
 * SFCommandGroup, and SFCommandItem for full palette functionality.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFCommand>
 *   <SFCommandInput placeholder="Search..." />
 *   <SFCommandList>
 *     <SFCommandGroup heading="Actions">
 *       <SFCommandItem>Open file</SFCommandItem>
 *     </SFCommandGroup>
 *   </SFCommandList>
 * </SFCommand>
 */
declare function SFCommand({ className, ...props }: React.ComponentProps<typeof Command>): React$1.JSX.Element;
/**
 * Sub-component of SFCommand — modal dialog wrapper for command palette overlay usage.
 * @example
 * <SFCommandDialog open={open} onOpenChange={setOpen}><SFCommandInput placeholder="Search..." /></SFCommandDialog>
 */
declare function SFCommandDialog({ className, ...props }: React.ComponentProps<typeof CommandDialog>): React$1.JSX.Element;
/**
 * Sub-component of SFCommand — search input rendered in font-mono uppercase.
 * @example
 * <SFCommandInput placeholder="Search commands..." />
 */
declare function SFCommandInput({ className, ...props }: React.ComponentProps<typeof CommandInput>): React$1.JSX.Element;
/**
 * Sub-component of SFCommand — scrollable results list container in font-mono.
 * @example
 * <SFCommandList><SFCommandGroup heading="Actions"><SFCommandItem>Open</SFCommandItem></SFCommandGroup></SFCommandList>
 */
declare function SFCommandList({ className, ...props }: React.ComponentProps<typeof CommandList>): React$1.JSX.Element;
/**
 * Sub-component of SFCommand — empty state message shown when no results match the query.
 * @example
 * <SFCommandEmpty>No results found.</SFCommandEmpty>
 */
declare function SFCommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandEmpty>): React$1.JSX.Element;
/**
 * Sub-component of SFCommand — labeled group of related command items with mono uppercase heading.
 * @example
 * <SFCommandGroup heading="Navigation"><SFCommandItem>Go to dashboard</SFCommandItem></SFCommandGroup>
 */
declare function SFCommandGroup({ className, ...props }: React.ComponentProps<typeof CommandGroup>): React$1.JSX.Element;
/**
 * Sub-component of SFCommand — selectable command item; highlights with inverted colors on selection.
 * @example
 * <SFCommandItem onSelect={() => router.push('/dashboard')}>Dashboard</SFCommandItem>
 */
declare function SFCommandItem({ className, ...props }: React.ComponentProps<typeof CommandItem>): React$1.JSX.Element;
/**
 * Sub-component of SFCommand — keyboard shortcut label rendered in mono uppercase, right-aligned.
 * @example
 * <SFCommandItem>New File<SFCommandShortcut>⌘N</SFCommandShortcut></SFCommandItem>
 */
declare function SFCommandShortcut({ className, ...props }: React.ComponentProps<typeof CommandShortcut>): React$1.JSX.Element;
/**
 * Sub-component of SFCommand — full-width foreground-colored rule dividing command groups.
 * @example
 * <SFCommandSeparator />
 */
declare function SFCommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandSeparator>): React$1.JSX.Element;

declare function Skeleton({ className, ...props }: React.ComponentProps<"div">): React$1.JSX.Element;

/**
 * Loading placeholder — FRAME layer state primitive.
 *
 * Renders an accessible skeleton block with aria role="status" and
 * a custom sf-skeleton shimmer animation (no rounded corners). Use to
 * represent content loading states in place of actual content.
 *
 * @param className - Merged via cn() — set width/height to match target content shape
 *
 * @example
 * <SFSkeleton className="h-4 w-48" />
 * <SFSkeleton className="h-32 w-full" />
 */
declare function SFSkeleton({ className, ...props }: React.ComponentProps<typeof Skeleton>): React$1.JSX.Element;

declare function Popover({ ...props }: React$1.ComponentProps<typeof Popover$1.Root>): React$1.JSX.Element;
declare function PopoverTrigger({ ...props }: React$1.ComponentProps<typeof Popover$1.Trigger>): React$1.JSX.Element;
declare function PopoverContent({ className, align, sideOffset, ...props }: React$1.ComponentProps<typeof Popover$1.Content>): React$1.JSX.Element;
declare function PopoverHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function PopoverTitle({ className, ...props }: React$1.ComponentProps<"h2">): React$1.JSX.Element;
declare function PopoverDescription({ className, ...props }: React$1.ComponentProps<"p">): React$1.JSX.Element;

/**
 * Floating content panel — FRAME layer overlay primitive.
 *
 * Radix Popover root wrapped with SF contract. Compose with
 * SFPopoverTrigger, SFPopoverContent, SFPopoverHeader,
 * SFPopoverTitle, and SFPopoverDescription for full popover structure.
 * Content applies sharp corners, 2px border, no shadow.
 *
 * @example
 * <SFPopover>
 *   <SFPopoverTrigger asChild><SFButton size="sm">Info</SFButton></SFPopoverTrigger>
 *   <SFPopoverContent>
 *     <SFPopoverHeader><SFPopoverTitle>Details</SFPopoverTitle></SFPopoverHeader>
 *   </SFPopoverContent>
 * </SFPopover>
 */
declare function SFPopover(props: React.ComponentProps<typeof Popover>): React$1.JSX.Element;
/**
 * Sub-component of SFPopover — trigger element that opens the floating panel on interaction.
 * @example
 * <SFPopoverTrigger asChild><SFButton size="sm">Info</SFButton></SFPopoverTrigger>
 */
declare function SFPopoverTrigger(props: React.ComponentProps<typeof PopoverTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFPopover — floating content panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFPopoverContent><SFPopoverHeader><SFPopoverTitle>Details</SFPopoverTitle></SFPopoverHeader></SFPopoverContent>
 */
declare function SFPopoverContent({ className, ...props }: React.ComponentProps<typeof PopoverContent>): React$1.JSX.Element;
/**
 * Sub-component of SFPopover — header region with 2px bottom border separating it from content.
 * @example
 * <SFPopoverHeader><SFPopoverTitle>Filter Options</SFPopoverTitle></SFPopoverHeader>
 */
declare function SFPopoverHeader({ className, ...props }: React.ComponentProps<typeof PopoverHeader>): React$1.JSX.Element;
/**
 * Sub-component of SFPopover — title rendered in font-mono uppercase with letter-spacing.
 * @example
 * <SFPopoverTitle>Filter Options</SFPopoverTitle>
 */
declare function SFPopoverTitle({ className, ...props }: React.ComponentProps<typeof PopoverTitle>): React$1.JSX.Element;
/**
 * Sub-component of SFPopover — supporting description text in muted foreground at text-xs.
 * @example
 * <SFPopoverDescription>Select a date range to filter results.</SFPopoverDescription>
 */
declare function SFPopoverDescription({ className, ...props }: React.ComponentProps<typeof PopoverDescription>): React$1.JSX.Element;

declare function ScrollArea({ className, children, ...props }: React$1.ComponentProps<typeof ScrollArea$1.Root>): React$1.JSX.Element;
declare function ScrollBar({ className, orientation, ...props }: React$1.ComponentProps<typeof ScrollArea$1.ScrollAreaScrollbar>): React$1.JSX.Element;

/**
 * Custom scroll container — FRAME layer overflow primitive.
 *
 * Radix ScrollArea with SF-styled thumb: sharp corners and
 * foreground/30 color replacing the default rounded thumb.
 * Use when content overflows a constrained height and native
 * scrollbar styling conflicts with the SF aesthetic.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFScrollArea className="h-64">
 *   <div className="p-4">{longContent}</div>
 * </SFScrollArea>
 */
declare function SFScrollArea({ className, ...props }: React.ComponentProps<typeof ScrollArea>): React$1.JSX.Element;
/**
 * Sub-component of SFScrollArea — scrollbar track with sharp corners, composable with SFScrollArea.
 * @example
 * <SFScrollArea className="h-64"><SFScrollBar orientation="vertical" />{content}</SFScrollArea>
 */
declare function SFScrollBar({ className, ...props }: React.ComponentProps<typeof ScrollBar>): React$1.JSX.Element;

declare const labelVariants: (props?: class_variance_authority_types.ClassProp | undefined) => string;
declare function Label({ className, ...props }: React.ComponentProps<typeof Label$1.Root> & VariantProps<typeof labelVariants>): React$1.JSX.Element;

/**
 * Form field label — FRAME layer typography primitive.
 *
 * Associates with an input via htmlFor. Renders in font-mono uppercase
 * with tracking-wider and text-xs — consistent with other form
 * chrome elements (SFInput, SFCheckbox).
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFLabel htmlFor="project-name">Project Name</SFLabel>
 * <SFInput id="project-name" placeholder="Untitled" />
 */
declare function SFLabel({ className, ...props }: React.ComponentProps<typeof Label>): React$1.JSX.Element;

declare const Select: React$1.FC<Select$1.SelectProps>;
declare const SelectGroup: React$1.ForwardRefExoticComponent<Select$1.SelectGroupProps & React$1.RefAttributes<HTMLDivElement>>;
declare const SelectValue: React$1.ForwardRefExoticComponent<Select$1.SelectValueProps & React$1.RefAttributes<HTMLSpanElement>>;
declare function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof Select$1.Trigger>): React$1.JSX.Element;
declare function SelectContent({ className, children, position, ...props }: React.ComponentProps<typeof Select$1.Content>): React$1.JSX.Element;
declare function SelectLabel({ className, ...props }: React.ComponentProps<typeof Select$1.Label>): React$1.JSX.Element;
declare function SelectItem({ className, children, ...props }: React.ComponentProps<typeof Select$1.Item>): React$1.JSX.Element;

/**
 * Dropdown select input — FRAME layer form primitive.
 *
 * Radix Select root wrapped with SF contract. Compose with
 * SFSelectTrigger, SFSelectContent, SFSelectItem, SFSelectValue,
 * SFSelectGroup, and SFSelectLabel for a complete select control.
 * Trigger enforces font-mono, uppercase, sf-border-draw-focus.
 *
 * @example
 * <SFSelect>
 *   <SFSelectTrigger><SFSelectValue placeholder="Choose..." /></SFSelectTrigger>
 *   <SFSelectContent>
 *     <SFSelectItem value="a">Option A</SFSelectItem>
 *   </SFSelectContent>
 * </SFSelect>
 */
declare function SFSelect(props: React.ComponentProps<typeof Select>): React$1.JSX.Element;
/**
 * Sub-component of SFSelect — trigger button with sf-border-draw-focus, mono uppercase, and no ring.
 * @example
 * <SFSelectTrigger><SFSelectValue placeholder="Choose..." /></SFSelectTrigger>
 */
declare function SFSelectTrigger({ className, ...props }: React.ComponentProps<typeof SelectTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFSelect — dropdown panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFSelectContent><SFSelectItem value="a">Option A</SFSelectItem></SFSelectContent>
 */
declare function SFSelectContent({ className, ...props }: React.ComponentProps<typeof SelectContent>): React$1.JSX.Element;
/**
 * Sub-component of SFSelect — option item in mono uppercase; inverts colors on focus.
 * @example
 * <SFSelectItem value="dark">Dark</SFSelectItem>
 */
declare function SFSelectItem({ className, ...props }: React.ComponentProps<typeof SelectItem>): React$1.JSX.Element;
/**
 * Sub-component of SFSelect — renders the currently selected value or placeholder inside SFSelectTrigger.
 * @example
 * <SFSelectValue placeholder="Select theme..." />
 */
declare function SFSelectValue(props: React.ComponentProps<typeof SelectValue>): React$1.JSX.Element;
/**
 * Sub-component of SFSelect — groups related select items under a common label.
 * @example
 * <SFSelectGroup><SFSelectLabel>Themes</SFSelectLabel><SFSelectItem value="dark">Dark</SFSelectItem></SFSelectGroup>
 */
declare function SFSelectGroup(props: React.ComponentProps<typeof SelectGroup>): React$1.JSX.Element;
/**
 * Sub-component of SFSelect — non-interactive group label in muted mono uppercase at 2xs size.
 * @example
 * <SFSelectLabel>Color Themes</SFSelectLabel>
 */
declare function SFSelectLabel({ className, ...props }: React.ComponentProps<typeof SelectLabel>): React$1.JSX.Element;

declare function Checkbox({ className, ...props }: React.ComponentProps<typeof Checkbox$1.Root>): React$1.JSX.Element;

/**
 * Toggle checkbox input — FRAME layer form primitive.
 *
 * Radix Checkbox wrapped with SF styling: sharp corners (rounded-none),
 * 2px foreground border, primary fill on checked state, and
 * sf-focusable keyboard indicator. Inherits all Radix CheckboxProps.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFCheckbox id="terms" />
 * <SFLabel htmlFor="terms">Accept terms</SFLabel>
 */
declare function SFCheckbox({ className, ...props }: React.ComponentProps<typeof Checkbox>): React$1.JSX.Element;

declare function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroup$1.Root>): React$1.JSX.Element;
declare function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroup$1.Item>): React$1.JSX.Element;

/**
 * Radio selection group — FRAME layer form primitive.
 *
 * Radix RadioGroup wrapped with SF grid layout. Use with
 * SFRadioGroupItem and SFLabel for full accessible radio sets.
 * Items render with sharp corners, 2px foreground border, and
 * sf-focusable keyboard indicator.
 *
 * @param className - Merged via cn() after grid base class
 *
 * @example
 * <SFRadioGroup defaultValue="option-a">
 *   <SFRadioGroupItem value="option-a" id="opt-a" />
 *   <SFLabel htmlFor="opt-a">Option A</SFLabel>
 * </SFRadioGroup>
 */
declare function SFRadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroup>): React$1.JSX.Element;
/**
 * Sub-component of SFRadioGroup — individual radio button with SF sharp corners and focus indicator.
 * @example
 * <SFRadioGroupItem value="option-a" id="opt-a" /><SFLabel htmlFor="opt-a">Option A</SFLabel>
 */
declare function SFRadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupItem>): React$1.JSX.Element;

declare function Switch({ className, ...props }: React.ComponentProps<typeof Switch$1.Root>): React$1.JSX.Element;

/**
 * Toggle switch input — FRAME layer form primitive.
 *
 * Radix Switch with SF styling: sharp corners (rounded-none), 2px
 * foreground border, primary fill on checked state, transparent when
 * unchecked, and sf-toggle-snap snap animation on the thumb.
 * Inherits all Radix SwitchProps.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFSwitch id="notifications" defaultChecked />
 * <SFLabel htmlFor="notifications">Enable notifications</SFLabel>
 */
declare function SFSwitch({ className, ...props }: React.ComponentProps<typeof Switch>): React$1.JSX.Element;

declare function Textarea({ className, ...props }: React$1.ComponentProps<"textarea">): React$1.JSX.Element;

/**
 * Multi-line text input — FRAME layer form primitive.
 *
 * Enforces SF textarea contract: font-mono, uppercase, 2px foreground
 * border, sf-border-draw-focus SIGNAL animation on focus, no shadow,
 * no ring. Placeholder inherits uppercase and tracking styles.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFTextarea placeholder="Enter notes..." rows={4} />
 * <SFTextarea placeholder="Description" className="min-h-32" />
 */
declare function SFTextarea({ className, ...props }: React.ComponentProps<typeof Textarea>): React$1.JSX.Element;

declare const alertVariants: (props?: ({
    variant?: "default" | "destructive" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Alert({ className, variant, ...props }: React$1.ComponentProps<"div"> & VariantProps<typeof alertVariants>): React$1.JSX.Element;
declare function AlertTitle({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function AlertDescription({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;

declare const sfAlertVariants: (props?: ({
    intent?: "destructive" | "info" | "warning" | "success" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
interface SFAlertProps extends React.ComponentProps<typeof Alert>, VariantProps<typeof sfAlertVariants> {
}
/**
 * Inline feedback banner — FRAME layer notification primitive.
 * Four intents: info (primary), warning (accent), destructive, success.
 *
 * Uses CVA with `intent` as the variant key. Overrides base alert's
 * rounded-lg with rounded-none and applies 2px border with
 * token-mapped background tints.
 *
 * @param intent - Visual variant. "info" | "warning" | "destructive" | "success"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFAlert intent="warning">
 *   <SFAlertTitle>Caution</SFAlertTitle>
 *   <SFAlertDescription>Check your input.</SFAlertDescription>
 * </SFAlert>
 */
declare function SFAlert({ intent, className, ...props }: SFAlertProps): React$1.JSX.Element;
/**
 * Sub-component of SFAlert — title in monospace uppercase with wider tracking.
 * @example
 * <SFAlertTitle>Warning</SFAlertTitle>
 */
declare function SFAlertTitle({ className, ...props }: React.ComponentProps<typeof AlertTitle>): React$1.JSX.Element;
/**
 * Sub-component of SFAlert — description text rendered below the alert title.
 * @example
 * <SFAlertDescription>Your session will expire in 5 minutes.</SFAlertDescription>
 */
declare function SFAlertDescription(props: React.ComponentProps<typeof AlertDescription>): React$1.JSX.Element;

declare function AlertDialog({ ...props }: React$1.ComponentProps<typeof AlertDialog$1.Root>): React$1.JSX.Element;
declare function AlertDialogTrigger({ ...props }: React$1.ComponentProps<typeof AlertDialog$1.Trigger>): React$1.JSX.Element;
declare function AlertDialogContent({ className, size, ...props }: React$1.ComponentProps<typeof AlertDialog$1.Content> & {
    size?: "default" | "sm";
}): React$1.JSX.Element;
declare function AlertDialogHeader({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function AlertDialogFooter({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function AlertDialogTitle({ className, ...props }: React$1.ComponentProps<typeof AlertDialog$1.Title>): React$1.JSX.Element;
declare function AlertDialogDescription({ className, ...props }: React$1.ComponentProps<typeof AlertDialog$1.Description>): React$1.JSX.Element;
declare function AlertDialogAction({ className, variant, size, ...props }: React$1.ComponentProps<typeof AlertDialog$1.Action> & Pick<React$1.ComponentProps<typeof Button>, "variant" | "size">): React$1.JSX.Element;
declare function AlertDialogCancel({ className, variant, size, ...props }: React$1.ComponentProps<typeof AlertDialog$1.Cancel> & Pick<React$1.ComponentProps<typeof Button>, "variant" | "size">): React$1.JSX.Element;

/**
 * Confirmation dialog -- FRAME layer destructive action guard.
 * Blocks interaction with focus-trapped overlay. Use SFAlertDialogAction
 * loading prop for async confirm.
 *
 * Radix AlertDialog root wrapped with SF contract. Compose with
 * SFAlertDialogTrigger, SFAlertDialogContent, SFAlertDialogHeader,
 * SFAlertDialogTitle, SFAlertDialogDescription, SFAlertDialogFooter,
 * SFAlertDialogAction, and SFAlertDialogCancel.
 *
 * @example
 * <SFAlertDialog>
 *   <SFAlertDialogTrigger asChild><SFButton>Delete</SFButton></SFAlertDialogTrigger>
 *   <SFAlertDialogContent>
 *     <SFAlertDialogHeader><SFAlertDialogTitle>Confirm</SFAlertDialogTitle></SFAlertDialogHeader>
 *     <SFAlertDialogFooter>
 *       <SFAlertDialogCancel>Cancel</SFAlertDialogCancel>
 *       <SFAlertDialogAction loading={isDeleting}>Delete</SFAlertDialogAction>
 *     </SFAlertDialogFooter>
 *   </SFAlertDialogContent>
 * </SFAlertDialog>
 */
declare function SFAlertDialog(props: React.ComponentProps<typeof AlertDialog>): React$1.JSX.Element;
/**
 * Sub-component of SFAlertDialog -- trigger element that opens the dialog on interaction.
 * @example
 * <SFAlertDialogTrigger asChild><SFButton>Delete</SFButton></SFAlertDialogTrigger>
 */
declare function SFAlertDialogTrigger(props: React.ComponentProps<typeof AlertDialogTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFAlertDialog -- modal content panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFAlertDialogContent><SFAlertDialogHeader><SFAlertDialogTitle>Confirm</SFAlertDialogTitle></SFAlertDialogHeader></SFAlertDialogContent>
 */
declare function SFAlertDialogContent({ className, ...props }: React.ComponentProps<typeof AlertDialogContent>): React$1.JSX.Element;
/**
 * Sub-component of SFAlertDialog -- header region containing title and description.
 * @example
 * <SFAlertDialogHeader><SFAlertDialogTitle>Are you sure?</SFAlertDialogTitle></SFAlertDialogHeader>
 */
declare function SFAlertDialogHeader({ className, ...props }: React.ComponentProps<typeof AlertDialogHeader>): React$1.JSX.Element;
/**
 * Sub-component of SFAlertDialog -- footer region with sharp corners overriding base rounded-b-xl.
 * @example
 * <SFAlertDialogFooter><SFAlertDialogCancel>Cancel</SFAlertDialogCancel><SFAlertDialogAction>Confirm</SFAlertDialogAction></SFAlertDialogFooter>
 */
declare function SFAlertDialogFooter({ className, ...props }: React.ComponentProps<typeof AlertDialogFooter>): React$1.JSX.Element;
/**
 * Sub-component of SFAlertDialog -- title in monospace uppercase with wider tracking.
 * @example
 * <SFAlertDialogTitle>Delete Project?</SFAlertDialogTitle>
 */
declare function SFAlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogTitle>): React$1.JSX.Element;
/**
 * Sub-component of SFAlertDialog -- supporting description text below the title.
 * @example
 * <SFAlertDialogDescription>This action cannot be undone and will permanently delete all data.</SFAlertDialogDescription>
 */
declare function SFAlertDialogDescription(props: React.ComponentProps<typeof AlertDialogDescription>): React$1.JSX.Element;
/**
 * Sub-component of SFAlertDialog -- confirm action button with optional loading state.
 * @example
 * <SFAlertDialogAction loading={isDeleting} onClick={handleDelete}>Delete</SFAlertDialogAction>
 */
interface SFAlertDialogActionProps extends React.ComponentProps<typeof AlertDialogAction> {
    loading?: boolean;
}
declare function SFAlertDialogAction({ loading, disabled, className, children, ...props }: SFAlertDialogActionProps): React$1.JSX.Element;
/**
 * Sub-component of SFAlertDialog -- cancel button with sharp corners that dismisses the dialog.
 * @example
 * <SFAlertDialogCancel>Cancel</SFAlertDialogCancel>
 */
declare function SFAlertDialogCancel({ className, ...props }: React.ComponentProps<typeof AlertDialogCancel>): React$1.JSX.Element;

declare function Collapsible({ ...props }: React.ComponentProps<typeof Collapsible$1.Root>): React$1.JSX.Element;
declare function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof Collapsible$1.CollapsibleTrigger>): React$1.JSX.Element;
declare function CollapsibleContent({ ...props }: React.ComponentProps<typeof Collapsible$1.CollapsibleContent>): React$1.JSX.Element;

/**
 * Toggleable content panel — FRAME layer disclosure primitive.
 *
 * Radix Collapsible root wrapped with SF contract. Compose with
 * SFCollapsibleTrigger (supports asChild) and SFCollapsibleContent.
 *
 * @example
 * <SFCollapsible>
 *   <SFCollapsibleTrigger asChild><SFButton>Toggle</SFButton></SFCollapsibleTrigger>
 *   <SFCollapsibleContent>Hidden content here</SFCollapsibleContent>
 * </SFCollapsible>
 */
declare function SFCollapsible(props: React.ComponentProps<typeof Collapsible>): React$1.JSX.Element;
/**
 * Sub-component of SFCollapsible — trigger element that toggles content visibility.
 * @example
 * <SFCollapsibleTrigger asChild><SFButton>Toggle</SFButton></SFCollapsibleTrigger>
 */
declare function SFCollapsibleTrigger(props: React.ComponentProps<typeof CollapsibleTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFCollapsible — collapsible content region that shows/hides on trigger.
 * @example
 * <SFCollapsibleContent>Hidden content revealed on toggle</SFCollapsibleContent>
 */
declare function SFCollapsibleContent(props: React.ComponentProps<typeof CollapsibleContent>): React$1.JSX.Element;

declare function Avatar({ className, size, ...props }: React$1.ComponentProps<typeof Avatar$1.Root> & {
    size?: "default" | "sm" | "lg";
}): React$1.JSX.Element;
declare function AvatarImage({ className, ...props }: React$1.ComponentProps<typeof Avatar$1.Image>): React$1.JSX.Element;
declare function AvatarFallback({ className, ...props }: React$1.ComponentProps<typeof Avatar$1.Fallback>): React$1.JSX.Element;

/**
 * User identity avatar — FRAME layer identity primitive.
 * Square crop, Radix fallback chain: image -> initials -> icon.
 *
 * All sub-elements enforce rounded-none to override Radix's
 * default rounded-full. When SFAvatarFallback has no children,
 * a Lucide User icon renders at 60% container size.
 *
 * @param className - Merged via cn() after rounded-none overrides
 *
 * @example
 * <SFAvatar>
 *   <SFAvatarImage src="/avatar.png" alt="User" />
 *   <SFAvatarFallback>JD</SFAvatarFallback>
 * </SFAvatar>
 */
declare function SFAvatar({ className, ...props }: React.ComponentProps<typeof Avatar>): React$1.JSX.Element;
/**
 * Sub-component of SFAvatar — image element with square crop and rounded-none override.
 * @example
 * <SFAvatarImage src="/avatars/user.png" alt="Jane Doe" />
 */
declare function SFAvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarImage>): React$1.JSX.Element;
/**
 * Sub-component of SFAvatar — fallback with initials or default User icon when image fails.
 * @example
 * <SFAvatarFallback>JD</SFAvatarFallback>
 */
declare function SFAvatarFallback({ className, children, ...props }: React.ComponentProps<typeof AvatarFallback>): React$1.JSX.Element;

declare function Breadcrumb({ className, ...props }: React$1.ComponentProps<"nav">): React$1.JSX.Element;
declare function BreadcrumbList({ className, ...props }: React$1.ComponentProps<"ol">): React$1.JSX.Element;
declare function BreadcrumbItem({ className, ...props }: React$1.ComponentProps<"li">): React$1.JSX.Element;
declare function BreadcrumbLink({ asChild, className, ...props }: React$1.ComponentProps<"a"> & {
    asChild?: boolean;
}): React$1.JSX.Element;
declare function BreadcrumbPage({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;
declare function BreadcrumbSeparator({ children, className, ...props }: React$1.ComponentProps<"li">): React$1.JSX.Element;

/**
 * Navigation hierarchy breadcrumb — FRAME layer wayfinding primitive.
 *
 * Server Component. Wraps shadcn Breadcrumb with monospace text
 * and `/` separator instead of chevron icon.
 *
 * @example
 * <SFBreadcrumb>
 *   <SFBreadcrumbList>
 *     <SFBreadcrumbItem><SFBreadcrumbLink href="/">Home</SFBreadcrumbLink></SFBreadcrumbItem>
 *     <SFBreadcrumbSeparator />
 *     <SFBreadcrumbItem><SFBreadcrumbPage>Current</SFBreadcrumbPage></SFBreadcrumbItem>
 *   </SFBreadcrumbList>
 * </SFBreadcrumb>
 */
declare function SFBreadcrumb(props: React.ComponentProps<typeof Breadcrumb>): React$1.JSX.Element;
/**
 * Sub-component of SFBreadcrumb — ordered list container with monospace font.
 * @example
 * <SFBreadcrumbList><SFBreadcrumbItem><SFBreadcrumbLink href="/">Home</SFBreadcrumbLink></SFBreadcrumbItem></SFBreadcrumbList>
 */
declare function SFBreadcrumbList({ className, ...props }: React.ComponentProps<typeof BreadcrumbList>): React$1.JSX.Element;
/**
 * Sub-component of SFBreadcrumb — individual breadcrumb item wrapper.
 * @example
 * <SFBreadcrumbItem><SFBreadcrumbLink href="/docs">Docs</SFBreadcrumbLink></SFBreadcrumbItem>
 */
declare function SFBreadcrumbItem(props: React.ComponentProps<typeof BreadcrumbItem>): React$1.JSX.Element;
/**
 * Sub-component of SFBreadcrumb — navigable breadcrumb link to a parent page.
 * @example
 * <SFBreadcrumbLink href="/components">Components</SFBreadcrumbLink>
 */
declare function SFBreadcrumbLink(props: React.ComponentProps<typeof BreadcrumbLink>): React$1.JSX.Element;
/**
 * Sub-component of SFBreadcrumb — current page indicator (non-interactive, aria-current="page").
 * @example
 * <SFBreadcrumbPage>Button</SFBreadcrumbPage>
 */
declare function SFBreadcrumbPage(props: React.ComponentProps<typeof BreadcrumbPage>): React$1.JSX.Element;
/**
 * Sub-component of SFBreadcrumb — monospace `/` separator between breadcrumb items.
 * @example
 * <SFBreadcrumbSeparator />
 */
declare function SFBreadcrumbSeparator({ className, ...props }: React.ComponentProps<typeof BreadcrumbSeparator>): React$1.JSX.Element;

declare function Pagination({ className, ...props }: React$1.ComponentProps<"nav">): React$1.JSX.Element;
declare function PaginationContent({ className, ...props }: React$1.ComponentProps<"ul">): React$1.JSX.Element;
declare function PaginationItem({ ...props }: React$1.ComponentProps<"li">): React$1.JSX.Element;
type PaginationLinkProps = {
    isActive?: boolean;
} & Pick<React$1.ComponentProps<typeof Button>, "size"> & React$1.ComponentProps<"a">;
declare function PaginationLink({ className, isActive, size, ...props }: PaginationLinkProps): React$1.JSX.Element;
declare function PaginationPrevious({ className, text, ...props }: React$1.ComponentProps<typeof PaginationLink> & {
    text?: string;
}): React$1.JSX.Element;
declare function PaginationNext({ className, text, ...props }: React$1.ComponentProps<typeof PaginationLink> & {
    text?: string;
}): React$1.JSX.Element;

/**
 * SFPagination -- FRAME layer numbered page navigation.
 *
 * Server Component. Wraps shadcn Pagination with monospace text,
 * sharp corners, 2px borders, and inverted active state. No ellipsis
 * export -- pagination should show explicit page numbers.
 *
 * @example
 * <SFPagination>
 *   <SFPaginationContent>
 *     <SFPaginationItem><SFPaginationPrevious href="/page/1" /></SFPaginationItem>
 *     <SFPaginationItem><SFPaginationLink href="/page/1">1</SFPaginationLink></SFPaginationItem>
 *     <SFPaginationItem><SFPaginationLink href="/page/2" isActive>2</SFPaginationLink></SFPaginationItem>
 *     <SFPaginationItem><SFPaginationLink href="/page/3">3</SFPaginationLink></SFPaginationItem>
 *     <SFPaginationItem><SFPaginationNext href="/page/3" /></SFPaginationItem>
 *   </SFPaginationContent>
 * </SFPagination>
 */
declare function SFPagination({ className, ...props }: React.ComponentProps<typeof Pagination>): React$1.JSX.Element;
/**
 * Sub-component of SFPagination — flex container for pagination items with gap-0 edge-to-edge layout.
 * @example
 * <SFPaginationContent><SFPaginationItem><SFPaginationLink href="/page/1">1</SFPaginationLink></SFPaginationItem></SFPaginationContent>
 */
declare function SFPaginationContent({ className, ...props }: React.ComponentProps<typeof PaginationContent>): React$1.JSX.Element;
/**
 * Sub-component of SFPagination — wrapper for a single pagination control (link, prev, or next).
 * @example
 * <SFPaginationItem><SFPaginationLink href="/page/2">2</SFPaginationLink></SFPaginationItem>
 */
declare function SFPaginationItem(props: React.ComponentProps<typeof PaginationItem>): React$1.JSX.Element;
/**
 * Sub-component of SFPagination — page number link with inverted active state and 2px border.
 * @example
 * <SFPaginationLink href="/page/3" isActive>3</SFPaginationLink>
 */
declare function SFPaginationLink({ className, isActive, ...props }: React.ComponentProps<typeof PaginationLink>): React$1.JSX.Element;
/**
 * Sub-component of SFPagination — previous page navigation control with 2px border and mono uppercase.
 * @example
 * <SFPaginationPrevious href="/page/1" />
 */
declare function SFPaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationPrevious>): React$1.JSX.Element;
/**
 * Sub-component of SFPagination — next page navigation control with 2px border and mono uppercase.
 * @example
 * <SFPaginationNext href="/page/4" />
 */
declare function SFPaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationNext>): React$1.JSX.Element;

declare function NavigationMenu({ className, children, viewport, ...props }: React$1.ComponentProps<typeof NavigationMenu$1.Root> & {
    viewport?: boolean;
}): React$1.JSX.Element;
declare function NavigationMenuList({ className, ...props }: React$1.ComponentProps<typeof NavigationMenu$1.List>): React$1.JSX.Element;
declare function NavigationMenuItem({ className, ...props }: React$1.ComponentProps<typeof NavigationMenu$1.Item>): React$1.JSX.Element;
declare function NavigationMenuTrigger({ className, children, ...props }: React$1.ComponentProps<typeof NavigationMenu$1.Trigger>): React$1.JSX.Element;
declare function NavigationMenuContent({ className, ...props }: React$1.ComponentProps<typeof NavigationMenu$1.Content>): React$1.JSX.Element;
declare function NavigationMenuViewport({ className, ...props }: React$1.ComponentProps<typeof NavigationMenu$1.Viewport>): React$1.JSX.Element;
declare function NavigationMenuLink({ className, ...props }: React$1.ComponentProps<typeof NavigationMenu$1.Link>): React$1.JSX.Element;

/**
 * Site navigation — FRAME layer navigation primitive.
 *
 * Desktop (>=768px): Radix NavigationMenu with flyout viewport panels,
 * industrial DU/TDR styling — zero border-radius, 2px borders, mono uppercase.
 *
 * Mobile (<768px): SFSheet slide-out with hamburger trigger for vertical navigation.
 *
 * Compose desktop and mobile together for responsive navigation:
 *
 * @example
 * ```tsx
 * <nav>
 *   <SFNavigationMenu className="hidden md:flex">
 *     <SFNavigationMenuList>
 *       <SFNavigationMenuItem>
 *         <SFNavigationMenuTrigger>DOCS</SFNavigationMenuTrigger>
 *         <SFNavigationMenuContent>
 *           <SFNavigationMenuLink href="/docs/intro">INTRO</SFNavigationMenuLink>
 *         </SFNavigationMenuContent>
 *       </SFNavigationMenuItem>
 *     </SFNavigationMenuList>
 *   </SFNavigationMenu>
 *
 *   <SFNavigationMenuMobile>
 *     <a href="/docs">DOCS</a>
 *     <a href="/api">API</a>
 *   </SFNavigationMenuMobile>
 * </nav>
 * ```
 */
/**
 * SF-wrapped NavigationMenu root with industrial styling — FRAME layer navigation primitive.
 * @example
 * <SFNavigationMenu><SFNavigationMenuList><SFNavigationMenuItem>Item</SFNavigationMenuItem></SFNavigationMenuList></SFNavigationMenu>
 */
declare function SFNavigationMenu({ className, children, viewport, ...props }: React$1.ComponentProps<typeof NavigationMenu> & {
    viewport?: boolean;
}): React$1.JSX.Element;
/**
 * Sub-component of SFNavigationMenu — list container for navigation items.
 * @example
 * <SFNavigationMenuList><SFNavigationMenuItem>Home</SFNavigationMenuItem></SFNavigationMenuList>
 */
declare function SFNavigationMenuList({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuList>): React$1.JSX.Element;
/**
 * Sub-component of SFNavigationMenu — individual navigation item wrapper.
 * @example
 * <SFNavigationMenuItem><SFNavigationMenuLink href="/docs">Docs</SFNavigationMenuLink></SFNavigationMenuItem>
 */
declare function SFNavigationMenuItem({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuItem>): React$1.JSX.Element;
/**
 * Sub-component of SFNavigationMenu — trigger button with chevron, industrial styling.
 * @example
 * <SFNavigationMenuTrigger>Products</SFNavigationMenuTrigger>
 */
declare function SFNavigationMenuTrigger({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFNavigationMenu — flyout content panel with preserved motion animations.
 * @example
 * <SFNavigationMenuContent><SFNavigationMenuLink href="/docs/intro">Intro</SFNavigationMenuLink></SFNavigationMenuContent>
 */
declare function SFNavigationMenuContent({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuContent>): React$1.JSX.Element;
/**
 * Sub-component of SFNavigationMenu — navigation link with inverted hover state.
 * @example
 * <SFNavigationMenuLink href="/reference">Reference</SFNavigationMenuLink>
 */
declare function SFNavigationMenuLink({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuLink>): React$1.JSX.Element;
/**
 * Sub-component of SFNavigationMenu — viewport flyout container with 2px industrial border.
 * @example
 * <SFNavigationMenuViewport />
 */
declare function SFNavigationMenuViewport({ className, ...props }: React$1.ComponentProps<typeof NavigationMenuViewport>): React$1.JSX.Element;
/**
 * Mobile navigation — SFSheet slide-out with hamburger trigger, visible only below md breakpoint.
 * @example
 * <SFNavigationMenuMobile title="MENU"><a href="/docs">Docs</a><a href="/api">API</a></SFNavigationMenuMobile>
 */
declare function SFNavigationMenuMobile({ children, className, title, }: {
    children: React$1.ReactNode;
    className?: string;
    title?: string;
}): React$1.JSX.Element;

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
declare const sfToggleGroupItemVariants: (props?: ({
    intent?: "ghost" | "primary" | null | undefined;
    size?: "sm" | "lg" | "md" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type SFToggleGroupProps = React$1.ComponentProps<typeof ToggleGroup.Root> & VariantProps<typeof sfToggleGroupItemVariants>;
declare function SFToggleGroup({ className, intent, size, children, ...props }: SFToggleGroupProps): React$1.JSX.Element;
interface SFToggleGroupItemProps extends React$1.ComponentProps<typeof ToggleGroup.Item>, VariantProps<typeof sfToggleGroupItemVariants> {
}
/**
 * Sub-component of SFToggleGroup — individual toggle button item that inherits group intent and size.
 * @example
 * <SFToggleGroupItem value="grid">Grid</SFToggleGroupItem>
 */
declare function SFToggleGroupItem({ className, intent, size, children, ...props }: SFToggleGroupItemProps): React$1.JSX.Element;

declare function InputGroup({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare const inputGroupAddonVariants: (props?: ({
    align?: "inline-start" | "inline-end" | "block-start" | "block-end" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function InputGroupAddon({ className, align, ...props }: React$1.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>): React$1.JSX.Element;
declare const inputGroupButtonVariants: (props?: ({
    size?: "xs" | "sm" | "icon-xs" | "icon-sm" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function InputGroupButton({ className, type, variant, size, ...props }: Omit<React$1.ComponentProps<typeof Button>, "size"> & VariantProps<typeof inputGroupButtonVariants>): React$1.JSX.Element;
declare function InputGroupText({ className, ...props }: React$1.ComponentProps<"span">): React$1.JSX.Element;
declare function InputGroupInput({ className, ...props }: React$1.ComponentProps<"input">): React$1.JSX.Element;
declare function InputGroupTextarea({ className, ...props }: React$1.ComponentProps<"textarea">): React$1.JSX.Element;

/**
 * Grouped input with addons — FRAME layer form primitive.
 * Wraps all sub-elements with zero border-radius.
 *
 * Overrides `ui/input-group.tsx`'s `rounded-lg` on the root and
 * CVA-generated `rounded-[calc(var(--radius)-5px)]` / `rounded-[calc(var(--radius)-3px)]`
 * on addon and button children.
 *
 * @example
 * <SFInputGroup>
 *   <SFInputGroupAddon align="inline-start">
 *     <SFInputGroupText>@</SFInputGroupText>
 *   </SFInputGroupAddon>
 *   <SFInputGroupInput placeholder="username" />
 *   <SFInputGroupAddon align="inline-end">
 *     <SFInputGroupButton>Send</SFInputGroupButton>
 *   </SFInputGroupAddon>
 * </SFInputGroup>
 */
declare function SFInputGroup({ className, ...props }: React.ComponentProps<typeof InputGroup>): React$1.JSX.Element;
/**
 * Sub-component of SFInputGroup — addon wrapper for inline or block decorators. Zero border-radius on kbd children.
 * @example
 * <SFInputGroupAddon align="inline-start"><SFInputGroupText>@</SFInputGroupText></SFInputGroupAddon>
 */
declare function SFInputGroupAddon({ className, ...props }: React.ComponentProps<typeof InputGroupAddon>): React$1.JSX.Element;
/**
 * Sub-component of SFInputGroup — action button inside input group. Overrides CVA's calc-based radius with rounded-none.
 * @example
 * <SFInputGroupAddon align="inline-end"><SFInputGroupButton>Send</SFInputGroupButton></SFInputGroupAddon>
 */
declare function SFInputGroupButton({ className, ...props }: React.ComponentProps<typeof InputGroupButton>): React$1.JSX.Element;
/**
 * Sub-component of SFInputGroup — non-interactive text label or icon inside the group.
 * @example
 * <SFInputGroupText>@</SFInputGroupText>
 */
declare function SFInputGroupText({ className, ...props }: React.ComponentProps<typeof InputGroupText>): React$1.JSX.Element;
/**
 * Sub-component of SFInputGroup — the primary input field. Base already applies rounded-none; passthrough maintains the contract.
 * @example
 * <SFInputGroupInput placeholder="username" />
 */
declare function SFInputGroupInput({ className, ...props }: React.ComponentProps<typeof InputGroupInput>): React$1.JSX.Element;
/**
 * Sub-component of SFInputGroup — multiline textarea variant. Base already applies rounded-none; passthrough maintains the contract.
 * @example
 * <SFInputGroupTextarea placeholder="Enter your message..." rows={4} />
 */
declare function SFInputGroupTextarea({ className, ...props }: React.ComponentProps<typeof InputGroupTextarea>): React$1.JSX.Element;

declare function InputOTP({ className, containerClassName, ...props }: React$1.ComponentProps<typeof OTPInput> & {
    containerClassName?: string;
}): React$1.JSX.Element;
declare function InputOTPGroup({ className, ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;
declare function InputOTPSlot({ index, className, ...props }: React$1.ComponentProps<"div"> & {
    index: number;
}): React$1.JSX.Element;
declare function InputOTPSeparator({ ...props }: React$1.ComponentProps<"div">): React$1.JSX.Element;

/**
 * One-time password input — FRAME layer form primitive.
 *
 * Individual character slots for verification codes. Keyboard navigable,
 * supports paste and SMS autofill. Zero border-radius on all slots.
 *
 * @example
 * <SFInputOTP maxLength={6}>
 *   <SFInputOTPGroup>
 *     <SFInputOTPSlot index={0} />
 *     <SFInputOTPSlot index={1} />
 *     <SFInputOTPSlot index={2} />
 *   </SFInputOTPGroup>
 *   <SFInputOTPSeparator />
 *   <SFInputOTPGroup>
 *     <SFInputOTPSlot index={3} />
 *     <SFInputOTPSlot index={4} />
 *     <SFInputOTPSlot index={5} />
 *   </SFInputOTPGroup>
 * </SFInputOTP>
 */
declare function SFInputOTP({ className, ...props }: React.ComponentProps<typeof InputOTP>): React$1.JSX.Element;
/**
 * Sub-component of SFInputOTP — groups slots together visually. Zero border-radius on group container.
 * @example
 * <SFInputOTPGroup><SFInputOTPSlot index={0} /><SFInputOTPSlot index={1} /></SFInputOTPGroup>
 */
declare function SFInputOTPGroup({ className, ...props }: React.ComponentProps<typeof InputOTPGroup>): React$1.JSX.Element;
/**
 * Sub-component of SFInputOTP — individual character slot. Zero radius, 2px foreground border, ring on active state.
 * @example
 * <SFInputOTPSlot index={0} />
 */
declare function SFInputOTPSlot({ className, ...props }: React.ComponentProps<typeof InputOTPSlot>): React$1.JSX.Element;
/**
 * Sub-component of SFInputOTP — visual separator between slot groups (renders a dash by default).
 * @example
 * <SFInputOTPSeparator />
 */
declare function SFInputOTPSeparator(props: React.ComponentProps<typeof InputOTPSeparator>): React$1.JSX.Element;

declare function HoverCard({ ...props }: React$1.ComponentProps<typeof HoverCard$1.Root>): React$1.JSX.Element;
declare function HoverCardTrigger({ ...props }: React$1.ComponentProps<typeof HoverCard$1.Trigger>): React$1.JSX.Element;
declare function HoverCardContent({ className, align, sideOffset, ...props }: React$1.ComponentProps<typeof HoverCard$1.Content>): React$1.JSX.Element;

/**
 * Hover/focus preview panel — FRAME layer overlay primitive.
 *
 * Radix HoverCard wrapped with SF contract. Content applies sharp corners,
 * 2px border, no shadow. Keyboard accessible via Radix open-on-focus.
 *
 * @example
 * <SFHoverCard>
 *   <SFHoverCardTrigger asChild><SFButton>Preview</SFButton></SFHoverCardTrigger>
 *   <SFHoverCardContent>Card details here</SFHoverCardContent>
 * </SFHoverCard>
 */
declare function SFHoverCard(props: React.ComponentProps<typeof HoverCard>): React$1.JSX.Element;
/**
 * Sub-component of SFHoverCard — trigger that opens on hover or keyboard focus.
 * @example
 * <SFHoverCardTrigger asChild><SFButton>Preview</SFButton></SFHoverCardTrigger>
 */
declare function SFHoverCardTrigger(props: React.ComponentProps<typeof HoverCardTrigger>): React$1.JSX.Element;
/**
 * Sub-component of SFHoverCard — floating content panel with sharp corners, 2px border, no shadow.
 * @example
 * <SFHoverCardContent><p className="text-xs font-mono">Component details</p></SFHoverCardContent>
 */
declare function SFHoverCardContent({ className, ...props }: React.ComponentProps<typeof HoverCardContent>): React$1.JSX.Element;

/** Configuration for the SignalframeUX provider factory. All values are serializable. */
interface SignalframeUXConfig {
    /** Initial theme preference. 'system' reads prefers-color-scheme at runtime. Default: 'system' */
    defaultTheme?: 'light' | 'dark' | 'system';
    /** Motion preference override. 'system' respects prefers-reduced-motion. Default: 'system' */
    motionPreference?: 'full' | 'reduced' | 'system';
}
/** Controls GSAP's global timeline. resume() is a no-op when prefers-reduced-motion is active. */
interface SignalframeMotionController {
    /** Pauses all GSAP animations globally (gsap.globalTimeline.pause). */
    pause: () => void;
    /**
     * Resumes GSAP animations globally.
     * No-op when prefersReduced is true — respects user's accessibility preference.
     */
    resume: () => void;
    /** True when the OS prefers-reduced-motion media query is active or motionPreference is 'reduced'. */
    prefersReduced: boolean;
}
/** Value returned by useSignalframe(). */
interface UseSignalframeReturn {
    /** Current resolved theme ('light' | 'dark'). Reads from document classList, not localStorage. */
    theme: 'light' | 'dark';
    /** Hard-cut DU-style theme switch. Wraps lib/theme toggleTheme. */
    setTheme: (theme: 'light' | 'dark') => void;
    /** Global GSAP motion controller with reduced-motion guard. */
    motion: SignalframeMotionController;
}
/**
 * Factory that creates a typed, SSR-safe SignalframeProvider + useSignalframe hook pair.
 * Note: The returned useSignalframe is identical to the standalone export — both read
 * from the shared SignalframeContext singleton. Multiple createSignalframeUX() calls
 * share the same context. The factory return is for destructured convenience only.
 *
 * @example
 * // In app/layout.tsx (module scope — not inside the component):
 * const { SignalframeProvider } = createSignalframeUX({ defaultTheme: 'dark' });
 */
declare function createSignalframeUX(config?: SignalframeUXConfig): {
    SignalframeProvider: React.ComponentType<{
        children: React.ReactNode;
    }>;
    useSignalframe: () => UseSignalframeReturn;
};
/**
 * Standalone hook — reads from the nearest SignalframeContext mounted via createSignalframeUX.
 * Throws a descriptive error if called outside a SignalframeProvider.
 */
declare function useSignalframe(): UseSignalframeReturn;

/**
 * Class name utility — merges Tailwind classes with clsx + tailwind-merge.
 * Resolves class conflicts (e.g., p-4 vs p-2) so the last class wins.
 *
 * @param inputs - Any number of class values (strings, arrays, objects)
 * @returns Merged, deduplicated class string
 *
 * @example
 * cn("flex items-center", isActive && "bg-foreground text-background")
 * cn("border-2 border-foreground", className)
 */
declare function cn(...inputs: ClassValue[]): string;

/**
 * Shared theme toggle — used by DarkModeToggle and CommandPalette.
 * Hard-cut switch (DU-style) — instant color inversion, no smooth blend.
 *
 * @param currentDark - Whether dark mode is currently active
 * @returns The new dark mode state
 *
 * @example
 * const [isDark, setIsDark] = useState(false);
 * <button onClick={() => setIsDark(toggleTheme(isDark))}>Toggle theme</button>
 */
declare function toggleTheme(currentDark: boolean): boolean;

/**
 * Shared grain/noise SVG data URI — fractalNoise at 0.65 baseFrequency.
 * Apply as a CSS background-image overlay for the SIGNAL grain texture aesthetic.
 *
 * @example
 * <div style={{ backgroundImage: GRAIN_SVG, opacity: 0.08 }} aria-hidden="true" />
 */
declare const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='sf-grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sf-grain)'/%3E%3C/svg%3E\")";

/**
 * Scramble text animation hook — SIGNAL layer text effect using shared RAF loop.
 * Displays randomized glyphs that progressively resolve to the target string.
 * Respects prefers-reduced-motion and skips animation on mobile (<768px).
 *
 * @param target - The final string to reveal after scrambling
 * @param delay - Milliseconds to wait before starting the scramble animation
 * @param duration - Total duration of the scramble effect in milliseconds (default: 600)
 * @returns The current display string (scrambled during animation, target when settled)
 *
 * @example
 * function Hero() {
 *   const text = useScrambleText("SIGNALFRAME", 200, 800);
 *   return <h1 className="font-mono">{text}</h1>;
 * }
 */
declare function useScrambleText(target: string, delay: number, duration?: number): string;

/**
 * Namespaced sessionStorage keys for SignalframeUX.
 * Centralised here to prevent key collisions across the codebase.
 *
 * All keys use the `sfux.` namespace prefix.
 */
declare const SESSION_KEYS: {
    readonly COMPONENTS_FILTER: "sfux.components.filter";
    readonly TOKENS_TAB: "sfux.tokens.tab";
    readonly DETAIL_OPEN: "sfux.detail.open";
    readonly COMPONENTS_LAYER: "sfux.components.layer";
    readonly COMPONENTS_PATTERN: "sfux.components.pattern";
};
/**
 * SSR-safe sessionStorage hook. Mirrors the `useState` API.
 *
 * SSR contract:
 * - Server render: always returns `defaultValue` (no browser APIs accessed).
 * - Initial client render: also returns `defaultValue` — matches server HTML, no hydration mismatch.
 * - After mount: reads from sessionStorage and updates state if a stored value exists.
 * - On state change: writes the new value to sessionStorage.
 * - Hard reload: sessionStorage is cleared by the browser automatically, so `defaultValue` is used again.
 *
 * sessionStorage failures (private browsing, quota exceeded) are caught silently —
 * state still updates in memory so the UI remains functional.
 *
 * @param key - sessionStorage key (use a constant from SESSION_KEYS)
 * @param defaultValue - Value used on server and on first client render
 *
 * @example
 * const [activeFilter, setActiveFilter] = useSessionState<Category>(
 *   SESSION_KEYS.COMPONENTS_FILTER,
 *   "ALL"
 * );
 */
declare function useSessionState<T>(key: string, defaultValue: T): [T, (value: T) => void];

export { GRAIN_SVG, SESSION_KEYS, SFAlert, SFAlertDescription, SFAlertDialog, SFAlertDialogAction, SFAlertDialogCancel, SFAlertDialogContent, SFAlertDialogDescription, SFAlertDialogFooter, SFAlertDialogHeader, SFAlertDialogTitle, SFAlertDialogTrigger, SFAlertTitle, SFAvatar, SFAvatarFallback, SFAvatarImage, SFBadge, SFBreadcrumb, SFBreadcrumbItem, SFBreadcrumbLink, SFBreadcrumbList, SFBreadcrumbPage, SFBreadcrumbSeparator, SFButton, SFCard, SFCardContent, SFCardDescription, SFCardFooter, SFCardHeader, SFCardTitle, SFCheckbox, SFCollapsible, SFCollapsibleContent, SFCollapsibleTrigger, SFCommand, SFCommandDialog, SFCommandEmpty, SFCommandGroup, SFCommandInput, SFCommandItem, SFCommandList, SFCommandSeparator, SFCommandShortcut, SFContainer, SFDialog, SFDialogClose, SFDialogContent, SFDialogDescription, SFDialogFooter, SFDialogHeader, SFDialogTitle, SFDialogTrigger, SFDropdownMenu, SFDropdownMenuContent, SFDropdownMenuGroup, SFDropdownMenuItem, SFDropdownMenuLabel, SFDropdownMenuSeparator, SFDropdownMenuShortcut, SFDropdownMenuTrigger, SFGrid, SFHoverCard, SFHoverCardContent, SFHoverCardTrigger, SFInput, SFInputGroup, SFInputGroupAddon, SFInputGroupButton, SFInputGroupInput, SFInputGroupText, SFInputGroupTextarea, SFInputOTP, SFInputOTPGroup, SFInputOTPSeparator, SFInputOTPSlot, SFLabel, SFNavigationMenu, SFNavigationMenuContent, SFNavigationMenuItem, SFNavigationMenuLink, SFNavigationMenuList, SFNavigationMenuMobile, SFNavigationMenuTrigger, SFNavigationMenuViewport, SFPagination, SFPaginationContent, SFPaginationItem, SFPaginationLink, SFPaginationNext, SFPaginationPrevious, SFPopover, SFPopoverContent, SFPopoverDescription, SFPopoverHeader, SFPopoverTitle, SFPopoverTrigger, SFRadioGroup, SFRadioGroupItem, SFScrollArea, SFScrollBar, SFSection, SFSelect, SFSelectContent, SFSelectGroup, SFSelectItem, SFSelectLabel, SFSelectTrigger, SFSelectValue, SFSeparator, SFSheet, SFSheetClose, SFSheetContent, SFSheetDescription, SFSheetFooter, SFSheetHeader, SFSheetTitle, SFSheetTrigger, SFSkeleton, SFSlider, SFStack, SFSwitch, SFTable, SFTableBody, SFTableCell, SFTableHead, SFTableHeader, SFTableRow, SFTabs, SFTabsContent, SFTabsList, SFTabsTrigger, SFText, SFTextarea, SFToggle, SFToggleGroup, SFToggleGroupItem, SFTooltip, SFTooltipContent, SFTooltipTrigger, type SignalframeUXConfig, type TextVariant, type UseSignalframeReturn, cn, createSignalframeUX, toggleTheme, useScrambleText, useSessionState, useSignalframe };
