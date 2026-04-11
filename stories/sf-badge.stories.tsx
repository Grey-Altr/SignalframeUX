import type { Meta, StoryObj } from "@storybook/react";
import { SFBadge } from "@/components/sf/sf-badge";

const meta: Meta<typeof SFBadge> = {
  title: "Core/SFBadge",
  component: SFBadge,
  tags: ["autodocs"],
  args: {
    children: "LABEL",
  },
};
export default meta;

type Story = StoryObj<typeof SFBadge>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", children: "SECONDARY" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "ERROR" },
};
