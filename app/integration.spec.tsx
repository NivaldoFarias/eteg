import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";

import Page from "./page";

vi.mock("@/lib/api", () => ({
	ApiError: class ApiError extends Error {
		constructor(
			message: string,
			public readonly statusCode: number,
			public readonly errorCode?: string,
		) {
			super(message);
			this.name = "ApiError";
		}
	},
	createCustomer: vi.fn(),
}));

describe("Customer Registration Page Integration", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("page structure", () => {
		test("renders page header with title and form fields", () => {
			render(<Page />);

			expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/cadastro de clientes/i);
			expect(
				screen.getByText(/preencha o formulário abaixo para registrar um novo cliente/i),
			).toBeInTheDocument();

			expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/cor favorita/i)).toBeInTheDocument();
			expect(screen.getByLabelText(/observações/i)).toBeInTheDocument();
			expect(screen.getByRole("button", { name: /enviar cadastro/i })).toBeInTheDocument();
		});

		test("renders semantic HTML with main, banner and form landmarks", () => {
			render(<Page />);

			expect(screen.getByRole("main")).toBeInTheDocument();
			expect(screen.getByRole("banner")).toBeInTheDocument();
			expect(document.querySelector("form")).toBeInTheDocument();
		});

		test("applies responsive layout classes to main container", () => {
			render(<Page />);

			const main = screen.getByRole("main");
			expect(main).toHaveClass("flex", "flex-1", "flex-col", "items-center", "justify-center");
			expect(main).toHaveClass("px-4", "py-8");
		});
	});

	describe("form validation flow", () => {
		test("displays validation errors for required fields on empty submission", async () => {
			const user = userEvent.setup();
			render(<Page />);

			await user.click(screen.getByRole("button", { name: /enviar cadastro/i }));

			await waitFor(() => {
				expect(screen.getByText(/no mínimo 2 caracteres/i)).toBeInTheDocument();
				expect(screen.getByText(/cpf deve ter exatamente 11 dígitos/i)).toBeInTheDocument();
			});
		});

		test("displays CPF required error when name and email filled but CPF empty", async () => {
			const user = userEvent.setup();
			render(<Page />);

			await user.type(screen.getByLabelText(/nome completo/i), "João Silva");
			await user.type(screen.getByLabelText(/email/i), "joao@example.com");
			await user.click(screen.getByRole("button", { name: /enviar cadastro/i }));

			await waitFor(() => {
				expect(screen.getByText(/cpf deve ter exatamente 11 dígitos/i)).toBeInTheDocument();
			});
		});

		test("displays email format error when invalid email provided", async () => {
			const user = userEvent.setup();
			render(<Page />);

			await user.type(screen.getByLabelText(/nome completo/i), "João Silva");
			await user.type(screen.getByLabelText(/cpf/i), "52998224725");
			await user.type(screen.getByLabelText(/email/i), "invalid-email");
			await user.click(screen.getByRole("button", { name: /enviar cadastro/i }));

			await waitFor(() => {
				expect(screen.getByText(/email válido/i)).toBeInTheDocument();
			});
		});

		test("displays color selection error when all text fields valid but no color selected", async () => {
			const user = userEvent.setup();
			render(<Page />);

			await user.type(screen.getByLabelText(/nome completo/i), "João Silva");
			await user.type(screen.getByLabelText(/cpf/i), "52998224725");
			await user.type(screen.getByLabelText(/email/i), "joao@example.com");
			await user.click(screen.getByRole("button", { name: /enviar cadastro/i }));

			await waitFor(() => {
				expect(screen.getByText(/selecione uma cor válida/i)).toBeInTheDocument();
			});
		});
	});

	describe("form submission flow", () => {
		test("validates color selection before API call with valid text fields", async () => {
			const { createCustomer } = await import("@/lib/api");
			const user = userEvent.setup();

			vi.mocked(createCustomer).mockResolvedValue({
				success: true,
				data: {
					id: "customer-123",
					fullName: "João Silva",
					email: "joao@example.com",
					favoriteColor: "BLUE",
					createdAt: new Date(),
				},
			});

			render(<Page />);

			await user.type(screen.getByLabelText(/nome completo/i), "João Silva");
			await user.type(screen.getByLabelText(/cpf/i), "52998224725");
			await user.type(screen.getByLabelText(/email/i), "joao@example.com");
			await user.click(screen.getByRole("button", { name: /enviar cadastro/i }));

			await waitFor(() => {
				expect(screen.getByText(/selecione uma cor válida/i)).toBeInTheDocument();
			});
		});

		test("validates all fields before reaching API error handler", async () => {
			const { createCustomer, ApiError } = await import("@/lib/api");
			const user = userEvent.setup();

			vi.mocked(createCustomer).mockRejectedValue(
				new ApiError("Um cliente com este CPF já existe", 409, "DUPLICATE_CPF"),
			);

			render(<Page />);

			await user.type(screen.getByLabelText(/nome completo/i), "João Silva");
			await user.type(screen.getByLabelText(/cpf/i), "52998224725");
			await user.type(screen.getByLabelText(/email/i), "joao@example.com");
			await user.click(screen.getByRole("button", { name: /enviar cadastro/i }));

			await waitFor(() => {
				expect(screen.getByText(/selecione uma cor válida/i)).toBeInTheDocument();
			});
		});
	});

	describe("accessibility", () => {
		test("renders form input fields with proper associated labels", () => {
			render(<Page />);

			expect(screen.getByLabelText(/nome completo/i)).toBeInstanceOf(HTMLInputElement);
			expect(screen.getByLabelText(/cpf/i)).toBeInstanceOf(HTMLInputElement);
			expect(screen.getByLabelText(/email/i)).toBeInstanceOf(HTMLInputElement);
			expect(screen.getByLabelText(/observações/i)).toBeInstanceOf(HTMLTextAreaElement);
		});

		test("renders submit button without negative tabindex", () => {
			render(<Page />);

			const submitButton = screen.getByRole("button", { name: /enviar cadastro/i });
			expect(submitButton).not.toHaveAttribute("tabindex", "-1");
		});

		test("renders descriptive help text for form inputs", () => {
			render(<Page />);

			expect(screen.getByText(/seu nome completo/i)).toBeInTheDocument();
			expect(screen.getByText(/cadastro de pessoa física/i)).toBeInTheDocument();
			expect(screen.getByText(/usaremos para contatá-lo/i)).toBeInTheDocument();
		});
	});

	describe("responsive behavior", () => {
		test("renders form container with max-width constraint", () => {
			render(<Page />);

			const formContainer = screen.getByRole("main").querySelector(".max-w-md");
			expect(formContainer).toBeInTheDocument();
		});

		test("renders form element with vertical spacing between fields", () => {
			render(<Page />);

			const form = document.querySelector("form");
			expect(form).toHaveClass("space-y-6");
		});
	});
});
