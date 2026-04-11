import type { Meta, StoryObj } from "@storybook/react";
import {
  SFAlertDialog,
  SFAlertDialogTrigger,
  SFAlertDialogContent,
  SFAlertDialogHeader,
  SFAlertDialogTitle,
  SFAlertDialogDescription,
  SFAlertDialogFooter,
  SFAlertDialogAction,
  SFAlertDialogCancel,
} from "@/components/sf/sf-alert-dialog";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFAlertDialog> = {
  title: "Feedback/SFAlertDialog",
  component: SFAlertDialog,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFAlertDialog>;

export const Default: Story = {
  render: () => (
    <SFAlertDialog>
      <SFAlertDialogTrigger asChild>
        <SFButton size="sm" intent="signal">DELETE MODULE</SFButton>
      </SFAlertDialogTrigger>
      <SFAlertDialogContent>
        <SFAlertDialogHeader>
          <SFAlertDialogTitle>CONFIRM DELETION</SFAlertDialogTitle>
          <SFAlertDialogDescription>
            This will permanently remove the module. This action cannot be undone.
          </SFAlertDialogDescription>
        </SFAlertDialogHeader>
        <SFAlertDialogFooter>
          <SFAlertDialogCancel>CANCEL</SFAlertDialogCancel>
          <SFAlertDialogAction>CONFIRM DELETE</SFAlertDialogAction>
        </SFAlertDialogFooter>
      </SFAlertDialogContent>
    </SFAlertDialog>
  ),
};
