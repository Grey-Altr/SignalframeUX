"use client";

import type { Meta, StoryObj } from "@storybook/react";
import {
  SFNavigationMenu,
  SFNavigationMenuList,
  SFNavigationMenuItem,
  SFNavigationMenuTrigger,
  SFNavigationMenuContent,
  SFNavigationMenuLink,
  SFNavigationMenuMobile,
} from "@/components/sf/sf-navigation-menu";

const meta: Meta<typeof SFNavigationMenu> = {
  title: "Flagship/SFNavigationMenu",
  component: SFNavigationMenu,
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional classes on the root NavigationMenu",
    },
  },
};
export default meta;

type Story = StoryObj<typeof SFNavigationMenu>;

export const Default: Story = {
  render: () => (
    <SFNavigationMenu>
      <SFNavigationMenuList>
        <SFNavigationMenuItem>
          <SFNavigationMenuTrigger>COMPONENTS</SFNavigationMenuTrigger>
          <SFNavigationMenuContent>
            <div className="p-4 w-48 space-y-1">
              <SFNavigationMenuLink href="/components/button">SFBUTTON</SFNavigationMenuLink>
              <SFNavigationMenuLink href="/components/card">SFCARD</SFNavigationMenuLink>
              <SFNavigationMenuLink href="/components/accordion">SFACCORDION</SFNavigationMenuLink>
            </div>
          </SFNavigationMenuContent>
        </SFNavigationMenuItem>
        <SFNavigationMenuItem>
          <SFNavigationMenuTrigger>LAYOUT</SFNavigationMenuTrigger>
          <SFNavigationMenuContent>
            <div className="p-4 w-48 space-y-1">
              <SFNavigationMenuLink href="/layout/container">SFCONTAINER</SFNavigationMenuLink>
              <SFNavigationMenuLink href="/layout/grid">SFGRID</SFNavigationMenuLink>
              <SFNavigationMenuLink href="/layout/stack">SFSTACK</SFNavigationMenuLink>
            </div>
          </SFNavigationMenuContent>
        </SFNavigationMenuItem>
        <SFNavigationMenuItem>
          <SFNavigationMenuLink href="/docs">DOCS</SFNavigationMenuLink>
        </SFNavigationMenuItem>
      </SFNavigationMenuList>
    </SFNavigationMenu>
  ),
};

export const WithMobileVariant: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-xs text-muted-foreground mb-4">DESKTOP (hidden on mobile)</p>
        <SFNavigationMenu className="hidden md:flex">
          <SFNavigationMenuList>
            <SFNavigationMenuItem>
              <SFNavigationMenuTrigger>SYSTEM</SFNavigationMenuTrigger>
              <SFNavigationMenuContent>
                <div className="p-4 w-40 space-y-1">
                  <SFNavigationMenuLink href="/frame">FRAME</SFNavigationMenuLink>
                  <SFNavigationMenuLink href="/signal">SIGNAL</SFNavigationMenuLink>
                </div>
              </SFNavigationMenuContent>
            </SFNavigationMenuItem>
          </SFNavigationMenuList>
        </SFNavigationMenu>
      </div>
      <div>
        <p className="font-mono text-xs text-muted-foreground mb-4">MOBILE SHEET (tap hamburger)</p>
        <SFNavigationMenuMobile>
          <div className="space-y-2 font-mono text-sm">
            <a href="/frame" className="block py-2 border-b border-foreground/20">FRAME</a>
            <a href="/signal" className="block py-2 border-b border-foreground/20">SIGNAL</a>
            <a href="/docs" className="block py-2">DOCS</a>
          </div>
        </SFNavigationMenuMobile>
      </div>
    </div>
  ),
};

export const MultiLevel: Story = {
  render: () => (
    <SFNavigationMenu>
      <SFNavigationMenuList>
        <SFNavigationMenuItem>
          <SFNavigationMenuTrigger>DOCS</SFNavigationMenuTrigger>
          <SFNavigationMenuContent>
            <div className="grid grid-cols-2 gap-2 p-4 w-80">
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-2">FRAME</p>
                <SFNavigationMenuLink href="/docs/frame/container">Container</SFNavigationMenuLink>
                <SFNavigationMenuLink href="/docs/frame/grid">Grid</SFNavigationMenuLink>
                <SFNavigationMenuLink href="/docs/frame/text">Text</SFNavigationMenuLink>
              </div>
              <div>
                <p className="font-mono text-xs text-muted-foreground mb-2">SIGNAL</p>
                <SFNavigationMenuLink href="/docs/signal/accordion">Accordion</SFNavigationMenuLink>
                <SFNavigationMenuLink href="/docs/signal/progress">Progress</SFNavigationMenuLink>
                <SFNavigationMenuLink href="/docs/signal/status">StatusDot</SFNavigationMenuLink>
              </div>
            </div>
          </SFNavigationMenuContent>
        </SFNavigationMenuItem>
        <SFNavigationMenuItem>
          <SFNavigationMenuLink href="/api">API</SFNavigationMenuLink>
        </SFNavigationMenuItem>
      </SFNavigationMenuList>
    </SFNavigationMenu>
  ),
};
