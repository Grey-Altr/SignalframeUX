"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFSection } from "@/components/sf/sf-section";

const meta: Meta<typeof SFSection> = {
  title: "Layout/SFSection",
  component: SFSection,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFSection>;

export const Default: Story = {
  render: () => (
    <SFSection label="Work" spacing="16" className="border-2 border-foreground">
      <p className="font-mono text-sm px-4">SECTION — data-section, data-section-label</p>
    </SFSection>
  ),
};

export const Compact: Story = {
  render: () => (
    <SFSection spacing="8" className="border-2 border-foreground">
      <p className="font-mono text-sm px-4">COMPACT spacing-8</p>
    </SFSection>
  ),
};

export const Spacious: Story = {
  render: () => (
    <SFSection spacing="24" label="Hero" className="border-2 border-foreground">
      <p className="font-mono text-sm px-4">SPACIOUS spacing-24</p>
    </SFSection>
  ),
};
