/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          bg: "#f8f9fa",
          card: "#ffffff",
          border: "#e5e7eb",
          text: "#1f2937",
          muted: "#6b7280",
        },
        // Dark mode colors - warm tone for reading
        dark: {
          bg: "#0f0f0f",
          card: "#1a1a1a",
          border: "#333333",
          text: "#e5e5e5",
          muted: "#a0a0a0",
        },
        // Primary colors
        primary: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
          light: "#60a5fa",
        },
      },
    },
  },
  plugins: [],
};
