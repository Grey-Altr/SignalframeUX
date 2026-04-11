"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFGrid } from "@/components/sf/sf-grid";

const meta: Meta<typeof SFGrid> = {
  title: "Layout/SFGrid",
  component: SFGrid,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFGrid>;

const Cell = ({ label }: { label: string }) => (
  <div className="border-2 border-foreground p-6 font-mono text-xs">{label}</div>
);

export const ThreeCol: Story = {
  render: () => (
    <SFGrid cols="3" gap="6">
      <Cell label="COL 01" />
      <Cell label="COL 02" />
      <Cell label="COL 03" />
      <Cell label="COL 04" />
      <Cell label="COL 05" />
      <Cell label="COL 06" />
    </SFGrid>
  ),
};

export const TwoCol: Story = {
  render: () => (
    <SFGrid cols="2" gap="4">
      <Cell label="LEFT" />
      <Cell label="RIGHT" />
    </SFGrid>
  ),
};

export const Auto: Story = {
  render: () => (
    <SFGrid cols="auto" gap="4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Cell key={i} label={`ITEM ${String(i + 1).padStart(2, "0")}`} />
      ))}
    </SFGrid>
  ),
};
