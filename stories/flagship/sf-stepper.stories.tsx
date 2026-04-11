"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { SFStepper, SFStep } from "@/components/sf/sf-stepper";

const meta: Meta<typeof SFStepper> = {
  title: "SIGNAL/SFStepper",
  component: SFStepper,
  tags: ["autodocs"],
  argTypes: {
    activeStep: {
      control: { type: "number", min: 0, max: 4 },
      description: "Zero-based index of the current active step",
    },
  },
  args: {
    activeStep: 1,
  },
};
export default meta;

type Story = StoryObj<typeof SFStepper>;

export const Linear: Story = {
  render: (args) => (
    <SFStepper {...args} className="w-72">
      <SFStep status="complete" label="ACCOUNT" description="Create your account" />
      <SFStep status="active" label="PROFILE" description="Set up your profile" />
      <SFStep status="pending" label="REVIEW" description="Review and submit" />
    </SFStepper>
  ),
};

export const WithError: Story = {
  args: { activeStep: 1 },
  render: (args) => (
    <SFStepper {...args} className="w-72">
      <SFStep status="complete" label="UPLOAD" description="File received" />
      <SFStep status="error" label="VALIDATE" description="3 errors found" />
      <SFStep status="pending" label="PUBLISH" description="Pending validation" />
    </SFStepper>
  ),
};

export const Complete: Story = {
  args: { activeStep: 3 },
  render: (args) => (
    <SFStepper {...args} className="w-72">
      <SFStep status="complete" label="INITIALIZE" description="System configured" />
      <SFStep status="complete" label="INTEGRATE" description="Modules connected" />
      <SFStep status="complete" label="DEPLOY" description="Live in production" />
    </SFStepper>
  ),
};

export const MultiStep: Story = {
  args: { activeStep: 2 },
  render: (args) => (
    <SFStepper {...args} className="w-72">
      <SFStep status="complete" label="01 PLAN" description="Architecture defined" />
      <SFStep status="complete" label="02 BUILD" description="Components implemented" />
      <SFStep status="active" label="03 TEST" description="Running test suite" />
      <SFStep status="pending" label="04 RELEASE" description="Pending test pass" />
    </SFStepper>
  ),
};
