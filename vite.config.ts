/* eslint-disable unicorn/no-abusive-eslint-disable */
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set port
  server: {
    port: 5173,
  },
  base: "",
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },

  // eslint-disable-next-line
  // @ts-ignore
  test: {
    environment: "jsdom",
  },
});
