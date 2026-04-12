import type { Meta, StoryObj } from "@storybook/react";
import { SplitHeadline } from "@/components/animation/split-headline";

const meta: Meta<typeof SplitHeadline> = {
  title: "Signal/SplitHeadline",
  component: SplitHeadline,
  tags: ["autodocs"],
  args: {
    text: "SIGNALFRAME",
    as: "h1",
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

type Story = StoryObj<typeof SplitHeadline>;

export const Default: Story = {
  args: {
    className: "sf-display text-6xl text-foreground",
  },
};

export const WithDelay: Story = {
  args: {
    text: "DELAYED ENTRY",
    delay: 0.5,
    className: "sf-display text-4xl text-foreground",
  },
};

export const Heading2: Story = {
  args: {
    text: "SUBSECTION",
    as: "h2",
    className: "font-bold text-3xl text-foreground",
  },
};
