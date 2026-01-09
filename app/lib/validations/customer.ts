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
		.string({ error: "Nome completo é obrigatório" })
		.min(2, "Nome completo deve ter no mínimo 2 caracteres")
		.max(255, "Nome completo deve ter no máximo 255 caracteres")
		.trim(),

	cpf: z
		.string({ error: "CPF é obrigatório" })
		.transform(stripCpfMask)
		.refine((value) => value.length === 11, {
			message: "CPF deve ter exatamente 11 dígitos",
		})
		.refine((value) => validateCpf(value), {
			message: "CPF é inválido",
		}),

	email: z
		.email("Forneça um endereço de email válido")
		.max(255, "Email deve ter no máximo 255 caracteres")
		.toLowerCase()
		.trim(),

	favoriteColor: z.enum(FAVORITE_COLORS, {
		error: "Selecione uma cor válida",
	}),

	observations: z
		.string()
		.max(1000, "As observações devem ter no máximo 1000 caracteres")
		.trim()
		.optional()
		.nullable()
		.transform((val) => val || null),
});

/** Type for validated customer input data */
export type CustomerInput = z.infer<typeof customerInputSchema>;
