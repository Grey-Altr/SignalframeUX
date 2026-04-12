import type { Meta, StoryObj } from "@storybook/react";
import { ScrambleText } from "@/components/animation/scramble-text";

const meta: Meta<typeof ScrambleText> = {
  title: "Signal/ScrambleText",
  component: ScrambleText,
  tags: ["autodocs"],
  args: {
    text: "SIGNALFRAME//UX",
    trigger: "hover",
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-background">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ScrambleText>;

export const Hover: Story = {
  args: {
    text: "HOVER TO SCRAMBLE",
    className: "font-mono text-xl text-foreground",
  },
};

export const OnLoad: Story = {
  args: {
    text: "LOADING SEQUENCE",
    trigger: "load",
    className: "font-mono text-xl text-foreground",
  },
};
