import type { Meta, StoryObj } from "@storybook/react";
import {
  SFPagination,
  SFPaginationContent,
  SFPaginationItem,
  SFPaginationLink,
  SFPaginationPrevious,
  SFPaginationNext,
} from "@/components/sf/sf-pagination";

const meta: Meta<typeof SFPagination> = {
  title: "Navigation/SFPagination",
  component: SFPagination,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFPagination>;

export const Default: Story = {
  render: () => (
    <SFPagination>
      <SFPaginationContent>
        <SFPaginationItem>
          <SFPaginationPrevious href="#" />
        </SFPaginationItem>
        {[1, 2, 3, 4, 5].map((page) => (
          <SFPaginationItem key={page}>
            <SFPaginationLink href="#" isActive={page === 1}>
              {page}
            </SFPaginationLink>
          </SFPaginationItem>
        ))}
        <SFPaginationItem>
          <SFPaginationNext href="#" />
        </SFPaginationItem>
      </SFPaginationContent>
    </SFPagination>
  ),
};
