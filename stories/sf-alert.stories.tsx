import type { Meta, StoryObj } from "@storybook/react";
import { SFAlert, SFAlertTitle, SFAlertDescription } from "@/components/sf/sf-alert";
import { Terminal, AlertCircle } from "lucide-react";

const meta: Meta<typeof SFAlert> = {
  title: "Feedback/SFAlert",
  component: SFAlert,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFAlert>;

export const Default: Story = {
  render: () => (
    <SFAlert className="w-80">
      <Terminal className="size-4" />
      <SFAlertTitle>SYSTEM NOTICE</SFAlertTitle>
      <SFAlertDescription>Signal layer initialized successfully.</SFAlertDescription>
    </SFAlert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <SFAlert variant="destructive" className="w-80">
      <AlertCircle className="size-4" />
      <SFAlertTitle>CRITICAL ERROR</SFAlertTitle>
      <SFAlertDescription>Signal frame integrity compromised.</SFAlertDescription>
    </SFAlert>
  ),
};
