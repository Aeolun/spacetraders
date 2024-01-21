import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import {config} from "dotenv";

config({
  path: process.env.SERVER ? `.env.${process.env.SERVER}` : undefined
})

export default defineConfig({
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT)-1 : 3000,
  },
  clearScreen: false,
  plugins: [tsconfigPaths(), vanillaExtractPlugin()],
  define: {
    __API_PORT__: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  },
  test: {
    threads: false,
    coverage: {
      provider: 'istanbul',
      enabled: true,
      all: true,
      include: ['src/automation/**/*.ts'],
    }
  }
})