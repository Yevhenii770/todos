import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    include: ["**/*.{test,spec}.{js,jsx,ts,tsx}"],
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
})
