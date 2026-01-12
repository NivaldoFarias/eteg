import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import { db } from "@/lib/db";
import { customerInputSchema } from "@/lib/validations/customer";

import { FavoriteColor } from "../../../generated/prisma/enums";

/** Success response type for customer creation */
interface CustomerCreateSuccess {
	success: true;
	data: {
		id: string;
		fullName: string;
		email: string;
		favoriteColor: FavoriteColor;
		createdAt: Date;
	};
}

/** Error response type for API failures */
interface CustomerCreateError {
	success: false;
	error: string;
	message: string;
}

type CustomerCreateResponse = CustomerCreateSuccess | CustomerCreateError;

/**
 * Creates a new customer registration
 *
 * Validates the request body, checks for duplicate CPF/email, and persists
 * the customer data to the database.
 *
 * @param request - The incoming Next.js request with customer data
 *
 * @returns JSON response with created customer or error details
 *
 * @example Success response (`201`)
 * ```json
 * { "success": true, "data": { "id": "...", "fullName": "..." } }
 * ```
 *
 * @example Validation error (`400`)
 * ```json
 * { "success": false, "error": "VALIDATION_ERROR", "message": "..." }
 * ```
 *
 * @example Duplicate error (`409`)
 * ```json
 * { "success": false, "error": "DUPLICATE_ENTRY", "message": "..." }
 * ```
 */
export async function POST(request: NextRequest): Promise<NextResponse<CustomerCreateResponse>> {
	try {
		const body: unknown = await request.json();

		const validationResult = customerInputSchema.safeParse(body);
		if (!validationResult.success) {
			const firstError = validationResult.error.issues[0];
			return NextResponse.json(
				{
					success: false,
					error: "VALIDATION_ERROR",
					message: firstError?.message ?? "Dados de solicitação inválidos",
				},
				{ status: StatusCodes.BAD_REQUEST },
			);
		}

		const { fullName, cpf, email, favoriteColor, observations } = validationResult.data;

		const existingCustomer = await db.customer.findFirst({
			where: { OR: [{ cpf }, { email }] },
			select: { cpf: true, email: true },
		});

		if (existingCustomer) {
			const duplicateField = existingCustomer.cpf === cpf ? "CPF" : "email";
			return NextResponse.json(
				{
					success: false,
					error: "DUPLICATE_ENTRY",
					message: `Um cliente com este ${duplicateField} já existe`,
				},
				{ status: StatusCodes.CONFLICT },
			);
		}

		const customer = await db.customer.create({
			data: { fullName, cpf, email, favoriteColor: favoriteColor as FavoriteColor, observations },
			select: { id: true, fullName: true, email: true, favoriteColor: true, createdAt: true },
		});

		return NextResponse.json({ success: true, data: customer }, { status: StatusCodes.CREATED });
	} catch (error) {
		console.error("Customer creation error:", error);

		// Check for database connection errors
		if (
			error instanceof Error &&
			(error.message.includes("timeout") ||
				error.message.includes("EAI_AGAIN") ||
				error.message.includes("ECONNREFUSED") ||
				error.message.includes("ENOTFOUND"))
		) {
			return NextResponse.json(
				{
					success: false,
					error: "SERVICE_UNAVAILABLE",
					message: "O serviço está temporariamente indisponível. Tente novamente em instantes.",
				},
				{ status: StatusCodes.SERVICE_UNAVAILABLE },
			);
		}

		return NextResponse.json(
			{
				success: false,
				error: "INTERNAL_ERROR",
				message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
			},
			{ status: StatusCodes.INTERNAL_SERVER_ERROR },
		);
	}
}
