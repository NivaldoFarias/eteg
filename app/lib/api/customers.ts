import type { FavoriteColor } from "../../../generated/prisma/enums";
import type { CustomerInput } from "../validations/customer";

import { apiClient } from "./client";

/**
 * Customer data returned from the API after successful creation
 */
export interface CustomerData {
	id: string;
	fullName: string;
	email: string;
	favoriteColor: FavoriteColor;
	createdAt: Date;
}

/**
 * Creates a new customer registration via the API
 *
 * Sends customer data to the POST /api/customers endpoint with
 * proper validation and error handling.
 *
 * @param customerData - Validated customer input data
 *
 * @returns Promise resolving to API response with customer data
 *
 * @throws {ApiError} When validation fails, duplicate exists, or server error occurs
 *
 * @example
 * ```typescript
 * try {
 *   const response = await createCustomer({
 *     fullName: "John Doe",
 *     cpf: "12345678901",
 *     email: "john@example.com",
 *     favoriteColor: FavoriteColor.BLUE,
 *     observations: null,
 *   });
 *
 *   if (response.success) {
 *     console.log("Customer created:", response.data.id);
 *   }
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error(error.message);
 *   }
 * }
 * ```
 */
export async function createCustomer(customerData: CustomerInput) {
	return apiClient<CustomerData>("/api/customers", {
		method: "POST",
		body: JSON.stringify(customerData),
	});
}
