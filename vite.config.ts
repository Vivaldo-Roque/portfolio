import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import yaml from "@rollup/plugin-yaml";
import path from "path";

export default defineConfig({
  plugins: [
    // TanStack Router file-based route generation (must be before react)
    TanStackRouterVite({
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
    yaml(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Native tsconfig paths (replaces vite-tsconfig-paths plugin)
    tsconfigPaths: true,
  },
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
  },
});
