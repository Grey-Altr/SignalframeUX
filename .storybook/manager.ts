import { addons } from "storybook/manager-api";
import { create } from "@storybook/theming/create";

const sfuxTheme = create({
  base: "dark",
  brandTitle: "SIGNALFRAME//UX",
  brandUrl: "https://signalframe.culturedivision.com",
  fontBase: "Inter, sans-serif",
  fontCode: "'JetBrains Mono', monospace",
  appBg: "#1a1a1a",
  appContentBg: "#0a0a0a",
  appBorderColor: "#1a1a1a",
  appBorderRadius: 0,
  colorPrimary: "#e0306c",
  colorSecondary: "#e0306c",
  barBg: "#0a0a0a",
  barTextColor: "#999999",
  barSelectedColor: "#e0306c",
  inputBg: "#1a1a1a",
  inputBorder: "#333333",
  inputBorderRadius: 0,
});

addons.setConfig({ theme: sfuxTheme });
