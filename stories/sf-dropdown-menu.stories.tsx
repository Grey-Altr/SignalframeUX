import type { Meta, StoryObj } from "@storybook/react";
import {
  SFDropdownMenu,
  SFDropdownMenuTrigger,
  SFDropdownMenuContent,
  SFDropdownMenuGroup,
  SFDropdownMenuItem,
  SFDropdownMenuLabel,
  SFDropdownMenuSeparator,
  SFDropdownMenuShortcut,
} from "@/components/sf/sf-dropdown-menu";
import { SFButton } from "@/components/sf/sf-button";

const meta: Meta<typeof SFDropdownMenu> = {
  title: "Overlay/SFDropdownMenu",
  component: SFDropdownMenu,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFDropdownMenu>;

export const Default: Story = {
  render: () => (
    <SFDropdownMenu>
      <SFDropdownMenuTrigger asChild>
        <SFButton size="sm" intent="ghost">OPTIONS</SFButton>
      </SFDropdownMenuTrigger>
      <SFDropdownMenuContent>
        <SFDropdownMenuLabel>ACTIONS</SFDropdownMenuLabel>
        <SFDropdownMenuSeparator />
        <SFDropdownMenuGroup>
          <SFDropdownMenuItem>Edit</SFDropdownMenuItem>
          <SFDropdownMenuItem>Duplicate</SFDropdownMenuItem>
          <SFDropdownMenuSeparator />
          <SFDropdownMenuItem>
            Delete
            <SFDropdownMenuShortcut>⌘⌫</SFDropdownMenuShortcut>
          </SFDropdownMenuItem>
        </SFDropdownMenuGroup>
      </SFDropdownMenuContent>
    </SFDropdownMenu>
  ),
};
