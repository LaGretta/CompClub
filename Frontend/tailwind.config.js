/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-primary": "#283500",
        "on-primary-fixed": "#161e00",
        "on-secondary-fixed": "#1c1b1b",
        "on-background": "#e5e2e1",
        "on-surface": "#e5e2e1",
        "outline-variant": "#444933",
        "surface-variant": "#353534",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "background": "#131313",
        "surface-container-high": "#2a2a2a",
        "tertiary": "#ffffff",
        "on-tertiary": "#303030",
        "primary": "#ffffff",
        "secondary-container": "#474746",
        "on-surface-variant": "#c4c9ac",
        "on-secondary": "#313030",
        "inverse-on-surface": "#313030",
        "surface-dim": "#131313",
        "surface": "#131313",
        "primary-fixed": "#c3f400",
        "secondary-fixed": "#e5e2e1",
        "surface-container-highest": "#353534",
        "surface-container-lowest": "#0e0e0e",
        "outline": "#8e9379"
      },
      spacing: {
        "margin-desktop": "64px",
        "gutter": "24px",
        "margin-mobile": "16px",
        "unit": "4px",
        "container-max": "1440px"
      },
      fontFamily: {
        "headline-lg": ["Space Grotesk", "sans-serif"],
        "label-sm": ["JetBrains Mono", "monospace"],
        "headline-lg-mobile": ["Space Grotesk", "sans-serif"],
        "label-xs": ["JetBrains Mono", "monospace"],
        "body-md": ["Geist", "sans-serif"],
        "headline-xl": ["Space Grotesk", "sans-serif"]
      }
    }
  },
  plugins: [],
}