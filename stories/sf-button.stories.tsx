import type { Meta, StoryObj } from "@storybook/react";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFButton> = {
  title: "Core/SFButton",
  component: SFButton,
  tags: ["autodocs"],
  args: {
    children: "LAUNCH",
    intent: "primary",
    size: "md",
  },
};
export default meta;

type Story = StoryObj<typeof SFButton>;

export const Default: Story = {};

export const Ghost: Story = {
  args: { intent: "ghost", children: "CANCEL" },
};

export const Signal: Story = {
  args: { intent: "signal", children: "SIGNAL" },
};

export const Small: Story = {
  args: { size: "sm", children: "SMALL" },
};

export const Large: Story = {
  args: { size: "lg", children: "LARGE" },
};
