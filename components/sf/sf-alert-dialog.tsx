"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
function SFAlertDialog(props: React.ComponentProps<typeof AlertDialog>) {
  return <AlertDialog {...props} />;
}

/**
 * Sub-component of SFAlertDialog -- trigger element that opens the dialog on interaction.
 * @example
 * <SFAlertDialogTrigger asChild><SFButton>Delete</SFButton></SFAlertDialogTrigger>
 */
function SFAlertDialogTrigger(
  props: React.ComponentProps<typeof AlertDialogTrigger>
) {
  return <AlertDialogTrigger {...props} />;
}

/**
 * Sub-component of SFAlertDialog -- modal content panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFAlertDialogContent><SFAlertDialogHeader><SFAlertDialogTitle>Confirm</SFAlertDialogTitle></SFAlertDialogHeader></SFAlertDialogContent>
 */
function SFAlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogContent>) {
  return (
    <AlertDialogContent
      className={cn("rounded-none border-2 shadow-none", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFAlertDialog -- header region containing title and description.
 * @example
 * <SFAlertDialogHeader><SFAlertDialogTitle>Are you sure?</SFAlertDialogTitle></SFAlertDialogHeader>
 */
function SFAlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogHeader>) {
  return <AlertDialogHeader className={cn(className)} {...props} />;
}

/**
 * Sub-component of SFAlertDialog -- footer region with sharp corners overriding base rounded-b-xl.
 * @example
 * <SFAlertDialogFooter><SFAlertDialogCancel>Cancel</SFAlertDialogCancel><SFAlertDialogAction>Confirm</SFAlertDialogAction></SFAlertDialogFooter>
 */
function SFAlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogFooter>) {
  return (
    <AlertDialogFooter className={cn("rounded-none", className)} {...props} />
  );
}

/**
 * Sub-component of SFAlertDialog -- title in monospace uppercase with wider tracking.
 * @example
 * <SFAlertDialogTitle>Delete Project?</SFAlertDialogTitle>
 */
function SFAlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogTitle>) {
  return (
    <AlertDialogTitle
      className={cn("font-mono uppercase tracking-wider", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFAlertDialog -- supporting description text below the title.
 * @example
 * <SFAlertDialogDescription>This action cannot be undone and will permanently delete all data.</SFAlertDialogDescription>
 */
function SFAlertDialogDescription(
  props: React.ComponentProps<typeof AlertDialogDescription>
) {
  return <AlertDialogDescription {...props} />;
}

/**
 * Sub-component of SFAlertDialog -- confirm action button with optional loading state.
 * @example
 * <SFAlertDialogAction loading={isDeleting} onClick={handleDelete}>Delete</SFAlertDialogAction>
 */
interface SFAlertDialogActionProps
  extends React.ComponentProps<typeof AlertDialogAction> {
  loading?: boolean;
}

function SFAlertDialogAction({
  loading,
  disabled,
  className,
  children,
  ...props
}: SFAlertDialogActionProps) {
  return (
    <AlertDialogAction
      disabled={disabled || loading}
      className={cn("rounded-none", className)}
      {...props}
    >
      {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
      {children}
    </AlertDialogAction>
  );
}

/**
 * Sub-component of SFAlertDialog -- cancel button with sharp corners that dismisses the dialog.
 * @example
 * <SFAlertDialogCancel>Cancel</SFAlertDialogCancel>
 */
function SFAlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogCancel>) {
  return (
    <AlertDialogCancel className={cn("rounded-none", className)} {...props} />
  );
}

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
};
