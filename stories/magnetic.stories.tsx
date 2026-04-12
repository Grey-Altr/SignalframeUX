import type { Meta, StoryObj } from "@storybook/react";
import { Magnetic } from "@/components/animation/magnetic";

const meta: Meta<typeof Magnetic> = {
  title: "Signal/Magnetic",
  component: Magnetic,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-16 bg-background flex items-center justify-center min-h-[300px]">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Magnetic>;

export const Default: Story = {
  render: () => (
    <Magnetic>
      <div className="px-8 py-4 border-2 border-foreground font-mono text-sm text-foreground cursor-pointer">
        MAGNETIC PULL
      </div>
    </Magnetic>
  ),
};

export const Strong: Story = {
  render: () => (
    <Magnetic strength={0.4} radius={100} maxDisplacement={16}>
      <div className="px-8 py-4 border-2 border-primary text-primary font-mono text-sm cursor-pointer">
        STRONG PULL
      </div>
    </Magnetic>
  ),
};
