import type { Meta, StoryObj } from "@storybook/react";
import { SFSeparator } from "@/components/sf/sf-separator";

const meta: Meta<typeof SFSeparator> = {
  title: "Core/SFSeparator",
  component: SFSeparator,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFSeparator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <p className="text-sm font-mono">SECTION A</p>
      <SFSeparator />
      <p className="text-sm font-mono">SECTION B</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <span className="text-sm font-mono">LEFT</span>
      <SFSeparator orientation="vertical" />
      <span className="text-sm font-mono">RIGHT</span>
    </div>
  ),
};
