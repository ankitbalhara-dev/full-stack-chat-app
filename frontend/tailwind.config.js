import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "acid", "aqua", "autumn", "black", "bumblebee", "business",
  "cmyk", "coffee", "corporate", "cupcake", ~ "cyberpunk", "dim", "dracula", "emerald",
  "fantasy", "forest", "garden", "halloween", "lemonade", "lofi", "luxury", "night",
  "nord", "pastel", "retro", "sunset", "synthwave", "valentine", "winter", "wireframe",],
  },
};
