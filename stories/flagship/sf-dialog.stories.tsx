"use client";

import type { Meta, StoryObj } from "@storybook/react";
import {
  SFDialog,
  SFDialogTrigger,
  SFDialogContent,
  SFDialogHeader,
  SFDialogTitle,
  SFDialogDescription,
  SFDialogFooter,
  SFDialogClose,
} from "@/components/sf/sf-dialog";
import {
  SFAlertDialog,
  SFAlertDialogTrigger,
  SFAlertDialogContent,
  SFAlertDialogHeader,
  SFAlertDialogTitle,
  SFAlertDialogDescription,
  SFAlertDialogFooter,
  SFAlertDialogAction,
  SFAlertDialogCancel,
} from "@/components/sf/sf-alert-dialog";
import { SFButton } from "@/components/sf/sf-button";
import { SFInput } from "@/components/sf/sf-input";
import { SFLabel } from "@/components/sf/sf-label";

const meta: Meta<typeof SFDialog> = {
  title: "Flagship/SFDialog",
  component: SFDialog,
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controlled open state",
    },
  },
};
export default meta;

type Story = StoryObj<typeof SFDialog>;

export const Default: Story = {
  render: () => (
    <SFDialog>
      <SFDialogTrigger asChild>
        <SFButton size="sm">OPEN DIALOG</SFButton>
      </SFDialogTrigger>
      <SFDialogContent>
        <SFDialogHeader>
          <SFDialogTitle>SYSTEM CONFIGURATION</SFDialogTitle>
          <SFDialogDescription>
            Configure core system parameters. Changes take effect immediately.
          </SFDialogDescription>
        </SFDialogHeader>
        <div className="py-4">
          <p className="font-mono text-sm text-muted-foreground">
            No additional configuration required.
          </p>
        </div>
        <SFDialogFooter>
          <SFDialogClose asChild>
            <SFButton size="sm" intent="ghost">CLOSE</SFButton>
          </SFDialogClose>
        </SFDialogFooter>
      </SFDialogContent>
    </SFDialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <SFDialog>
      <SFDialogTrigger asChild>
        <SFButton size="sm">CREATE MODULE</SFButton>
      </SFDialogTrigger>
      <SFDialogContent>
        <SFDialogHeader>
          <SFDialogTitle>NEW MODULE</SFDialogTitle>
          <SFDialogDescription>
            Add a new module to the system registry.
          </SFDialogDescription>
        </SFDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <SFLabel htmlFor="module-name">MODULE NAME</SFLabel>
            <SFInput id="module-name" placeholder="sf-component" />
          </div>
          <div className="space-y-2">
            <SFLabel htmlFor="module-layer">LAYER</SFLabel>
            <SFInput id="module-layer" placeholder="FRAME / SIGNAL" />
          </div>
        </div>
        <SFDialogFooter>
          <SFDialogClose asChild>
            <SFButton size="sm" intent="ghost">CANCEL</SFButton>
          </SFDialogClose>
          <SFButton size="sm">REGISTER</SFButton>
        </SFDialogFooter>
      </SFDialogContent>
    </SFDialog>
  ),
};

export const AlertConfirmation: Story = {
  render: () => (
    <SFAlertDialog>
      <SFAlertDialogTrigger asChild>
        <SFButton size="sm" intent="signal">PURGE CACHE</SFButton>
      </SFAlertDialogTrigger>
      <SFAlertDialogContent>
        <SFAlertDialogHeader>
          <SFAlertDialogTitle>CONFIRM PURGE</SFAlertDialogTitle>
          <SFAlertDialogDescription>
            This will permanently clear all cached modules. This action cannot be undone.
          </SFAlertDialogDescription>
        </SFAlertDialogHeader>
        <SFAlertDialogFooter>
          <SFAlertDialogCancel>CANCEL</SFAlertDialogCancel>
          <SFAlertDialogAction>PURGE</SFAlertDialogAction>
        </SFAlertDialogFooter>
      </SFAlertDialogContent>
    </SFAlertDialog>
  ),
};
