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
    viewport: {
      viewports: {
        macbook13: {
          name: "MacBook 13″ (1280×800)",
          styles: { width: "1280px", height: "800px" },
        },
        macbook15: {
          name: "MacBook 15″ (1440×900)",
          styles: { width: "1440px", height: "900px" },
        },
      },
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
