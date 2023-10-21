import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

import baseConfig from "@ameleco/tailwind-config";

export default {
  content: [
    "./src/**/*.tsx",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [baseConfig],
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
