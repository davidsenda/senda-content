import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        senda: {
          text: "#0C1F1E",
          jet: "#112F31",
          teal: "#164044",
          light: "#B8CABE",
          contrast: "#1C4642",
          beige: "#F4EFE8",
          yellow: "#FAB438",
          red: "#C45252",
        },
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["Kode Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
