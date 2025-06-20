import { defineConfig } from "vite";
import config from "./vite.config.components";

export default defineConfig({
  ...config,
  build: {
    rollupOptions: {
      external: ["lit"],
    },
    lib: {
      name: "usa-banner",
      entry: {
        "components/usa-banner.js":
          "packages/usa-banner/src/usa-banner.component.js",
      },
    },
  },
});
