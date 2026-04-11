"use client";

import type { Meta, StoryObj } from "@storybook/react";
import {
  SFCard,
  SFCardHeader,
  SFCardTitle,
  SFCardDescription,
  SFCardContent,
  SFCardFooter,
} from "@/components/sf/sf-card";
import { SFButton } from "@/components/sf/sf-button";
import { SFBadge } from "@/components/sf/sf-badge";
import { SFStatusDot } from "@/components/sf/sf-status-dot";

const meta: Meta<typeof SFCard> = {
  title: "Flagship/SFCard",
  component: SFCard,
  tags: ["autodocs"],
  argTypes: {
    hoverable: {
      control: "boolean",
      description: "Enable hover border color transition to primary",
    },
    borderDraw: {
      control: "boolean",
      description: "Replace hover with SIGNAL borderDraw animation",
    },
  },
  args: {
    hoverable: false,
    borderDraw: false,
  },
};
export default meta;

type Story = StoryObj<typeof SFCard>;

export const Default: Story = {
  render: (args) => (
    <SFCard {...args} className="w-80">
      <SFCardHeader>
        <SFCardTitle>SYSTEM STATUS</SFCardTitle>
        <SFCardDescription>All modules nominal</SFCardDescription>
      </SFCardHeader>
      <SFCardContent>
        <div className="flex items-center gap-2">
          <SFStatusDot status="active" />
          <span className="font-mono text-xs">SIGNAL LAYER ACTIVE</span>
        </div>
      </SFCardContent>
    </SFCard>
  ),
};

export const WithFooterActions: Story = {
  render: () => (
    <SFCard className="w-80">
      <SFCardHeader>
        <div className="flex items-center justify-between">
          <SFCardTitle>PROJECT ALPHA</SFCardTitle>
          <SFBadge variant="secondary">ACTIVE</SFBadge>
        </div>
        <SFCardDescription>Culture Division internal tool</SFCardDescription>
      </SFCardHeader>
      <SFCardContent>
        <p className="text-sm text-muted-foreground">
          Core module integration complete. SIGNAL layer initialized.
        </p>
      </SFCardContent>
      <SFCardFooter className="gap-2">
        <SFButton size="sm" intent="ghost">VIEW</SFButton>
        <SFButton size="sm">DEPLOY</SFButton>
      </SFCardFooter>
    </SFCard>
  ),
};

export const CompactCard: Story = {
  render: () => (
    <SFCard className="w-64">
      <SFCardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase">MODULES</span>
          <span className="font-mono text-2xl">47</span>
        </div>
      </SFCardContent>
    </SFCard>
  ),
};

export const Hoverable: Story = {
  args: { hoverable: true },
  render: (args) => (
    <SFCard {...args} className="w-80">
      <SFCardHeader>
        <SFCardTitle>HOVER STATE</SFCardTitle>
        <SFCardDescription>Border transitions to primary on hover</SFCardDescription>
      </SFCardHeader>
      <SFCardContent>Hover this card to see the FRAME layer transition.</SFCardContent>
    </SFCard>
  ),
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {[
        { title: "COMPONENTS", count: "47", status: "active" as const },
        { title: "ANIMATIONS", count: "12", status: "idle" as const },
        { title: "WEBGL", count: "3", status: "active" as const },
        { title: "HOOKS", count: "8", status: "offline" as const },
      ].map(({ title, count, status }) => (
        <SFCard key={title}>
          <SFCardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs">{title}</span>
              <SFStatusDot status={status} />
            </div>
            <span className="font-mono text-xl">{count}</span>
          </SFCardContent>
        </SFCard>
      ))}
    </div>
  ),
};
