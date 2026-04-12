import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)", "../stories/**/*.mdx"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-themes",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  features: {
    experimentalRSC: true,
  },
  docs: {
    autodocs: "tag",
  },
};

export default config;
