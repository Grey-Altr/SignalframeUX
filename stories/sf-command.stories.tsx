import type { Meta, StoryObj } from "@storybook/react";
import {
  SFCommand,
  SFCommandInput,
  SFCommandList,
  SFCommandEmpty,
  SFCommandGroup,
  SFCommandItem,
  SFCommandSeparator,
} from "@/components/sf/sf-command";

const meta: Meta<typeof SFCommand> = {
  title: "Overlay/SFCommand",
  component: SFCommand,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFCommand>;

export const Default: Story = {
  render: () => (
    <SFCommand className="w-80 border-2 border-foreground">
      <SFCommandInput placeholder="SEARCH MODULES..." />
      <SFCommandList>
        <SFCommandEmpty>NO RESULTS FOUND</SFCommandEmpty>
        <SFCommandGroup heading="COMPONENTS">
          <SFCommandItem>SFButton</SFCommandItem>
          <SFCommandItem>SFCard</SFCommandItem>
          <SFCommandItem>SFAccordion</SFCommandItem>
        </SFCommandGroup>
        <SFCommandSeparator />
        <SFCommandGroup heading="LAYOUT">
          <SFCommandItem>SFContainer</SFCommandItem>
          <SFCommandItem>SFGrid</SFCommandItem>
        </SFCommandGroup>
      </SFCommandList>
    </SFCommand>
  ),
};
