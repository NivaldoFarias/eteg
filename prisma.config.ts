import { existsSync } from "node:fs";

import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

if (existsSync(".env")) {
	config({ path: ".env" });
} else {
	config({ path: ".env.example" });
}

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: env("DATABASE_URL") ?? "postgresql://eteg:eteg_dev_password@localhost:5432/eteg",
	},
});
