import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
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
