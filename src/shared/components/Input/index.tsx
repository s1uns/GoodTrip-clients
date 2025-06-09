import styled from "@emotion/styled";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Typography } from "@mui/material";
import { FieldInputProps } from "formik";
import {
	ChangeEvent,
	FC,
	FocusEventHandler,
	HTMLInputTypeAttribute,
	memo,
	ReactNode,
	useCallback,
	useMemo,
	useState,
} from "react";

interface InputProps {
	autoFocus?: boolean;
	value?: string;
	type?: HTMLInputTypeAttribute;
	placeholder?: string;
	field?: FieldInputProps<string>;
	error?: string;
	endAdornment?: ReactNode;
	ignoreErrors?: boolean;
	width?: string;
	onChange?: (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
	) => void;
	onBlur?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
}

interface PasswordVisibilityProps {
	type: string;
	passwordVisibility: boolean;
	handleChangeVisibility: () => void;
}

const PasswordVisibility = memo(
	({
		type,
		passwordVisibility,
		handleChangeVisibility,
	}: PasswordVisibilityProps) => {
		if (type === "text" && passwordVisibility) {
			return (
				<VisibilityButtonContainer>
					<VisibilityOff onClick={handleChangeVisibility} />
				</VisibilityButtonContainer>
			);
		}

		if (type === "password" && !passwordVisibility) {
			return (
				<VisibilityButtonContainer>
					<Visibility onClick={handleChangeVisibility} />{" "}
				</VisibilityButtonContainer>
			);
		}
		return null;
	},
);

const Input: FC<InputProps> = (props: InputProps) => {
	const {
		autoFocus,
		type,
		placeholder,
		field,
		width = "100%",
		value,
		endAdornment,
		ignoreErrors,
		onChange,
		onBlur,
		error,
	} = props;

	const [passwordVisibility, setPasswordVisibility] =
		useState<boolean>(false);

	const inputValue = field ? field.value : value;
	const name = field ? field.name : "";

	const handleChangeVisibility = useCallback(() => {
		setPasswordVisibility(!passwordVisibility);
	}, [passwordVisibility]);

	const handleChangeValue = (
		e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
	) => {
		if (onChange) {
			onChange(e);
		} else if (field) {
			field.onChange(e);
		}
	};

	const inputType = useMemo(() => {
		if (type === "password" && !passwordVisibility) {
			return "password";
		}
		if (type === "password" && passwordVisibility) {
			return "text";
		}
		if (type) {
			return type;
		}
		return "text";
	}, [type, passwordVisibility]);

	const shouldShowIcon = useMemo(
		() =>
			(inputType === "text" && passwordVisibility) ||
			(inputType === "password" && !passwordVisibility),
		[inputType, passwordVisibility],
	);

	return (
		<InputContainer>
			<InputFieldContainer>
				<TextField
					name={name}
					onChange={handleChangeValue}
					onBlur={field ? field.onBlur : onBlur}
					label={placeholder}
					autoFocus={autoFocus}
					type={inputType}
					value={inputValue}
					placeholder={placeholder}
					InputProps={{
						endAdornment: endAdornment
							? endAdornment
							: shouldShowIcon && (
									<PasswordVisibility
										type={inputType}
										passwordVisibility={passwordVisibility}
										handleChangeVisibility={
											handleChangeVisibility
										}
									/>
							  ),
					}}
					style={{ width, borderRadius: 15 }}
				/>
			</InputFieldContainer>

			{ignoreErrors ? null : (
				<Typography color="error">
					{error ? error : "\u00A0"}
				</Typography>
			)}
		</InputContainer>
	);
};

export default Input;

const InputContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-bottom: 0.01rem;
`;

const InputFieldContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
`;

const VisibilityButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	&:hover {
		cursor: pointer;
	}
`;
