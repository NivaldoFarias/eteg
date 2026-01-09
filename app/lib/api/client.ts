import { StatusCodes } from "http-status-codes";

/**
 * Base API error class for structured error handling
 */
export class ApiError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number,
		public readonly errorCode?: string,
	) {
		super(message);
		this.name = "ApiError";
	}
}

/** Generic API response structure for error responses */
export interface ApiErrorResponse {
	success: false;
	error: string;
	message: string;
}

/** Generic API response structure for successful responses */
export interface ApiSuccessResponse<T> {
	success: true;
	data: T;
}

/** Union type for all API responses */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Type-safe fetch wrapper with centralized error handling
 *
 * Provides a consistent interface for making API requests with proper
 * type safety, error handling, and response validation.
 *
 * @template T The expected data type in the successful API response
 * @param url The API endpoint URL
 * @param options Standard fetch options with typed body
 *
 * @returns Parsed JSON response with type safety
 *
 * @throws {ApiError} When the API returns an error response or network fails
 *
 * @example
 * ```typescript
 * const response = await apiClient<CustomerData>("/api/customers", {
 *   method: "POST",
 *   body: JSON.stringify(customerData),
 * });
 *
 * if (response.success) {
 *   console.log(response.data.id);
 * }
 * ```
 */
export async function apiClient<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
	try {
		const response = await fetch(url, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
		});

		const data = (await response.json()) as ApiResponse<T>;

		if (!response.ok) {
			if (!data.success) {
				throw new ApiError(data.message, response.status, data.error);
			}
			throw new ApiError(
				"An unexpected error occurred",
				response.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}

		return data;
	} catch (error) {
		if (error instanceof ApiError) throw error;

		if (error instanceof TypeError && error.message.includes("fetch")) {
			throw new ApiError(
				"Erro de rede. Verifique sua conexão.",
				StatusCodes.SERVICE_UNAVAILABLE,
				"NETWORK_ERROR",
			);
		}

		throw new ApiError(
			"Ocorreu um erro inesperado. Tente novamente.",
			StatusCodes.INTERNAL_SERVER_ERROR,
			"UNKNOWN_ERROR",
		);
	}
}
