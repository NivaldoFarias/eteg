"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import { z } from "zod";

import type { ReactElement } from "react";

import { ApiError, createCustomer } from "@/lib/api";

import { FavoriteColor } from "../../generated/prisma/enums";

import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

/** Form schema for client-side validation before transformation */
const formSchema = z.object({
	fullName: z
		.string()
		.min(2, "Nome completo deve ter no mínimo 2 caracteres")
		.max(255, "Nome completo deve ter no máximo 255 caracteres")
		.trim(),
	cpf: z.string().min(1, "CPF é obrigatório"),
	email: z
		.email("Forneça um endereço de email válido")
		.max(255, "Email deve ter no máximo 255 caracteres"),
	favoriteColor: z.enum(FavoriteColor, { message: "Selecione uma cor válida" }),
	observations: z
		.string()
		.max(1000, "As observações devem ter no máximo 1000 caracteres")
		.optional(),
});

type FormInput = z.infer<typeof formSchema>;

/** Color labels for user-friendly display */
const COLOR_LABELS: Record<FavoriteColor, string> = {
	[FavoriteColor.RED]: "Vermelho",
	[FavoriteColor.ORANGE]: "Laranja",
	[FavoriteColor.YELLOW]: "Amarelo",
	[FavoriteColor.GREEN]: "Verde",
	[FavoriteColor.BLUE]: "Azul",
	[FavoriteColor.INDIGO]: "Índigo",
	[FavoriteColor.VIOLET]: "Violeta",
};

interface CustomerFormProps {
	/** Callback invoked when form submission succeeds */
	onSuccess?: () => void;
}

/**
 * Customer registration form component
 *
 * Provides a form for collecting customer data with client-side validation using
 * react-hook-form and Zod. Submits data to /api/customers endpoint.
 *
 * @param props Component props
 *
 * @returns Form component with all required fields
 *
 * @example
 * ```tsx
 * <CustomerForm onSuccess={() => console.log("Customer registered")} />
 * ```
 */
export function CustomerForm({ onSuccess }: CustomerFormProps): ReactElement {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const form = useForm<FormInput>({
		resolver: zodResolver(formSchema),
		defaultValues: { fullName: "", cpf: "", email: "", favoriteColor: undefined, observations: "" },
	});

	/**
	 * Handles form submission by sending data to API
	 *
	 * @param data Validated customer input data
	 */
	async function onSubmit(data: FormInput): Promise<void> {
		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const response = await createCustomer({
				...data,
				observations: data.observations || null,
			});

			if (response.success) {
				toast.success("Cadastro realizado com sucesso", {
					description: "Seu cadastro foi enviado com sucesso!",
				});
				form.reset();
				onSuccess?.();
			}
		} catch (error) {
			if (error instanceof ApiError) {
				setSubmitError(error.message);
				toast.error("Falha no cadastro", { description: error.message });
			} else {
				const errorMessage = "Ocorreu um erro inesperado. Tente novamente.";
				setSubmitError(errorMessage);
				toast.error("Falha no cadastro", { description: errorMessage });
			}
			console.error("Form submission error:", error);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="fullName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome Completo</FormLabel>
							<FormControl>
								<Input placeholder="Digite seu nome completo" {...field} />
							</FormControl>
							<FormDescription>Seu nome completo</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="cpf"
					render={({ field }) => (
						<FormItem>
							<FormLabel>CPF</FormLabel>
							<FormControl>
								<IMaskInput
									mask="000.000.000-00"
									value={field.value}
									onAccept={(value) => field.onChange(value)}
									onBlur={field.onBlur}
									placeholder="000.000.000-00"
									className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
								/>
							</FormControl>
							<FormDescription>Cadastro de Pessoa Física</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="seu.email@example.com" {...field} />
							</FormControl>
							<FormDescription>Usaremos para contatá-lo</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="favoriteColor"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Cor Favorita</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Selecione sua cor favorita" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{Object.entries(COLOR_LABELS).map(([value, label]) => (
										<SelectItem key={value} value={value}>
											{label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormDescription>Escolha sua cor favorita do arco-íris</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="observations"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Observações (Opcional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Comentários ou notas adicionais..."
									className="min-h-24 resize-none"
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
							<FormDescription>Informações adicionais opcionais</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				{submitError ?
					<div className="rounded-md bg-red-50 p-4 text-sm text-red-800">{submitError}</div>
				:	null}

				<Button type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting ? "Enviando..." : "Enviar Cadastro"}
				</Button>
			</form>
		</Form>
	);
}
