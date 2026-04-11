import type { Meta, StoryObj } from "@storybook/react";
import {
  SFTabs,
  SFTabsList,
  SFTabsTrigger,
  SFTabsContent,
} from "@/components/sf/sf-tabs";

const meta: Meta<typeof SFTabs> = {
  title: "Core/SFTabs",
  component: SFTabs,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFTabs>;

export const Default: Story = {
  render: () => (
    <SFTabs defaultValue="alpha" className="w-80">
      <SFTabsList>
        <SFTabsTrigger value="alpha">ALPHA</SFTabsTrigger>
        <SFTabsTrigger value="beta">BETA</SFTabsTrigger>
        <SFTabsTrigger value="gamma">GAMMA</SFTabsTrigger>
      </SFTabsList>
      <SFTabsContent value="alpha">Alpha module content.</SFTabsContent>
      <SFTabsContent value="beta">Beta module content.</SFTabsContent>
      <SFTabsContent value="gamma">Gamma module content.</SFTabsContent>
    </SFTabs>
  ),
};

export const TwoTabs: Story = {
  render: () => (
    <SFTabs defaultValue="frame" className="w-64">
      <SFTabsList>
        <SFTabsTrigger value="frame">FRAME</SFTabsTrigger>
        <SFTabsTrigger value="signal">SIGNAL</SFTabsTrigger>
      </SFTabsList>
      <SFTabsContent value="frame">Structural layer.</SFTabsContent>
      <SFTabsContent value="signal">Expressive layer.</SFTabsContent>
    </SFTabs>
  ),
};
