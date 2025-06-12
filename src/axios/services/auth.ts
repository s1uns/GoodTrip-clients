import customRequest from "./../customRequest";

export const loginUser = async (data: LoginRequestData) => {
	return customRequest<LoginRequestData, LoginResponseData>(
		"post",
		"/auth/login",
		data,
	);
};

export const registerUser = async (data: RegisterRequestData) => {
	const { confirmPassword, ...requestData } = data;
	return customRequest<
		Omit<RegisterRequestData, "confirmPassword">,
		RegisterResponseData
	>("post", "/auth/register", requestData);
};

export const confirmRegistration = async (
	data: ConfirmRegistrationRequestData,
) => {
	return customRequest<
		ConfirmRegistrationRequestData,
		ConfirmRegistrationResponseData
	>("post", "/auth/confirm-registration", data);
};

export const requestPasswordResetEmail = async (
	data: RequestPasswordResetEmailData,
) => {
	return customRequest<
		RequestPasswordResetEmailData,
		RequestPasswordResetEmailResponse
	>("post", "/auth/forgot-password", data);
};

export const verifyResetCode = async (data: VerifyResetCodeRequestData) => {
	return customRequest<
		VerifyResetCodeRequestData,
		VerifyResetCodeResponseData
	>("post", "/auth/verify-reset-code", data);
};

export const setNewPassword = async (data: SetNewPasswordRequestData) => {
	const { confirmNewPassword, ...requestData } = data;
	return customRequest<
		Omit<SetNewPasswordRequestData, "confirmNewPassword">,
		SetNewPasswordResponseData
	>("post", "/auth/reset-password", requestData);
};
