import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

	config( );

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: env("DATABASE_URL") ?? "postgresql://eteg:eteg_dev_password@localhost:5432/eteg",
	},
});
