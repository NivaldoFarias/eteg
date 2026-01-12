import Image from "next/image";

import type { ReactElement } from "react";

import { CustomerForm } from "@/components/customer-form";

/**
 * Customer Registration Page
 *
 * Main page displaying the customer registration form with a responsive,
 * centered layout. Collects customer data and persists to PostgreSQL.
 *
 * @returns Page component with registration form
 */
export default function Page(): ReactElement {
	return (
		<main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<Header />
				<CustomerForm />
			</div>
		</main>
	);

	/** Page header with title and description */
	function Header(): ReactElement {
		return (
			<header className="text-center">
				<Image
					src="/android-chrome-512x512.png"
					alt="Eteg Logo"
					width={64}
					height={64}
					preload={true}
					className="mx-auto mb-4"
				/>
				<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
					Cadastro de Clientes
				</h1>
				<p className="mt-2 text-sm text-gray-600 sm:text-base">
					Preencha o formulário abaixo para registrar um novo cliente
				</p>
			</header>
		);
	}
}
