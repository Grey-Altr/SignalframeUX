"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFStack } from "@/components/sf/sf-stack";

const meta: Meta<typeof SFStack> = {
  title: "Layout/SFStack",
  component: SFStack,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFStack>;

const Box = ({ label }: { label: string }) => (
  <div className="border-2 border-foreground p-4 font-mono text-xs">{label}</div>
);

export const Vertical: Story = {
  render: () => (
    <SFStack direction="vertical" gap="4" className="w-48">
      <Box label="ITEM A" />
      <Box label="ITEM B" />
      <Box label="ITEM C" />
    </SFStack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <SFStack direction="horizontal" gap="4" align="center">
      <Box label="LEFT" />
      <Box label="CENTER" />
      <Box label="RIGHT" />
    </SFStack>
  ),
};

export const LargeGap: Story = {
  render: () => (
    <SFStack direction="vertical" gap="12" className="w-48">
      <Box label="SECTION A" />
      <Box label="SECTION B" />
    </SFStack>
  ),
};
