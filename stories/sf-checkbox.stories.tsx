import type { Meta, StoryObj } from "@storybook/react";
import { SFCheckbox } from "@/components/sf/sf-checkbox";
import { SFLabel } from "@/components/sf/sf-label";

const meta: Meta<typeof SFCheckbox> = {
  title: "Form/SFCheckbox",
  component: SFCheckbox,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFCheckbox>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <SFCheckbox id="check1" />
      <SFLabel htmlFor="check1">ENABLE SIGNAL LAYER</SFLabel>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <SFCheckbox id="check2" defaultChecked />
      <SFLabel htmlFor="check2">FRAME LAYER ACTIVE</SFLabel>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <SFCheckbox id="check3" disabled />
      <SFLabel htmlFor="check3">LOCKED MODULE</SFLabel>
    </div>
  ),
};
