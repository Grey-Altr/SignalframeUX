import type { Meta, StoryObj } from "@storybook/react";
import { SFToggleGroup, SFToggleGroupItem } from "@/components/sf/sf-toggle-group";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const meta: Meta<typeof SFToggleGroup> = {
  title: "Form/SFToggleGroup",
  component: SFToggleGroup,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFToggleGroup>;

export const Default: Story = {
  render: () => (
    <SFToggleGroup type="single" defaultValue="left">
      <SFToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="size-4" />
      </SFToggleGroupItem>
      <SFToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="size-4" />
      </SFToggleGroupItem>
      <SFToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="size-4" />
      </SFToggleGroupItem>
    </SFToggleGroup>
  ),
};

export const Multi: Story = {
  render: () => (
    <SFToggleGroup type="multiple">
      <SFToggleGroupItem value="frame">FRAME</SFToggleGroupItem>
      <SFToggleGroupItem value="signal">SIGNAL</SFToggleGroupItem>
      <SFToggleGroupItem value="webgl">WEBGL</SFToggleGroupItem>
    </SFToggleGroup>
  ),
};
