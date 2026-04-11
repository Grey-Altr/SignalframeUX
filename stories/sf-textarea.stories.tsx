import type { Meta, StoryObj } from "@storybook/react";
import { SFTextarea } from "@/components/sf/sf-textarea";

const meta: Meta<typeof SFTextarea> = {
  title: "Form/SFTextarea",
  component: SFTextarea,
  tags: ["autodocs"],
  args: {
    placeholder: "ENTER SIGNAL DATA...",
    rows: 4,
    className: "w-72",
  },
};
export default meta;

type Story = StoryObj<typeof SFTextarea>;

export const Default: Story = {};

export const WithContent: Story = {
  args: { defaultValue: "FRAME LAYER — structural, legible, consistent.\nSIGNAL LAYER — generative, animated, expressive." },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: "READ ONLY" },
};
