import type { Meta, StoryObj } from "@storybook/react";
import {
  SFAvatar,
  SFAvatarImage,
  SFAvatarFallback,
} from "@/components/sf/sf-avatar";

const meta: Meta<typeof SFAvatar> = {
  title: "Core/SFAvatar",
  component: SFAvatar,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SFAvatar>;

export const WithFallback: Story = {
  render: () => (
    <SFAvatar>
      <SFAvatarImage src="" alt="User" />
      <SFAvatarFallback>CD</SFAvatarFallback>
    </SFAvatar>
  ),
};

export const WithImage: Story = {
  render: () => (
    <SFAvatar>
      <SFAvatarImage
        src="https://github.com/shadcn.png"
        alt="@shadcn"
      />
      <SFAvatarFallback>SC</SFAvatarFallback>
    </SFAvatar>
  ),
};

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      {["CD", "UX", "SF", "DU"].map((label) => (
        <SFAvatar key={label}>
          <SFAvatarFallback>{label}</SFAvatarFallback>
        </SFAvatar>
      ))}
    </div>
  ),
};
