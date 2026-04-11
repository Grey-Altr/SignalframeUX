"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFProgress } from "@/components/sf/sf-progress";

const meta: Meta<typeof SFProgress> = {
  title: "SIGNAL/SFProgress",
  component: SFProgress,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Progress percentage 0–100",
    },
  },
  args: {
    value: 60,
    className: "w-72",
  },
};
export default meta;

type Story = StoryObj<typeof SFProgress>;

export const Default: Story = {};

export const Signal: Story = {
  args: {
    value: 75,
    className: "w-72 h-2 [&_[data-slot=progress-indicator]]:bg-primary",
  },
};

export const Complete: Story = {
  args: { value: 100 },
};

export const Empty: Story = {
  args: { value: 0 },
};

export const Steps: Story = {
  render: () => (
    <div className="space-y-4 w-72">
      <div className="flex items-center justify-between font-mono text-xs">
        <span>UPLOAD</span>
        <span>100%</span>
      </div>
      <SFProgress value={100} className="w-full" />
      <div className="flex items-center justify-between font-mono text-xs">
        <span>VALIDATE</span>
        <span>60%</span>
      </div>
      <SFProgress value={60} className="w-full" />
      <div className="flex items-center justify-between font-mono text-xs">
        <span>PUBLISH</span>
        <span>0%</span>
      </div>
      <SFProgress value={0} className="w-full" />
    </div>
  ),
};
