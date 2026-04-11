"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFContainer } from "@/components/sf/sf-container";
import { SFText } from "@/components/sf/sf-text";

const meta: Meta<typeof SFContainer> = {
  title: "Flagship/SFContainer",
  component: SFContainer,
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: { type: "select" },
      options: ["wide", "content", "full"],
      description: "Max-width token — wide | content | full",
    },
    className: {
      control: "text",
    },
  },
  args: {
    width: "wide",
  },
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj<typeof SFContainer>;

export const Default: Story = {
  render: (args) => (
    <div className="bg-background py-8">
      <SFContainer {...args} className="border-2 border-primary p-6">
        <SFText variant="heading-3">WIDE CONTAINER</SFText>
        <SFText variant="body">
          Default width — max-w-wide with responsive gutters. Used for most page sections.
        </SFText>
      </SFContainer>
    </div>
  ),
};

export const Wide: Story = {
  args: { width: "wide" },
  render: (args) => (
    <div className="bg-background py-8">
      <SFContainer {...args} className="border-2 border-foreground p-6">
        <div className="font-mono text-xs text-muted-foreground">width=&quot;wide&quot;</div>
        <SFText variant="heading-3">WIDE — max-w-wide</SFText>
        <SFText variant="body">Standard section container with responsive side gutters.</SFText>
      </SFContainer>
    </div>
  ),
};

export const Content: Story = {
  args: { width: "content" },
  render: (args) => (
    <div className="bg-background py-8">
      <SFContainer {...args} className="border-2 border-foreground p-6">
        <div className="font-mono text-xs text-muted-foreground">width=&quot;content&quot;</div>
        <SFText variant="heading-3">CONTENT — max-w-content</SFText>
        <SFText variant="body">
          Prose-readable column. Use for long-form text, documentation, and article content.
          Constrained for optimal reading line length.
        </SFText>
      </SFContainer>
    </div>
  ),
};

export const FullBleed: Story = {
  args: { width: "full" },
  render: (args) => (
    <div className="bg-background py-8">
      <SFContainer {...args} className="border-2 border-foreground p-6">
        <div className="font-mono text-xs text-muted-foreground">width=&quot;full&quot;</div>
        <SFText variant="heading-3">FULL BLEED — max-w-full</SFText>
        <SFText variant="body">Edge-to-edge with gutters. For hero sections and full-width visuals.</SFText>
      </SFContainer>
    </div>
  ),
};
