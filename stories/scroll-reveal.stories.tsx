import type { Meta, StoryObj } from "@storybook/react";
import { ScrollReveal } from "@/components/animation/scroll-reveal";

const meta: Meta<typeof ScrollReveal> = {
  title: "Signal/ScrollReveal",
  component: ScrollReveal,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="p-8 bg-background min-h-[600px]">
        <div className="h-[200px]" />
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ScrollReveal>;

export const Default: Story = {
  render: () => (
    <ScrollReveal>
      <div className="p-4 border border-foreground/20 font-mono text-sm text-foreground">ITEM ONE</div>
      <div className="p-4 border border-foreground/20 font-mono text-sm text-foreground">ITEM TWO</div>
      <div className="p-4 border border-foreground/20 font-mono text-sm text-foreground">ITEM THREE</div>
    </ScrollReveal>
  ),
};

export const WithStagger: Story = {
  render: () => (
    <ScrollReveal stagger={0.15} y={50}>
      <div className="p-4 border border-foreground/20 font-mono text-sm text-foreground">STAGGERED A</div>
      <div className="p-4 border border-foreground/20 font-mono text-sm text-foreground">STAGGERED B</div>
      <div className="p-4 border border-foreground/20 font-mono text-sm text-foreground">STAGGERED C</div>
    </ScrollReveal>
  ),
};
