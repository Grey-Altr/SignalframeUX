import type { Meta, StoryObj } from "@storybook/react";
import { XrayReveal } from "@/components/animation/xray-reveal";

const meta: Meta<typeof XrayReveal> = {
  title: "Signal/XrayReveal",
  component: XrayReveal,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8 bg-background">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof XrayReveal>;

export const Default: Story = {
  render: () => (
    <XrayReveal
      topLayer={
        <div className="w-full h-[300px] bg-foreground flex items-center justify-center text-background font-mono text-lg">
          FRAME LAYER
        </div>
      }
      bottomLayer={
        <div className="w-full h-[300px] bg-primary flex items-center justify-center text-background font-mono text-lg">
          SIGNAL LAYER
        </div>
      }
    />
  ),
};

export const LargeRadius: Story = {
  render: () => (
    <XrayReveal
      radius={120}
      topLayer={
        <div className="w-full h-[300px] bg-foreground flex items-center justify-center text-background font-mono">
          SURFACE
        </div>
      }
      bottomLayer={
        <div className="w-full h-[300px] bg-primary flex items-center justify-center text-background font-mono">
          UNDERNEATH
        </div>
      }
    />
  ),
};
