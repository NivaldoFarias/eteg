import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

import { environmentDefaults, RuntimeEnvironment } from "./constants/env";

/** Parsed and validated environment variables for the application */
export const env = createEnv({
	server: {
		/**
		 * Application runtime environment
		 *
		 * @default "development"
		 * @see {@link RuntimeEnvironment} for possible values
		 */
		NODE_ENV: z.enum(RuntimeEnvironment).default(RuntimeEnvironment.Development),

		/**
		 * PostgreSQL database connection URL
		 *
		 * @example "postgresql://user:password@localhost:5432/dbname"
		 */
		DATABASE_URL: z.url().default(environmentDefaults.DATABASE_URL),
	},

	client: {},
	shared: {
		/**
		 * Flag to enable or disable demo mode features
		 *
		 * @default false
		 */
		DEMO_ENABLED: z.stringbool().default(environmentDefaults.DEMO_ENABLED),
	},

	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		DEMO_ENABLED: process.env.DEMO_ENABLED,
	},
});
