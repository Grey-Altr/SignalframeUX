"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFStatusDot, type SFStatusDotStatus } from "@/components/sf/sf-status-dot";

const meta: Meta<typeof SFStatusDot> = {
  title: "SIGNAL/SFStatusDot",
  component: SFStatusDot,
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: { type: "select" },
      options: ["active", "idle", "offline"] satisfies SFStatusDotStatus[],
      description: "Presence state: active (pulsing green), idle (accent), offline (muted)",
    },
  },
  args: {
    status: "active",
  },
};
export default meta;

type Story = StoryObj<typeof SFStatusDot>;

export const Active: Story = {
  args: { status: "active" },
  render: (args) => (
    <div className="flex items-center gap-3">
      <SFStatusDot {...args} />
      <span className="font-mono text-sm">ACTIVE — pulsing green GSAP loop</span>
    </div>
  ),
};

export const Idle: Story = {
  args: { status: "idle" },
  render: (args) => (
    <div className="flex items-center gap-3">
      <SFStatusDot {...args} />
      <span className="font-mono text-sm">IDLE — static accent color</span>
    </div>
  ),
};

export const Offline: Story = {
  args: { status: "offline" },
  render: (args) => (
    <div className="flex items-center gap-3">
      <SFStatusDot {...args} />
      <span className="font-mono text-sm">OFFLINE — muted foreground</span>
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-3">
      {(["active", "idle", "offline"] as SFStatusDotStatus[]).map((status) => (
        <div key={status} className="flex items-center gap-3">
          <SFStatusDot status={status} />
          <span className="font-mono text-xs uppercase">{status}</span>
        </div>
      ))}
    </div>
  ),
};
