"use client";

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
  title: "Flagship/SFDropdownMenu",
  component: SFDropdownMenu,
  tags: ["autodocs"],
  argTypes: {
    modal: {
      control: "boolean",
      description: "Trap focus inside dropdown when open",
    },
    open: {
      control: "boolean",
      description: "Controlled open state",
    },
  },
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
          <SFDropdownMenuItem>Edit Module</SFDropdownMenuItem>
          <SFDropdownMenuItem>Duplicate</SFDropdownMenuItem>
          <SFDropdownMenuItem>Export</SFDropdownMenuItem>
          <SFDropdownMenuSeparator />
          <SFDropdownMenuItem>Delete</SFDropdownMenuItem>
        </SFDropdownMenuGroup>
      </SFDropdownMenuContent>
    </SFDropdownMenu>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <SFDropdownMenu>
      <SFDropdownMenuTrigger asChild>
        <SFButton size="sm">ACTIONS</SFButton>
      </SFDropdownMenuTrigger>
      <SFDropdownMenuContent className="w-48">
        <SFDropdownMenuLabel>MODULE</SFDropdownMenuLabel>
        <SFDropdownMenuSeparator />
        <SFDropdownMenuItem>
          New Module
          <SFDropdownMenuShortcut>⌘N</SFDropdownMenuShortcut>
        </SFDropdownMenuItem>
        <SFDropdownMenuItem>
          Save
          <SFDropdownMenuShortcut>⌘S</SFDropdownMenuShortcut>
        </SFDropdownMenuItem>
        <SFDropdownMenuItem>
          Deploy
          <SFDropdownMenuShortcut>⌘D</SFDropdownMenuShortcut>
        </SFDropdownMenuItem>
        <SFDropdownMenuSeparator />
        <SFDropdownMenuItem>
          Delete
          <SFDropdownMenuShortcut>⌘⌫</SFDropdownMenuShortcut>
        </SFDropdownMenuItem>
      </SFDropdownMenuContent>
    </SFDropdownMenu>
  ),
};

export const NestedGroups: Story = {
  render: () => (
    <SFDropdownMenu>
      <SFDropdownMenuTrigger asChild>
        <SFButton size="sm" intent="ghost">SYSTEM</SFButton>
      </SFDropdownMenuTrigger>
      <SFDropdownMenuContent className="w-48">
        <SFDropdownMenuGroup>
          <SFDropdownMenuLabel>FRAME LAYER</SFDropdownMenuLabel>
          <SFDropdownMenuItem>Components</SFDropdownMenuItem>
          <SFDropdownMenuItem>Layout</SFDropdownMenuItem>
          <SFDropdownMenuItem>Typography</SFDropdownMenuItem>
        </SFDropdownMenuGroup>
        <SFDropdownMenuSeparator />
        <SFDropdownMenuGroup>
          <SFDropdownMenuLabel>SIGNAL LAYER</SFDropdownMenuLabel>
          <SFDropdownMenuItem>Animation</SFDropdownMenuItem>
          <SFDropdownMenuItem>Progress</SFDropdownMenuItem>
          <SFDropdownMenuItem>WebGL</SFDropdownMenuItem>
        </SFDropdownMenuGroup>
      </SFDropdownMenuContent>
    </SFDropdownMenu>
  ),
};
