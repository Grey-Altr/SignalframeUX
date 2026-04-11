"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFEmptyState } from "@/components/sf/sf-empty-state";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFEmptyState> = {
  title: "SIGNAL/SFEmptyState",
  component: SFEmptyState,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Primary message displayed in monospace uppercase",
    },
    scramble: {
      control: "boolean",
      description: "Enable ScrambleText SIGNAL layer effect on title",
    },
  },
  args: {
    title: "NO DATA FOUND",
    scramble: false,
  },
};
export default meta;

type Story = StoryObj<typeof SFEmptyState>;

export const Default: Story = {
  render: (args) => (
    <div className="w-96 border-2 border-foreground">
      <SFEmptyState {...args}>
        <p>Try adjusting your filters or search query.</p>
      </SFEmptyState>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className="w-96 border-2 border-foreground">
      <SFEmptyState
        title="NO MODULES LOADED"
        action={<SFButton size="sm">INITIALIZE SYSTEM</SFButton>}
      >
        <p>No modules have been configured yet.</p>
      </SFEmptyState>
    </div>
  ),
};

export const WithScramble: Story = {
  args: { title: "SIGNAL LOST", scramble: true },
  render: (args) => (
    <div className="w-96 border-2 border-foreground">
      <SFEmptyState {...args}>
        <p>Connection to SIGNAL layer failed.</p>
      </SFEmptyState>
    </div>
  ),
};

export const Minimal: Story = {
  render: () => (
    <div className="w-96 border-2 border-foreground">
      <SFEmptyState title="EMPTY" />
    </div>
  ),
};
