import type { Meta, StoryObj } from "@storybook/react";
import {
  SFSelect,
  SFSelectTrigger,
  SFSelectContent,
  SFSelectGroup,
  SFSelectItem,
  SFSelectLabel,
  SFSelectValue,
} from "@/components/sf/sf-select";

const meta: Meta<typeof SFSelect> = {
  title: "Form/SFSelect",
  component: SFSelect,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFSelect>;

export const Default: Story = {
  render: () => (
    <SFSelect>
      <SFSelectTrigger className="w-48">
        <SFSelectValue placeholder="SELECT LAYER" />
      </SFSelectTrigger>
      <SFSelectContent>
        <SFSelectGroup>
          <SFSelectLabel>LAYERS</SFSelectLabel>
          <SFSelectItem value="frame">FRAME</SFSelectItem>
          <SFSelectItem value="signal">SIGNAL</SFSelectItem>
          <SFSelectItem value="both">BOTH</SFSelectItem>
        </SFSelectGroup>
      </SFSelectContent>
    </SFSelect>
  ),
};
