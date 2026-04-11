import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "../app/globals.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        dark: "dark",
        light: "",
      },
      defaultTheme: "dark",
    }),
  ],
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "oklch(0.145 0 0)" },
        { name: "light", value: "oklch(1 0 0)" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
};

export default preview;
