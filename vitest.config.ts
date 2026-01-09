import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		environment: "jsdom",
		include: ["**/*.{test,spec}.{ts,tsx}"],
		exclude: ["node_modules", "generated", ".next"],
		setupFiles: ["./tests/setup.ts"],
		coverage: {
			provider: "v8",
			include: ["app/**/*.{ts,tsx}"],
			exclude: ["**/*.d.ts", "**/types.ts", "app/types.d.ts"],
		},
	},
});
