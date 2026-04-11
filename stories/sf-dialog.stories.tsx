import type { Meta, StoryObj } from "@storybook/react";
import {
  SFDialog,
  SFDialogTrigger,
  SFDialogContent,
  SFDialogHeader,
  SFDialogTitle,
  SFDialogDescription,
  SFDialogFooter,
} from "@/components/sf/sf-dialog";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFDialog> = {
  title: "Overlay/SFDialog",
  component: SFDialog,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFDialog>;

export const Default: Story = {
  render: () => (
    <SFDialog>
      <SFDialogTrigger asChild>
        <SFButton size="sm">OPEN DIALOG</SFButton>
      </SFDialogTrigger>
      <SFDialogContent>
        <SFDialogHeader>
          <SFDialogTitle>CONFIRM ACTION</SFDialogTitle>
          <SFDialogDescription>This operation cannot be undone.</SFDialogDescription>
        </SFDialogHeader>
        <SFDialogFooter>
          <SFButton size="sm" intent="ghost">CANCEL</SFButton>
          <SFButton size="sm">CONFIRM</SFButton>
        </SFDialogFooter>
      </SFDialogContent>
    </SFDialog>
  ),
};
