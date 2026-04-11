import type { Meta, StoryObj } from "@storybook/react";
import { SFLabel } from "@/components/sf/sf-label";
import { SFInput } from "@/components/sf/sf-input";

const meta: Meta<typeof SFLabel> = {
  title: "Form/SFLabel",
  component: SFLabel,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFLabel>;

export const Default: Story = {
  render: () => <SFLabel>FIELD LABEL</SFLabel>,
};

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-48">
      <SFLabel htmlFor="field">API KEY</SFLabel>
      <SFInput id="field" placeholder="sk-..." />
    </div>
  ),
};
