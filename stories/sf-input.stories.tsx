import type { Meta, StoryObj } from "@storybook/react";
import { SFInput } from "@/components/sf/sf-input";

const meta: Meta<typeof SFInput> = {
  title: "Form/SFInput",
  component: SFInput,
  tags: ["autodocs"],
  args: {
    placeholder: "ENTER VALUE",
  },
};
export default meta;

type Story = StoryObj<typeof SFInput>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: "SIGNAL-FRAME-UX" },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "DISABLED" },
};
