import type { Meta, StoryObj } from "@storybook/react";
import {
  SFSheet,
  SFSheetTrigger,
  SFSheetContent,
  SFSheetHeader,
  SFSheetTitle,
  SFSheetDescription,
} from "@/components/sf/sf-sheet";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFSheet> = {
  title: "Overlay/SFSheet",
  component: SFSheet,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFSheet>;

export const Default: Story = {
  render: () => (
    <SFSheet>
      <SFSheetTrigger asChild>
        <SFButton size="sm">OPEN PANEL</SFButton>
      </SFSheetTrigger>
      <SFSheetContent>
        <SFSheetHeader>
          <SFSheetTitle>NAVIGATION</SFSheetTitle>
          <SFSheetDescription>System navigation panel</SFSheetDescription>
        </SFSheetHeader>
        <div className="mt-4 space-y-2 font-mono text-sm">
          <p>DOCS</p>
          <p>COMPONENTS</p>
          <p>API</p>
        </div>
      </SFSheetContent>
    </SFSheet>
  ),
};
