/* eslint-disable unicorn/no-abusive-eslint-disable */
/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

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

  resolve: {
    alias: {
      // eslint-disable-next-line unicorn/prefer-module
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // eslint-disable-next-line
  // @ts-ignore
  test: {
    environment: "jsdom",
  },
});
