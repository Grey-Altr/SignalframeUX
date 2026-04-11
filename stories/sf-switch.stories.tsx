import type { Meta, StoryObj } from "@storybook/react";
import { SFSwitch } from "@/components/sf/sf-switch";
import { SFLabel } from "@/components/sf/sf-label";

const meta: Meta<typeof SFSwitch> = {
  title: "Form/SFSwitch",
  component: SFSwitch,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFSwitch>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <SFSwitch id="sw1" />
      <SFLabel htmlFor="sw1">SIGNAL LAYER</SFLabel>
    </div>
  ),
};

export const Enabled: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <SFSwitch id="sw2" defaultChecked />
      <SFLabel htmlFor="sw2">ACTIVE</SFLabel>
    </div>
  ),
};
