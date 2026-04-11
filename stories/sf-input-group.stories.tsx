import type { Meta, StoryObj } from "@storybook/react";
import {
  SFInputGroup,
  SFInputGroupAddon,
  SFInputGroupInput,
  SFInputGroupButton,
} from "@/components/sf/sf-input-group";
import { SFButton } from "@/components/sf/sf-button";
import { Search } from "lucide-react";

const meta: Meta<typeof SFInputGroup> = {
  title: "Form/SFInputGroup",
  component: SFInputGroup,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFInputGroup>;

export const Default: Story = {
  render: () => (
    <SFInputGroup className="w-72">
      <SFInputGroupAddon>
        <Search className="size-4" />
      </SFInputGroupAddon>
      <SFInputGroupInput placeholder="SEARCH MODULES..." />
    </SFInputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <SFInputGroup className="w-72">
      <SFInputGroupInput placeholder="ENTER API KEY" />
      <SFInputGroupButton>
        <SFButton size="sm">SUBMIT</SFButton>
      </SFInputGroupButton>
    </SFInputGroup>
  ),
};

export const WithPrefix: Story = {
  render: () => (
    <SFInputGroup className="w-72">
      <SFInputGroupAddon>https://</SFInputGroupAddon>
      <SFInputGroupInput placeholder="signalframe.dev" />
    </SFInputGroup>
  ),
};
