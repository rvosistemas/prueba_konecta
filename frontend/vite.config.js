import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.FRONTEND_PORT) || 3000,
    watch: {
      usePolling: true,
    }
  },
  build: {
    outDir: "build",
  },
});
