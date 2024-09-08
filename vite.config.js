import { defineConfig } from "vite";
import os from "os";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
  server: {
    open: os.platform() === "darwin" ? "Google Chrome" : "chrome", // Open Chrome based on the OS
  },
});
