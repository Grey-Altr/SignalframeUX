import type { Meta, StoryObj } from "@storybook/react";
import { CircuitDivider } from "@/components/animation/circuit-divider";

const meta: Meta<typeof CircuitDivider> = {
  title: "Signal/CircuitDivider",
  component: CircuitDivider,
  tags: ["autodocs"],
  args: {
    variant: "default",
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-background">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof CircuitDivider>;

export const Default: Story = {};

export const Complex: Story = {
  args: { variant: "complex" },
};

export const Minimal: Story = {
  args: { variant: "minimal" },
};
