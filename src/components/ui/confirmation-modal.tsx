import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title?: string;
	description: string;
	itemName?: string;
	itemType?: string;
	isLoading?: boolean;
	variant?: "destructive" | "warning";
}

export function ConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	itemName,
	itemType = "item",
	isLoading = false,
	variant = "destructive",
}: ConfirmationModalProps) {
	const { t } = useTranslation();
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-300">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-full ${
								variant === "destructive"
									? "bg-red-100 text-red-600"
									: "bg-yellow-100 text-yellow-600"
							}`}
						>
							{variant === "destructive" ? (
								<Trash2 className="h-5 w-5" />
							) : (
								<AlertTriangle className="h-5 w-5" />
							)}
						</div>
						{title ? (
							<div>
								<DialogTitle className="text-left">
									{title}
								</DialogTitle>
							</div>
						) : null}
					</div>
				</DialogHeader>

				<div className="py-4">
					<DialogDescription className="text-sm text-muted-foreground">
						{description}
					</DialogDescription>

					{itemName && (
						<div className="mt-3 p-3 bg-muted rounded-lg">
							<p className="text-sm">
								<span className="font-medium capitalize">
									{itemType || t("common.itemTypeDefault")}
								</span>{" "}
								<span className="font-semibold">
									{itemName}
								</span>
							</p>
						</div>
					)}

					{variant === "destructive" && (
						<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-800">
								<strong>{t("dialog.warning")}:</strong>{" "}
								{t("dialog.destructiveWarningMessage")}
							</p>
						</div>
					)}
				</div>

				<DialogFooter className="gap-2 sm:gap-2">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isLoading}
						className="flex-1 sm:flex-none"
					>
						<X className="w-4 h-4 mr-2" />
						{t("dialog.cancelButton")}
					</Button>
					<Button
						variant={
							variant === "destructive"
								? "destructive"
								: "default"
						}
						onClick={onConfirm}
						disabled={isLoading}
						className="flex-1 sm:flex-none"
					>
						{isLoading ? (
							<>
								<div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
								{t("dialog.deletingButton")}
							</>
						) : (
							<>
								<Trash2 className="w-4 h-4 mr-2" />
								{variant === "destructive"
									? t("dialog.deleteButton")
									: t("dialog.confirmButton")}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
