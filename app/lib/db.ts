import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "../../generated/prisma/client";

import { env } from "./env";

/** Connection pool with aggressive timeout for fast-fail behavior */
const pool = new Pool({
	connectionString: env.DATABASE_URL,
	connectionTimeoutMillis: 2_000,
	statement_timeout: 5_000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const db = prisma;

/**
 * Wraps a database operation with timeout protection
 *
 * Prevents long-running operations from hanging when the database is
 * unavailable, providing fast-fail behavior for better user experience.
 *
 * @template T The return type of the database operation
 * @param operation The async database operation to execute
 * @param timeoutMs Timeout in milliseconds (default: 3000ms)
 *
 * @returns Promise resolving to the operation result
 *
 * @throws {Error} When the operation times out or the database is unavailable
 *
 * @example
 * ```typescript
 * const customer = await withTimeout(
 *   db.customer.findFirst({ where: { id } }),
 *   2_000
 * );
 * ```
 */
export async function withTimeout<T>(operation: Promise<T>, timeoutMs = 3_000): Promise<T> {
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => {
			reject(new Error("Database operation timed out. The service may be unavailable."));
		}, timeoutMs);
	});

	return Promise.race([operation, timeoutPromise]);
}
