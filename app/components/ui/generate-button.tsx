"use client";

import { RefreshCw } from "lucide-react";

import type { ReactElement } from "react";

import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface GenerateButtonProps {
	/** Click handler that triggers the generation action */
	handleClick: React.MouseEventHandler<HTMLButtonElement>;

	/** Tooltip title text */
	title?: string;

	/** Extra className forwarded to the button */
	className?: string;
}

/** Small utility component that renders a tooltip-wrapped icon button */
export function GenerateButton({
	handleClick,
	title = "Gerar",
	className,
}: GenerateButtonProps): ReactElement {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={handleClick}
					className={className}
					title={title}
					aria-label={title}
				>
					<RefreshCw className="h-4 w-4" />
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>{title}</p>
			</TooltipContent>
		</Tooltip>
	);
}
