"use client";

import type { Meta, StoryObj } from "@storybook/react";
import {
  SFAccordion,
  SFAccordionItem,
  SFAccordionTrigger,
  SFAccordionContent,
} from "@/components/sf/sf-accordion";

const meta: Meta<typeof SFAccordion> = {
  title: "SIGNAL/SFAccordion",
  component: SFAccordion,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "radio" },
      options: ["single", "multiple"],
      description: "Whether one or multiple items can be open simultaneously",
    },
  },
};
export default meta;

type Story = StoryObj<typeof SFAccordion>;

export const Single: Story = {
  args: { type: "single", collapsible: true },
  render: (args) => (
    <SFAccordion {...args} className="w-96">
      <SFAccordionItem value="frame">
        <SFAccordionTrigger>FRAME LAYER</SFAccordionTrigger>
        <SFAccordionContent>
          <p>Deterministic, legible, semantic, consistent. The structural layer.</p>
          <p>Sharp edges, precise spacing, typographic hierarchy.</p>
        </SFAccordionContent>
      </SFAccordionItem>
      <SFAccordionItem value="signal">
        <SFAccordionTrigger>SIGNAL LAYER</SFAccordionTrigger>
        <SFAccordionContent>
          <p>Generative, parametric, animated, data-driven. The expressive layer.</p>
          <p>GSAP-driven stagger, intensity thresholds, WebGL overlays.</p>
        </SFAccordionContent>
      </SFAccordionItem>
      <SFAccordionItem value="webgl">
        <SFAccordionTrigger>WEBGL LAYER</SFAccordionTrigger>
        <SFAccordionContent>
          <p>Three.js renderer, SignalCanvas, use-signal-scene hook.</p>
          <p>Isolated from FRAME — never interferes with usability.</p>
        </SFAccordionContent>
      </SFAccordionItem>
    </SFAccordion>
  ),
};

export const Multiple: Story = {
  args: { type: "multiple" },
  render: (args) => (
    <SFAccordion {...args} className="w-96">
      <SFAccordionItem value="a">
        <SFAccordionTrigger>MODULE ALPHA</SFAccordionTrigger>
        <SFAccordionContent>
          <p>Core system module — FRAME primitive.</p>
        </SFAccordionContent>
      </SFAccordionItem>
      <SFAccordionItem value="b">
        <SFAccordionTrigger>MODULE BETA</SFAccordionTrigger>
        <SFAccordionContent>
          <p>Animation extension — SIGNAL layer dependency.</p>
        </SFAccordionContent>
      </SFAccordionItem>
      <SFAccordionItem value="c">
        <SFAccordionTrigger>MODULE GAMMA</SFAccordionTrigger>
        <SFAccordionContent>
          <p>WebGL renderer — Three.js peer dependency.</p>
        </SFAccordionContent>
      </SFAccordionItem>
    </SFAccordion>
  ),
};

export const Composed: Story = {
  render: () => (
    <SFAccordion type="single" collapsible className="w-96">
      <SFAccordionItem value="install">
        <SFAccordionTrigger>01 — INSTALLATION</SFAccordionTrigger>
        <SFAccordionContent>
          <p className="font-mono text-xs">pnpm add signalframeux</p>
          <p className="mt-2">Import from the correct entry point for your use case.</p>
        </SFAccordionContent>
      </SFAccordionItem>
      <SFAccordionItem value="config">
        <SFAccordionTrigger>02 — CONFIGURATION</SFAccordionTrigger>
        <SFAccordionContent>
          <p>Import signalframeux.css in your root layout.</p>
          <p className="font-mono text-xs mt-1">import &apos;signalframeux/signalframeux.css&apos;</p>
        </SFAccordionContent>
      </SFAccordionItem>
      <SFAccordionItem value="usage">
        <SFAccordionTrigger>03 — USAGE</SFAccordionTrigger>
        <SFAccordionContent>
          <p>Components follow SF prefix PascalCase convention.</p>
          <p className="font-mono text-xs mt-1">import &#123; SFButton &#125; from &apos;signalframeux&apos;</p>
        </SFAccordionContent>
      </SFAccordionItem>
    </SFAccordion>
  ),
};
