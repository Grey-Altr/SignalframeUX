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

const meta: Meta<typeof SFCard> = {
  title: "Core/SFCard",
  component: SFCard,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFCard>;

export const Default: Story = {
  render: () => (
    <SFCard className="w-80">
      <SFCardHeader>
        <SFCardTitle>System Status</SFCardTitle>
        <SFCardDescription>All systems nominal</SFCardDescription>
      </SFCardHeader>
      <SFCardContent>Monitor active. Signal strength 94%.</SFCardContent>
    </SFCard>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <SFCard className="w-80">
      <SFCardHeader>
        <SFCardTitle>Project Alpha</SFCardTitle>
        <SFCardDescription>Updated 2 days ago</SFCardDescription>
      </SFCardHeader>
      <SFCardContent>Core module integration complete.</SFCardContent>
      <SFCardFooter>
        <SFButton size="sm" intent="ghost">VIEW DETAILS</SFButton>
      </SFCardFooter>
    </SFCard>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <SFCard hoverable className="w-80">
      <SFCardHeader>
        <SFCardTitle>Hover Me</SFCardTitle>
      </SFCardHeader>
      <SFCardContent>Border transitions to primary on hover.</SFCardContent>
    </SFCard>
  ),
};
