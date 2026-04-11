import type { Meta, StoryObj } from "@storybook/react";
import { SFSkeleton } from "@/components/sf/sf-skeleton";

const meta: Meta<typeof SFSkeleton> = {
  title: "Feedback/SFSkeleton",
  component: SFSkeleton,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFSkeleton>;

export const Default: Story = {
  render: () => <SFSkeleton className="h-4 w-48" />,
};

export const Card: Story = {
  render: () => (
    <div className="w-64 space-y-3">
      <SFSkeleton className="h-32 w-full" />
      <SFSkeleton className="h-4 w-3/4" />
      <SFSkeleton className="h-4 w-1/2" />
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div className="w-64 space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <SFSkeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  ),
};
