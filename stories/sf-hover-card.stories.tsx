import type { Meta, StoryObj } from "@storybook/react";
import {
  SFHoverCard,
  SFHoverCardTrigger,
  SFHoverCardContent,
} from "@/components/sf/sf-hover-card";

const meta: Meta<typeof SFHoverCard> = {
  title: "Overlay/SFHoverCard",
  component: SFHoverCard,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFHoverCard>;

export const Default: Story = {
  render: () => (
    <SFHoverCard>
      <SFHoverCardTrigger asChild>
        <span className="font-mono underline underline-offset-2 cursor-pointer">@SIGNALFRAME</span>
      </SFHoverCardTrigger>
      <SFHoverCardContent className="w-64">
        <div className="space-y-2 font-mono text-sm">
          <p className="font-bold">SIGNALFRAME//UX</p>
          <p className="text-muted-foreground text-xs">
            High-performance design system — FRAME/SIGNAL dual-layer model.
          </p>
        </div>
      </SFHoverCardContent>
    </SFHoverCard>
  ),
};
