import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    // Slidev default dev port is 3030.
    // Keep 3000 to align with the running container info URL if needed.
    port: 3000,
    allowedHosts: [".kavia.ai"],
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    watch: {
      usePolling: true,
    },
  },
});
