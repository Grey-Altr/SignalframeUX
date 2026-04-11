"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFText } from "@/components/sf/sf-text";

const meta: Meta<typeof SFText> = {
  title: "Layout/SFText",
  component: SFText,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFText>;

export const Heading1: Story = {
  render: () => <SFText variant="heading-1">SIGNALFRAME//UX</SFText>,
};

export const Heading2: Story = {
  render: () => <SFText variant="heading-2">FRAME / SIGNAL DUAL LAYER</SFText>,
};

export const Heading3: Story = {
  render: () => <SFText variant="heading-3">Component Architecture</SFText>,
};

export const Body: Story = {
  render: () => (
    <SFText variant="body">
      The FRAME layer is deterministic and legible. The SIGNAL layer is generative and expressive.
      Both layers must coexist without interference.
    </SFText>
  ),
};

export const Small: Story = {
  render: () => (
    <SFText variant="small" as="span">
      VERSION 0.1.0 — CULTURE DIVISION
    </SFText>
  ),
};
