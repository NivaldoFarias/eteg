import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import eslint from "@eslint/js";
import eslintNextPlugin from "@next/eslint-plugin-next";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginTailwind from "eslint-plugin-tailwindcss";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
		"generated/prisma/**",
		"**/*.md",
		"**/*.json",
		"**/*.yml",
		"**/*.yaml",
	]),
	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		plugins: {
			"react": eslintPluginReact,
			"react-hooks": eslintPluginReactHooks,
			"tailwindcss": eslintPluginTailwind,
			"@typescript-eslint": tseslint.plugin,
			"next": eslintNextPlugin,
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				project: true,
				ecmaVersion: "latest",
				sourceType: "module",
				ecmaFeatures: { jsx: true },
			},
			globals: {
				...globals.node,
				...globals.browser,
				...globals["shared-node-browser"],
				...globals.serviceworker,
				...globals.worker,
				React: "readonly",
			},
		},
		rules: {
			...eslint.configs.recommended.rules,
			...eslintPluginTailwind.configs.recommended.rules,
			...eslintPluginReact.configs.recommended.rules,
			...eslintPluginReactHooks.configs.recommended.rules,

			/* ESLint */
			"no-unused-vars": "off",
			"no-console": ["error", { allow: ["warn", "error", "table"] }],

			/* TypeScript */
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

			/* React */
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",

			/* TailwindCSS */
			"tailwindcss/classnames-order": "off",
			"tailwindcss/no-custom-classname": "off",
		},
		settings: {
			react: { version: "detect" },
			tailwindcss: {
				config: dirname(fileURLToPath(import.meta.url)) + "/app/globals.css",
			},
		},
	},
	{
		files: ["app/**/*.{ts,cts,mts,js,cjs,mjs}"],
		languageOptions: {
			globals: {
				...globals.node,
				Bun: "readonly",
			},
		},
	},
	{
		files: ["**/*.cjs"],
		languageOptions: {
			globals: globals.commonjs,
		},
	},
	{
		files: ["**/*.mjs"],
		languageOptions: {
			globals: globals.node,
		},
	},
	eslintConfigPrettier,
);
