import "./globals.css";

import { Inter } from "next/font/google";

import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Eteg - Cadastro de Clientes",
	description: "Sistema de cadastro de clientes",
};

export default function RootLayout({ children }: { children: ReactNode }): ReactElement {
	return (
		<html lang="pt-BR" className={inter.className}>
			<body className="flex min-h-screen flex-col">
				{children}
				<Toaster />
			</body>
		</html>
	);
}
