import type { Meta, StoryObj } from "@storybook/react";
import {
  SFTable,
  SFTableHeader,
  SFTableHead,
  SFTableBody,
  SFTableRow,
  SFTableCell,
} from "@/components/sf/sf-table";

const meta: Meta<typeof SFTable> = {
  title: "Core/SFTable",
  component: SFTable,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFTable>;

export const Default: Story = {
  render: () => (
    <SFTable>
      <SFTableHeader>
        <SFTableRow>
          <SFTableHead>MODULE</SFTableHead>
          <SFTableHead>STATUS</SFTableHead>
          <SFTableHead>VERSION</SFTableHead>
        </SFTableRow>
      </SFTableHeader>
      <SFTableBody>
        <SFTableRow>
          <SFTableCell>sf-button</SFTableCell>
          <SFTableCell>ACTIVE</SFTableCell>
          <SFTableCell>1.0.0</SFTableCell>
        </SFTableRow>
        <SFTableRow>
          <SFTableCell>sf-card</SFTableCell>
          <SFTableCell>ACTIVE</SFTableCell>
          <SFTableCell>1.0.0</SFTableCell>
        </SFTableRow>
        <SFTableRow>
          <SFTableCell>sf-accordion</SFTableCell>
          <SFTableCell>SIGNAL</SFTableCell>
          <SFTableCell>1.0.0</SFTableCell>
        </SFTableRow>
      </SFTableBody>
    </SFTable>
  ),
};
