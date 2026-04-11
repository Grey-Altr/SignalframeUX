import type { Meta, StoryObj } from "@storybook/react";
import {
  SFTooltip,
  SFTooltipTrigger,
  SFTooltipContent,
} from "@/components/sf/sf-tooltip";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFTooltip> = {
  title: "Overlay/SFTooltip",
  component: SFTooltip,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFTooltip>;

export const Default: Story = {
  render: () => (
    <SFTooltip>
      <SFTooltipTrigger asChild>
        <SFButton size="sm" intent="ghost">HOVER ME</SFButton>
      </SFTooltipTrigger>
      <SFTooltipContent>System signal tooltip</SFTooltipContent>
    </SFTooltip>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <SFTooltip delayDuration={700}>
      <SFTooltipTrigger asChild>
        <SFButton size="sm">DELAYED</SFButton>
      </SFTooltipTrigger>
      <SFTooltipContent>Appears after 700ms delay</SFTooltipContent>
    </SFTooltip>
  ),
};
