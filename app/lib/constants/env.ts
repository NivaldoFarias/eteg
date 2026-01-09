/** Available runtime environments for the application */
export enum RuntimeEnvironment {
	Development = "development",
	Test = "test",
	Staging = "staging",
	Production = "production",
}

/**
 * Default environment configuration values.
 *
 * @remarks Used as fallbacks when environment variables are not set
 */
export enum EnvironmentDefaults {
	/** Default runtime environment */
	NODE_ENV = RuntimeEnvironment.Development,

	/** Default database connection string for local development */
	DATABASE_URL = "postgresql://eteg:eteg_dev_password@localhost:5432/eteg",

	/** Default application URL for local development */
	APP_URL = "http://localhost:3000",

	/** Default API URL for local development */
	API_URL = "http://localhost:3000/api",
}
