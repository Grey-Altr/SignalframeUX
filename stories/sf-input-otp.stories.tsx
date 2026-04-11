import type { Meta, StoryObj } from "@storybook/react";
import {
  SFInputOTP,
  SFInputOTPGroup,
  SFInputOTPSlot,
  SFInputOTPSeparator,
} from "@/components/sf/sf-input-otp";

const meta: Meta<typeof SFInputOTP> = {
  title: "Form/SFInputOTP",
  component: SFInputOTP,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFInputOTP>;

export const Default: Story = {
  render: () => (
    <SFInputOTP maxLength={6}>
      <SFInputOTPGroup>
        <SFInputOTPSlot index={0} />
        <SFInputOTPSlot index={1} />
        <SFInputOTPSlot index={2} />
      </SFInputOTPGroup>
      <SFInputOTPSeparator />
      <SFInputOTPGroup>
        <SFInputOTPSlot index={3} />
        <SFInputOTPSlot index={4} />
        <SFInputOTPSlot index={5} />
      </SFInputOTPGroup>
    </SFInputOTP>
  ),
};
