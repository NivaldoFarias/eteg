import { validate as validateCpf } from "gerador-validador-cpf";
import { z } from "zod";

import { FavoriteColor } from "../../../generated/prisma/enums";

/** Array of valid rainbow color values from the Prisma enum */
const FAVORITE_COLORS = Object.values(FavoriteColor) as [string, ...string[]];

/**
 * Strips non-digit characters from a CPF string
 *
 * @param cpf Raw CPF input (may contain dots and dashes)
 *
 * @returns CPF string containing only digits
 */
function stripCpfMask(cpf: string): string {
	return cpf.replace(/\D/g, "");
}

/**
 * Zod schema for customer registration input validation
 *
 * Validates all required fields for customer registration:
 * - fullName: Required, 2-255 characters
 * - cpf: Required, valid Brazilian CPF format (11 digits after stripping mask)
 * - email: Required, valid email format, max 255 characters
 * - favoriteColor: Required, must be one of the rainbow colors
 * - observations: Optional, max 1000 characters
 */
export const customerInputSchema = z.object({
	fullName: z
		.string({ error: "Full name is required" })
		.min(2, "Full name must be at least 2 characters")
		.max(255, "Full name must be at most 255 characters")
		.trim(),

	cpf: z
		.string({ error: "CPF is required" })
		.transform(stripCpfMask)
		.refine((value) => value.length === 11, {
			message: "CPF must have exactly 11 digits",
		})
		.refine((value) => validateCpf(value), {
			message: "CPF is invalid",
		}),

	email: z
		.email("Please provide a valid email address")
		.max(255, "Email must be at most 255 characters")
		.toLowerCase()
		.trim(),

	favoriteColor: z.enum(FAVORITE_COLORS, {
		error: "Please select a valid color",
	}),

	observations: z
		.string()
		.max(1000, "Observations must be at most 1000 characters")
		.trim()
		.optional()
		.nullable()
		.transform((val) => val || null),
});

/** Type for validated customer input data */
export type CustomerInput = z.infer<typeof customerInputSchema>;
