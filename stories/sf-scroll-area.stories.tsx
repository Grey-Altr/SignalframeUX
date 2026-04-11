import type { Meta, StoryObj } from "@storybook/react";
import { SFScrollArea } from "@/components/sf/sf-scroll-area";

const meta: Meta<typeof SFScrollArea> = {
  title: "Core/SFScrollArea",
  component: SFScrollArea,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFScrollArea>;

export const Default: Story = {
  render: () => (
    <SFScrollArea className="h-48 w-64 border-2 border-foreground p-4">
      <div className="space-y-2 font-mono text-sm">
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i}>MODULE-{String(i + 1).padStart(3, "0")}</p>
        ))}
      </div>
    </SFScrollArea>
  ),
};
