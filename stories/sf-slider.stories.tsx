import type { Meta, StoryObj } from "@storybook/react";
import { SFSlider } from "@/components/sf/sf-slider";

const meta: Meta<typeof SFSlider> = {
  title: "Form/SFSlider",
  component: SFSlider,
  tags: ["autodocs"],
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
    className: "w-64",
  },
};
export default meta;

type Story = StoryObj<typeof SFSlider>;

export const Default: Story = {};

export const Range: Story = {
  args: { defaultValue: [20, 80] },
};

export const Stepped: Story = {
  args: { defaultValue: [50], step: 10 },
};
