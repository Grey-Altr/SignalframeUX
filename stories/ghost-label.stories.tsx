import type { Meta, StoryObj } from "@storybook/react";
import { GhostLabel } from "@/components/animation/ghost-label";

const meta: Meta<typeof GhostLabel> = {
  title: "Signal/GhostLabel",
  component: GhostLabel,
  tags: ["autodocs"],
  args: {
    text: "SIGNAL",
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-[300px] bg-background overflow-hidden">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof GhostLabel>;

export const Default: Story = {
  args: {
    className: "left-0 top-1/2 -translate-y-1/2 text-foreground/[0.04]",
  },
};

export const Thesis: Story = {
  args: {
    text: "THESIS",
    className: "-left-[3vw] top-1/2 -translate-y-1/2 text-foreground/[0.04]",
  },
};
