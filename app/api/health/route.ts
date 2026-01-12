import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

import type { HeadersInit } from "bun";

import { db } from "@/lib/db";
import { env } from "@/lib/env";

import pkgJson from "../../../package.json";

/**
 * Health Status Interface
 * Describes the structure of the health status response.
 */
export interface HealthStatus {
	/** Overall health status */
	status: "healthy" | "unhealthy";

	/** Timestamp of the health check */
	timestamp: string;

	/** Current environment (e.g., development, production) */
	environment: string;
	services: {
		database: "connected" | "disconnected";
		application: "running" | "stopped";
	};
	error?: string;
	version: string;
}

/**
 * Health Check API Endpoint
 *
 * Provides comprehensive health status for Docker containers and monitoring.
 *
 * @param request The incoming request object
 *
 * @returns Health status with database connectivity and service information
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
	const defaults = {
		health: {
			timestamp: new Date().toISOString(),
			environment: env.NODE_ENV,
			version: pkgJson.version,
		},
		headers: {
			"Cache-Control": "no-cache, no-store, must-revalidate",
			"Pragma": "no-cache",
			"Expires": "0",
		},
	} satisfies {
		health: Pick<HealthStatus, "timestamp" | "environment" | "version">;
		headers: HeadersInit;
	};

	try {
		const healthCheckPromise = db.$queryRaw`SELECT 1`;
		const timeoutPromise = new Promise<never>((_, reject) => {
			setTimeout(() => reject(new Error("Database health check timed out")), 2_000);
		});

		await Promise.race([healthCheckPromise, timeoutPromise]);

		return NextResponse.json(
			{
				...defaults.health,
				status: "healthy",
				services: { database: "connected", application: "running" },
			} satisfies HealthStatus,
			{ status: StatusCodes.OK, headers: defaults.headers },
		);
	} catch (error) {
		return NextResponse.json(
			{
				...defaults.health,
				status: "unhealthy",
				services: { database: "disconnected", application: "running" },
				error: error instanceof Error ? error.message : "Unknown error",
			} satisfies HealthStatus,
			{ status: StatusCodes.SERVICE_UNAVAILABLE, headers: defaults.headers },
		);
	}
}
