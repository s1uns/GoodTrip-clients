import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
	Typography,
} from "@mui/material";
import { useState } from "react";

import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";

interface RegistrationConfirmationModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (code: string) => Promise<void>;
}

const RegistrationConfirmationModal = ({
	open,
	onClose,
	onConfirm,
}: RegistrationConfirmationModalProps) => {
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const { t } = useTranslation();

	const handleConfirm = async () => {
		try {
			await onConfirm(code);
		} catch (e: any) {
			setError(e.message || t("error.invalidCode"));
		}
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>{t("registration.confirmTitle")}</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label={t("registration.codeLabel")}
					fullWidth
					value={code}
					onChange={(e) => setCode(e.target.value)}
				/>
				{error && (
					<Typography color="error" variant="body2">
						{error}
					</Typography>
				)}
			</DialogContent>
			<DialogActions>
				<CancelButton onClick={onClose}>
					{t("common.cancel")}
				</CancelButton>
				<ConfirmButton onClick={handleConfirm} variant="contained">
					{t("common.confirm")}
				</ConfirmButton>
			</DialogActions>
		</Dialog>
	);
};

export default RegistrationConfirmationModal;

const ConfirmButton = styled(Button)`
	background-color: black;
	color: white;
	font-size: 16px;
	flex: 1;

	&:hover {
		background-color: #333;
	}
`;

const CancelButton = styled(Button)`
	background-color: #ddd;
	color: black;
	font-size: 16px;
	flex: 1;

	&:hover {
		background-color: #bbb;
	}
`;
