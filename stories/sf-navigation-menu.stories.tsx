import type { Meta, StoryObj } from "@storybook/react";
import {
  SFNavigationMenu,
  SFNavigationMenuList,
  SFNavigationMenuItem,
  SFNavigationMenuTrigger,
  SFNavigationMenuContent,
  SFNavigationMenuLink,
} from "@/components/sf/sf-navigation-menu";

const meta: Meta<typeof SFNavigationMenu> = {
  title: "Navigation/SFNavigationMenu",
  component: SFNavigationMenu,
  tags: ["autodocs"],
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
            <div className="p-4 space-y-2 w-48">
              <SFNavigationMenuLink href="/components/button">SFBUTTON</SFNavigationMenuLink>
              <SFNavigationMenuLink href="/components/card">SFCARD</SFNavigationMenuLink>
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
