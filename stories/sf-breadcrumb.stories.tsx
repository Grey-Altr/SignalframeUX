import type { Meta, StoryObj } from "@storybook/react";
import {
  SFBreadcrumb,
  SFBreadcrumbList,
  SFBreadcrumbItem,
  SFBreadcrumbLink,
  SFBreadcrumbPage,
  SFBreadcrumbSeparator,
} from "@/components/sf/sf-breadcrumb";

const meta: Meta<typeof SFBreadcrumb> = {
  title: "Navigation/SFBreadcrumb",
  component: SFBreadcrumb,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFBreadcrumb>;

export const Default: Story = {
  render: () => (
    <SFBreadcrumb>
      <SFBreadcrumbList>
        <SFBreadcrumbItem>
          <SFBreadcrumbLink href="/">HOME</SFBreadcrumbLink>
        </SFBreadcrumbItem>
        <SFBreadcrumbSeparator />
        <SFBreadcrumbItem>
          <SFBreadcrumbLink href="/components">COMPONENTS</SFBreadcrumbLink>
        </SFBreadcrumbItem>
        <SFBreadcrumbSeparator />
        <SFBreadcrumbItem>
          <SFBreadcrumbPage>SFBUTTON</SFBreadcrumbPage>
        </SFBreadcrumbItem>
      </SFBreadcrumbList>
    </SFBreadcrumb>
  ),
};

export const Short: Story = {
  render: () => (
    <SFBreadcrumb>
      <SFBreadcrumbList>
        <SFBreadcrumbItem>
          <SFBreadcrumbLink href="/">HOME</SFBreadcrumbLink>
        </SFBreadcrumbItem>
        <SFBreadcrumbSeparator />
        <SFBreadcrumbItem>
          <SFBreadcrumbPage>DOCS</SFBreadcrumbPage>
        </SFBreadcrumbItem>
      </SFBreadcrumbList>
    </SFBreadcrumb>
  ),
};
