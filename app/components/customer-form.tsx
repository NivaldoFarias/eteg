"use client";

import { faker } from "@faker-js/faker/locale/pt_BR";
import { zodResolver } from "@hookform/resolvers/zod";
import { generate as generateCpf } from "gerador-validador-cpf";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { toast } from "sonner";
import { z } from "zod";

import type { ReactElement } from "react";

import { ApiError, createCustomer } from "@/lib/api";
import { customerInputSchema } from "@/lib/validations/customer";

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
import { GenerateButton } from "./ui/generate-button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";

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

/** Hex color values for visual indicators */
const COLOR_HEX_VALUES: Record<FavoriteColor, string> = {
	[FavoriteColor.RED]: "#ef4444",
	[FavoriteColor.ORANGE]: "#f97316",
	[FavoriteColor.YELLOW]: "#eab308",
	[FavoriteColor.GREEN]: "#22c55e",
	[FavoriteColor.BLUE]: "#3b82f6",
	[FavoriteColor.INDIGO]: "#6366f1",
	[FavoriteColor.VIOLET]: "#8b5cf6",
};

interface CustomerFormProps {
	/** Callback invoked when form submission succeeds */
	onSuccess?: () => void;

	/**
	 * Flag to enable or disable demo mode
	 *
	 * @default false
	 */
	demoEnabled?: boolean;
}

const formSchema = customerInputSchema.extend({
	observations: z
		.string()
		.max(1000, "As observações devem ter no máximo 1000 caracteres")
		.trim()
		.optional(),
});

type FormSchema = z.infer<typeof formSchema>;

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
export function CustomerForm({ onSuccess, demoEnabled = false }: CustomerFormProps): ReactElement {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		mode: "onSubmit",
		reValidateMode: "onChange",
		defaultValues: { fullName: "", cpf: "", email: "", favoriteColor: undefined, observations: "" },
	});

	/**
	 * Maps error status codes to user-friendly Portuguese messages
	 *
	 * @param error API error instance
	 *
	 * @returns Localized user-friendly error message
	 */
	function getErrorMessage(error: ApiError): string {
		switch (error.statusCode) {
			case 400:
				return error.message || "Dados inválidos. Verifique os campos e tente novamente.";
			case 409:
				return error.message || "CPF ou email já cadastrado.";
			case 429:
				return "Muitas tentativas. Aguarde um momento e tente novamente.";
			case 500:
				return "Erro no servidor. Tente novamente mais tarde.";
			case 503:
				return "Serviço temporariamente indisponível. Tente novamente mais tarde.";
			default:
				return "Ocorreu um erro inesperado. Tente novamente.";
		}
	}

	/**
	 * Handles form submission by sending data to API
	 *
	 * @param data Validated customer input data
	 */
	async function onSubmit(data: FormSchema): Promise<void> {
		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const response = await createCustomer({ ...data, observations: data.observations || null });

			if (response.success) {
				toast.success("Cadastro realizado com sucesso", {
					description: "Seu cadastro foi enviado com sucesso!",
				});
				onSuccess?.();
			}
		} catch (error) {
			if (error instanceof ApiError) {
				const errorMessage = getErrorMessage(error);
				setSubmitError(errorMessage);
				toast.error("Falha no cadastro", { description: errorMessage });
				console.error("API error:", error);
			} else {
				const errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
				setSubmitError(errorMessage);
				console.error("Form submission error:", error);
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" suppressHydrationWarning>
				<FormField
					control={form.control}
					name="fullName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome Completo</FormLabel>
							<div className="flex gap-2">
								<FormControl>
									<Input placeholder="Digite seu nome completo" {...field} />
								</FormControl>
								{demoEnabled ?
									<GenerateButton
										handleClick={() => {
											field.onChange(faker.person.fullName());
										}}
										title="Gerar nome completo (Demo)"
										className="h-9 w-9 shrink-0"
									/>
								:	null}
							</div>
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
							<div className="flex gap-2">
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
								{demoEnabled ?
									<GenerateButton
										handleClick={() => {
											field.onChange(generateCpf());
										}}
										title="Gerar CPF válido (Demo)"
										className="h-9 w-9 shrink-0"
									/>
								:	null}
							</div>
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
							<div className="flex gap-2">
								<FormControl>
									<Input placeholder="seu.email@example.com" {...field} />
								</FormControl>
								{demoEnabled ?
									<GenerateButton
										handleClick={() => {
											field.onChange(faker.internet.email());
										}}
										title="Gerar email (Demo)"
										className="h-9 w-9 shrink-0"
									/>
								:	null}
							</div>
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
											<div className="flex items-center gap-2">
												<div
													className="h-4 w-4 rounded border border-gray-300"
													style={{
														borderRadius: "100%",
														backgroundColor: COLOR_HEX_VALUES[value as FavoriteColor],
													}}
													aria-hidden="true"
												/>
												<span>{label}</span>
											</div>
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
					{isSubmitting ?
						<>
							<Spinner className="mr-2 h-4 w-4" />
							Enviando...
						</>
					:	"Enviar Cadastro"}
				</Button>
			</form>
		</Form>
	);
}
