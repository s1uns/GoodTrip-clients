
import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
	options: { label: string; value: string }[];
	selected: string[];
	onChange: (selected: string[]) => void;
	placeholder?: string;
	disabled?: boolean;
}

export function MultiSelect({
	options,
	selected,
	onChange,
	placeholder = "Select items...",
	disabled = false,
}: MultiSelectProps) {
	const [open, setOpen] = React.useState(false);

	const handleUnselect = (item: string) => {
		if (disabled) return;
		onChange(selected.filter((i) => i !== item));
	};

	const handleSelect = (item: string) => {
		if (disabled) return;
		if (selected.includes(item)) {
			handleUnselect(item);
		} else {
			onChange([...selected, item]);
		}
	};

	const handleTriggerClick = () => {
		if (disabled) return;
		setOpen(!open);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (disabled) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setOpen(!open);
		}
	};


	React.useEffect(() => {
		if (disabled && open) {
			setOpen(false);
		}
	}, [disabled, open]);

	return (
		<Popover
			open={open && !disabled}
			onOpenChange={(newOpen) => !disabled && setOpen(newOpen)}
		>
			<PopoverTrigger asChild>
				<div
					role="combobox"
					aria-expanded={open && !disabled}
					aria-disabled={disabled}
					className={cn(
						"flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs",
						!disabled &&
							"cursor-pointer hover:bg-accent hover:text-accent-foreground",
						!disabled &&
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						disabled && "cursor-not-allowed opacity-50 bg-muted",
					)}
					tabIndex={disabled ? -1 : 0}
					onKeyDown={handleKeyDown}
					onClick={handleTriggerClick}
				>
					<div className="flex flex-wrap gap-1 flex-1 min-h-[20px]">
						{selected.length > 0 ? (
							selected.map((item) => (
								<Badge
									variant="secondary"
									key={item}
									className={cn(
										"text-xs",
										disabled && "opacity-50",
									)}
									onClick={(e) => {
										e.stopPropagation();
										handleUnselect(item);
									}}
								>
									{
										options.find(
											(option) => option.value === item,
										)?.label
									}
									{!disabled && (
										<button
											className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleUnselect(item);
												}
											}}
											onMouseDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
											}}
											onClick={(e) => {
												e.stopPropagation();
												handleUnselect(item);
											}}
										>
											<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
										</button>
									)}
								</Badge>
							))
						) : (
							<span
								className={cn(
									"text-muted-foreground text-sm",
									disabled && "opacity-50",
								)}
							>
								{placeholder}
							</span>
						)}
					</div>
					<ChevronDown
						className={cn(
							"h-4 w-4 opacity-50 shrink-0",
							disabled && "opacity-25",
						)}
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<Command>
					<CommandInput placeholder="Search..." />
					<CommandList>
						<CommandEmpty>No item found.</CommandEmpty>
						<CommandGroup className="max-h-64 overflow-auto">
							{options.map((option) => (
								<CommandItem
									key={option.value}
									onSelect={() => handleSelect(option.value)}
								>
									<div
										className={cn(
											"mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
											selected.includes(option.value)
												? "bg-primary text-primary-foreground"
												: "opacity-50 [&_svg]:invisible",
										)}
									>
										<X className="h-4 w-4" />
									</div>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
