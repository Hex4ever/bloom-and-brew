import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    // Component tests (.test.tsx) need jsdom; pure-logic tests (.test.ts) stay in node
    projects: [
      {
        test: {
          name: "components",
          include: ["src/**/*.test.tsx"],
          environment: "jsdom",
        },
      },
      {
        test: {
          name: "lib",
          include: ["src/**/*.test.ts"],
          environment: "node",
        },
      },
    ],
  },
})
