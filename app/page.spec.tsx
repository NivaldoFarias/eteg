import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Page from "./page";

vi.mock("@/components/customer-form", () => ({
	CustomerForm: () => <div data-testid="customer-form">Mocked Customer Form</div>,
}));

describe("Customer Registration Page", () => {
	describe("rendering", () => {
		test("renders page header with title", () => {
			render(<Page />);

			const heading = screen.getByRole("heading", { level: 1 });
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent(/cadastro de clientes/i);
		});

		test("renders page description", () => {
			render(<Page />);

			expect(
				screen.getByText(/preencha o formulário abaixo para registrar um novo cliente/i),
			).toBeInTheDocument();
		});

		test("renders customer form component", () => {
			render(<Page />);

			expect(screen.getByTestId("customer-form")).toBeInTheDocument();
		});
	});

	describe("layout", () => {
		test("renders main element as page container", () => {
			render(<Page />);

			const main = screen.getByRole("main");
			expect(main).toBeInTheDocument();
		});

		test("renders header element for title section", () => {
			render(<Page />);

			const header = screen.getByRole("banner");
			expect(header).toBeInTheDocument();
		});

		test("applies responsive layout classes", () => {
			render(<Page />);

			const main = screen.getByRole("main");
			expect(main).toHaveClass("flex", "flex-1", "flex-col", "items-center", "justify-center");
		});
	});

	describe("accessibility", () => {
		test("has proper heading hierarchy", () => {
			render(<Page />);

			const h1 = screen.getByRole("heading", { level: 1 });
			expect(h1).toBeInTheDocument();

			const allH1s = screen.getAllByRole("heading", { level: 1 });
			expect(allH1s).toHaveLength(1);
		});

		test("header is contained within banner landmark", () => {
			render(<Page />);

			const banner = screen.getByRole("banner");
			const heading = screen.getByRole("heading", { level: 1 });

			expect(banner).toContainElement(heading);
		});
	});
});
