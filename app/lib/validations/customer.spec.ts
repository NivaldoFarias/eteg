import { describe, expect, test } from "vitest";

import { customerInputSchema } from "@/lib/validations/customer";

describe("customerInputSchema", () => {
	describe("fullName field", () => {
		test("accepts valid full name", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(true);
		});

		test("rejects empty full name", () => {
			const result = customerInputSchema.safeParse({
				fullName: "",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(false);
			expect(result.error?.issues[0]?.message).toContain("no mínimo 2 caracteres");
		});

		test("rejects full name shorter than 2 characters", () => {
			const result = customerInputSchema.safeParse({
				fullName: "J",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(false);
			expect(result.error?.issues[0]?.message).toContain("no mínimo 2 caracteres");
		});

		test("trims whitespace from full name", () => {
			const result = customerInputSchema.safeParse({
				fullName: "  John Doe  ",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.fullName).toBe("John Doe");
			}
		});
	});

	describe("cpf field", () => {
		test("accepts valid CPF without mask", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.cpf).toBe("52998224725");
			}
		});

		test("accepts valid CPF with mask and strips it", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "529.982.247-25",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.cpf).toBe("52998224725");
			}
		});

		test("rejects CPF with wrong number of digits", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "1234567890",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(false);
			expect(result.error?.issues[0]?.message).toContain("11 dígitos");
		});

		test("rejects invalid CPF (wrong check digits)", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "12345678901",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(false);
			expect(result.error?.issues[0]?.message).toContain("inválido");
		});

		test("rejects CPF with all same digits", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "11111111111",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(false);
			expect(result.error?.issues[0]?.message).toContain("inválido");
		});
	});

	describe("email field", () => {
		test("accepts valid email", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(true);
		});

		test("normalizes email to lowercase", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "JOHN@EXAMPLE.COM",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.email).toBe("john@example.com");
			}
		});

		test("rejects email with whitespace", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "  john@example.com  ",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(false);
		});

		test("rejects invalid email format", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "not-an-email",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(false);
			expect(result.error?.issues[0]?.message).toContain("email válido");
		});
	});

	describe("favoriteColor field", () => {
		test.each(["RED", "ORANGE", "YELLOW", "GREEN", "BLUE", "INDIGO", "VIOLET"] as const)(
			"accepts valid color %s",
			(color) => {
				const result = customerInputSchema.safeParse({
					fullName: "John Doe",
					cpf: "52998224725",
					email: "john@example.com",
					favoriteColor: color,
				});

				expect(result.success).toBe(true);
			},
		);

		test("rejects invalid color", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "PINK",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("observations field", () => {
		test("accepts observations as optional", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.observations).toBeNull();
			}
		});

		test("accepts valid observations", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
				observations: "Some notes here",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.observations).toBe("Some notes here");
			}
		});

		test("transforms empty string to null", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
				observations: "",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.observations).toBeNull();
			}
		});

		test("trims whitespace from observations", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
				observations: "  Some notes  ",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.observations).toBe("Some notes");
			}
		});

		test("rejects observations exceeding 1000 characters", () => {
			const result = customerInputSchema.safeParse({
				fullName: "John Doe",
				cpf: "52998224725",
				email: "john@example.com",
				favoriteColor: "BLUE",
				observations: "a".repeat(1001),
			});

			expect(result.success).toBe(false);
			expect(result.error?.issues[0]?.message).toContain("1000 caracteres");
		});
	});
});
