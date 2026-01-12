"use client";

import { useEffect } from "react";

import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/**
 * Error Boundary for the application
 *
 * Catches runtime errors in the app and displays a user-friendly error message
 * with an option to retry. Follows Next.js App Router error handling conventions.
 *
 * @param props Error boundary props containing the error and reset function
 *
 * @returns Error UI component
 */
export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps): ReactElement {
	useEffect(() => {
		console.error("Application error:", error);
	}, [error]);

	return (
		<main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-6 text-center">
				<ErrorIcon />
				<ErrorContent />
				<ErrorActions />
			</div>
		</main>
	);

	/** Error icon display */
	function ErrorIcon(): ReactElement {
		return (
			<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
				<svg
					className="h-8 w-8 text-red-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth={2}
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			</div>
		);
	}

	/** Error content with title and description */
	function ErrorContent(): ReactElement {
		return (
			<div className="space-y-2">
				<h1 className="text-2xl font-bold tracking-tight text-gray-900">Algo deu errado</h1>
				<p className="text-sm text-gray-600">
					Ocorreu um erro inesperado. Por favor, tente novamente.
				</p>
				{error.digest && <p className="text-xs text-gray-400">Código do erro: {error.digest}</p>}
			</div>
		);
	}

	/** Navigate to home page */
	function handleGoHome(): void {
		globalThis.location.href = "/";
	}

	/** Error action buttons */
	function ErrorActions(): ReactElement {
		return (
			<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
				<Button onClick={reset} variant="default">
					Tentar novamente
				</Button>
				<Button onClick={handleGoHome} variant="outline">
					Voltar ao início
				</Button>
			</div>
		);
	}
}
