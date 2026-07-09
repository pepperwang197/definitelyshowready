import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/data": {
          target:
            env.BACKEND_URL || env.VITE_BACKEND_URL || "http://localhost:3000",
          changeOrigin: true,
        },
        "/files": {
          target:
            env.BACKEND_URL || env.VITE_BACKEND_URL || "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  };
});
