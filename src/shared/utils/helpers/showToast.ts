import { toast } from "react-toastify";

export const showSuccessToast = (message: string) =>
	toast.success(message, { position: "bottom-right" });

export const showErrorToast = (message: string) =>
	toast.error(message, { position: "bottom-right" });

export const showInfoToast = (message: string) =>
	toast.info(message, { position: "bottom-right" });

export const showWarningToast = (message: string) =>
	toast.warning(message, { position: "bottom-right" });
