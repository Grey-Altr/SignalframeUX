import type { Meta, StoryObj } from "@storybook/react";
import { SFToggle } from "@/components/sf/sf-toggle";
import { Bold } from "lucide-react";

const meta: Meta<typeof SFToggle> = {
  title: "Form/SFToggle",
  component: SFToggle,
  tags: ["autodocs"],
  args: { "aria-label": "Toggle" },
};
export default meta;

type Story = StoryObj<typeof SFToggle>;

export const Default: Story = {
  render: () => (
    <SFToggle aria-label="Bold">
      <Bold className="size-4" />
    </SFToggle>
  ),
};

export const Pressed: Story = {
  render: () => (
    <SFToggle aria-label="Bold" defaultPressed>
      <Bold className="size-4" />
    </SFToggle>
  ),
};
