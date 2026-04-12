import type { Meta, StoryObj } from "@storybook/react";
import { BorderDraw } from "@/components/animation/border-draw";

const meta: Meta<typeof BorderDraw> = {
  title: "Signal/BorderDraw",
  component: BorderDraw,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-12 bg-background flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof BorderDraw>;

export const Default: Story = {
  render: () => (
    <BorderDraw>
      <div className="px-8 py-4 font-mono text-sm text-foreground">
        HOVER FOR BORDER DRAW
      </div>
    </BorderDraw>
  ),
};

export const Thick: Story = {
  render: () => (
    <BorderDraw weight={4} duration={600}>
      <div className="px-8 py-4 font-mono text-sm text-foreground">
        THICK + SLOW
      </div>
    </BorderDraw>
  ),
};
