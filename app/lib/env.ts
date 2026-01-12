import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { EnvironmentDefaults, RuntimeEnvironment } from "./constants/env";

/** Parsed and validated environment variables for the application */
export const env = createEnv({
	/** Server-side specific environment variables schema */
	server: {
		NODE_ENV: z.enum(RuntimeEnvironment).default(RuntimeEnvironment.Development),
		DATABASE_URL: z.url().default(EnvironmentDefaults.DATABASE_URL),
		DEMO_ENABLED: z.stringbool().default(false),
	},

	/** Client-side specific environment variables schema */
	client: {
		NEXT_PUBLIC_DEMO_ENABLED: z.stringbool().optional(),
	},

	/** Runtime specific environment variables */
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		DEMO_ENABLED: process.env.DEMO_ENABLED,
		NEXT_PUBLIC_DEMO_ENABLED: process.env.NEXT_PUBLIC_DEMO_ENABLED,
	},
});
