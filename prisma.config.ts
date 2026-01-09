import "dotenv/config";

import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url:
			import.meta.env["DATABASE_URL"] ?? "postgresql://eteg:eteg_dev_password@localhost:5432/eteg",
	},
});
