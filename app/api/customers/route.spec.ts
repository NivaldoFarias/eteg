import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

import type { CustomerCreateInput, CustomerModel } from "generated/prisma/models";

import { POST } from "@/api/customers/route";
import { db } from "@/lib/db";

import { FavoriteColor } from "../../../generated/prisma/enums";

vi.mock("@/lib/db", () => ({
	db: {
		customer: {
			findFirst: vi.fn(),
			create: vi.fn(),
		},
	},
}));

/** API response type for test assertions */
interface ApiResponse {
	success: boolean;
	data?: {
		id: string;
		fullName: string;
		email: string;
		favoriteColor: string;
		createdAt: string;
	};
	error?: string;
	message?: string;
}

/** Helper to create a mock NextRequest with JSON body */
function createRequest(body: unknown): NextRequest {
	return new NextRequest("http://localhost/api/customers", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}

/** Creates a complete mock customer for db.customer.create mock */
function createMockCustomer(overrides: Partial<CustomerModel> = {}): CustomerModel {
	return {
		id: "test-id-123",
		fullName: "John Doe",
		cpf: "52998224725",
		email: "john@example.com",
		favoriteColor: FavoriteColor.BLUE,
		observations: null,
		createdAt: new Date("2026-01-09T00:00:00Z"),
		...overrides,
	};
}

/** Valid customer data for test cases */
const validCustomerData: CustomerCreateInput = {
	fullName: "John Doe",
	cpf: "52998224725",
	email: "john@example.com",
	favoriteColor: "BLUE",
	observations: "Test customer",
};

describe("POST /api/customers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("successful creation", () => {
		test("creates customer with valid data and returns 201", async () => {
			vi.mocked(db.customer.findFirst).mockResolvedValue(null);
			vi.mocked(db.customer.create).mockResolvedValue(createMockCustomer());

			const request = createRequest(validCustomerData);
			const response = await POST(request);
			const data = (await response.json()) as ApiResponse;

			expect(response.status).toBe(StatusCodes.CREATED);
			expect(data.success).toBe(true);
			expect(data.data).toEqual(
				expect.objectContaining({
					id: "test-id-123",
					fullName: "John Doe",
					email: "john@example.com",
					favoriteColor: FavoriteColor.BLUE,
				}),
			);
		});

		test("creates customer without observations", async () => {
			const customerWithoutObservations = {
				fullName: "Jane Doe",
				cpf: "11144477735",
				email: "jane@example.com",
				favoriteColor: "RED",
			};

			vi.mocked(db.customer.findFirst).mockResolvedValue(null);
			vi.mocked(db.customer.create).mockResolvedValue(
				createMockCustomer({
					id: "test-id-456",
					fullName: "Jane Doe",
					cpf: "11144477735",
					email: "jane@example.com",
					favoriteColor: FavoriteColor.RED,
				}),
			);

			const request = createRequest(customerWithoutObservations);
			const response = await POST(request);

			expect(response.status).toBe(StatusCodes.CREATED);
		});

		test("normalizes email to lowercase before storing", async () => {
			vi.mocked(db.customer.findFirst).mockResolvedValue(null);
			vi.mocked(db.customer.create).mockResolvedValue(createMockCustomer());

			const request = createRequest({ ...validCustomerData, email: "JOHN@EXAMPLE.COM" });
			await POST(request);

			expect(db.customer.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({ email: "john@example.com" }),
				}),
			);
		});
	});

	describe("validation errors", () => {
		test.each([
			{
				name: "missing required fields",
				body: {},
				messageContains: undefined,
			},
			{
				name: "invalid CPF",
				body: { ...validCustomerData, cpf: "12345678901" },
				messageContains: "invalid",
			},
			{
				name: "invalid email format",
				body: { ...validCustomerData, email: "not-an-email" },
				messageContains: undefined,
			},
			{
				name: "invalid color",
				// @ts-expect-error - testing invalid enum value
				body: { ...validCustomerData, favoriteColor: "PINK" },
				messageContains: undefined,
			},
			{
				name: "full name too short",
				body: { ...validCustomerData, fullName: "J" },
				messageContains: "at least 2 characters",
			},
		] satisfies {
			name: string;
			body: Partial<CustomerCreateInput>;
			messageContains?: string;
		}[])("returns 400 for $name", async ({ body, messageContains }) => {
			const request = createRequest(body);
			const response = await POST(request);
			const data = (await response.json()) as ApiResponse;

			expect(response.status).toBe(StatusCodes.BAD_REQUEST);
			expect(data.success).toBe(false);
			expect(data.error).toBe("VALIDATION_ERROR");
			if (messageContains) {
				expect(data.message).toContain(messageContains);
			}
		});
	});

	describe("duplicate handling", () => {
		test.each([
			{
				name: "duplicate CPF",
				existingCustomer: createMockCustomer({ email: "other@example.com" }),
				messageContains: "CPF",
			},
			{
				name: "duplicate email",
				existingCustomer: createMockCustomer({ cpf: "11144477735" }),
				messageContains: "email",
			},
		] satisfies {
			name: string;
			existingCustomer: CustomerModel;
			messageContains: string;
		}[])("returns 409 for $name", async ({ existingCustomer, messageContains }) => {
			vi.mocked(db.customer.findFirst).mockResolvedValue(existingCustomer);

			const request = createRequest(validCustomerData);
			const response = await POST(request);
			const data = (await response.json()) as ApiResponse;

			expect(response.status).toBe(StatusCodes.CONFLICT);
			expect(data.success).toBe(false);
			expect(data.error).toBe("DUPLICATE_ENTRY");
			expect(data.message).toContain(messageContains);
		});
	});

	describe("error handling", () => {
		test.each([
			{
				name: "database connection error",
				setup: () => {
					vi.mocked(db.customer.findFirst).mockRejectedValue(
						new Error("Database connection failed"),
					);
				},
			},
			{
				name: "create fails after duplicate check",
				setup: () => {
					vi.mocked(db.customer.findFirst).mockResolvedValue(null);
					vi.mocked(db.customer.create).mockRejectedValue(new Error("Insert failed"));
				},
			},
		] satisfies {
			name: string;
			setup: () => void;
		}[])("returns 500 for $name", async ({ setup }) => {
			setup();

			const request = createRequest(validCustomerData);
			const response = await POST(request);
			const data = (await response.json()) as ApiResponse;

			expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(data.success).toBe(false);
			expect(data.error).toBe("INTERNAL_ERROR");
		});
	});
});
