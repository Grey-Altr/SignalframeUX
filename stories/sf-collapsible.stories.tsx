import type { Meta, StoryObj } from "@storybook/react";
import {
  SFCollapsible,
  SFCollapsibleTrigger,
  SFCollapsibleContent,
} from "@/components/sf/sf-collapsible";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFCollapsible> = {
  title: "Core/SFCollapsible",
  component: SFCollapsible,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFCollapsible>;

export const Default: Story = {
  render: () => (
    <SFCollapsible className="w-64">
      <SFCollapsibleTrigger asChild>
        <SFButton size="sm" intent="ghost" className="w-full justify-between">
          EXPAND MODULE
        </SFButton>
      </SFCollapsibleTrigger>
      <SFCollapsibleContent>
        <div className="border-2 border-foreground p-4 font-mono text-sm space-y-1">
          <p>STATUS: ACTIVE</p>
          <p>VERSION: 1.0.0</p>
          <p>LAYER: FRAME</p>
        </div>
      </SFCollapsibleContent>
    </SFCollapsible>
  ),
};
