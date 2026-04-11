"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFButton> = {
  title: "Flagship/SFButton",
  component: SFButton,
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: { type: "select" },
      options: ["primary", "ghost", "signal"],
      description: "Visual variant — primary | ghost | signal",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg", "xl"],
      description: "Height and padding scale",
    },
    disabled: {
      control: "boolean",
      description: "Disabled state",
    },
    children: {
      control: "text",
      description: "Button label",
    },
  },
  args: {
    intent: "primary",
    size: "md",
    disabled: false,
    children: "EXECUTE",
  },
};
export default meta;

type Story = StoryObj<typeof SFButton>;

export const Primary: Story = {
  args: { intent: "primary", children: "LAUNCH SYSTEM" },
};

export const Ghost: Story = {
  args: { intent: "ghost", children: "CANCEL" },
};

export const Signal: Story = {
  args: { intent: "signal", children: "SIGNAL ACTIVE" },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <SFButton size="sm">SMALL</SFButton>
      <SFButton size="md">MEDIUM</SFButton>
      <SFButton size="lg">LARGE</SFButton>
      <SFButton size="xl">XLARGE</SFButton>
    </div>
  ),
};

export const AllIntents: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <SFButton intent="primary">PRIMARY</SFButton>
      <SFButton intent="ghost">GHOST</SFButton>
      <SFButton intent="signal">SIGNAL</SFButton>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, children: "DISABLED" },
};
