import type { Meta, StoryObj } from "@storybook/react";
import { VHSOverlay } from "@/components/animation/vhs-overlay";

const meta: Meta<typeof VHSOverlay> = {
  title: "Signal/VHSOverlay",
  component: VHSOverlay,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="relative w-full h-[400px] bg-background overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-foreground font-mono text-lg">
          VHS OVERLAY ACTIVE
        </div>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof VHSOverlay>;

export const Default: Story = {};
