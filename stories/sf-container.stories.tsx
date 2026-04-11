"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFContainer } from "@/components/sf/sf-container";

const meta: Meta<typeof SFContainer> = {
  title: "Layout/SFContainer",
  component: SFContainer,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFContainer>;

export const Wide: Story = {
  render: () => (
    <SFContainer width="wide" className="border-2 border-foreground p-4">
      <p className="font-mono text-sm">WIDE — max-w-wide, responsive gutters</p>
    </SFContainer>
  ),
};

export const Content: Story = {
  render: () => (
    <SFContainer width="content" className="border-2 border-foreground p-4">
      <p className="font-mono text-sm">CONTENT — prose-readable column width</p>
    </SFContainer>
  ),
};

export const Full: Story = {
  render: () => (
    <SFContainer width="full" className="border-2 border-foreground p-4">
      <p className="font-mono text-sm">FULL — max-w-full, edge-to-edge</p>
    </SFContainer>
  ),
};
