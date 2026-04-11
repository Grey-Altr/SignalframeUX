import type { Meta, StoryObj } from "@storybook/react";
import { SFRadioGroup, SFRadioGroupItem } from "@/components/sf/sf-radio-group";
import { SFLabel } from "@/components/sf/sf-label";

const meta: Meta<typeof SFRadioGroup> = {
  title: "Form/SFRadioGroup",
  component: SFRadioGroup,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFRadioGroup>;

export const Default: Story = {
  render: () => (
    <SFRadioGroup defaultValue="frame">
      <div className="flex items-center gap-2">
        <SFRadioGroupItem value="frame" id="r1" />
        <SFLabel htmlFor="r1">FRAME</SFLabel>
      </div>
      <div className="flex items-center gap-2">
        <SFRadioGroupItem value="signal" id="r2" />
        <SFLabel htmlFor="r2">SIGNAL</SFLabel>
      </div>
      <div className="flex items-center gap-2">
        <SFRadioGroupItem value="both" id="r3" />
        <SFLabel htmlFor="r3">BOTH LAYERS</SFLabel>
      </div>
    </SFRadioGroup>
  ),
};
