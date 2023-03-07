/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "",

  // eslint-disable-next-line
  // @ts-ignore
  test: {
    environment: "jsdom",
  },
});
