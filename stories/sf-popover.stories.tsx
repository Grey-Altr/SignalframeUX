import type { Meta, StoryObj } from "@storybook/react";
import {
  SFPopover,
  SFPopoverTrigger,
  SFPopoverContent,
  SFPopoverHeader,
  SFPopoverTitle,
  SFPopoverDescription,
} from "@/components/sf/sf-popover";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFPopover> = {
  title: "Overlay/SFPopover",
  component: SFPopover,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFPopover>;

export const Default: Story = {
  render: () => (
    <SFPopover>
      <SFPopoverTrigger asChild>
        <SFButton size="sm" intent="ghost">INFO</SFButton>
      </SFPopoverTrigger>
      <SFPopoverContent>
        <SFPopoverHeader>
          <SFPopoverTitle>SYSTEM INFO</SFPopoverTitle>
          <SFPopoverDescription>Version 0.1.0 — FRAME/SIGNAL dual-layer</SFPopoverDescription>
        </SFPopoverHeader>
      </SFPopoverContent>
    </SFPopover>
  ),
};
