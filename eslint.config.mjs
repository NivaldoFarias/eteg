import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginTailwind from "eslint-plugin-tailwindcss";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig(
	{
		ignores: [".next/**", "node_modules/**", "dist/**", "out/**", "generated/prisma/**"],
	},
	...compat.extends("plugin:@next/next/recommended"),
	...compat.extends("plugin:@next/next/core-web-vitals"),
	{
		files: ["**/*.{ts,tsx,js,jsx}"],
		plugins: {
			"react": eslintPluginReact,
			"react-hooks": eslintPluginReactHooks,
			"tailwindcss": eslintPluginTailwind,
			"@typescript-eslint": tseslint.plugin,
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
