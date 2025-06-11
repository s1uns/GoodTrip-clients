import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import LanguageChangerButton from "../../../../shared/components/LanguageChanger";
import { LoginCredentials } from "../../../../shared/types/auth";
import { useUserStore } from "../../../../store/userStore";
import Input from "../../../../shared/components/Input";
import { getUserLoginSchema } from "@/shared/utils/validators";

const initialValues: LoginCredentials = {
	email: "",
	password: "",
};

const LoginForm = () => {
	const [serverErrors, setServerErrors] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const login = useUserStore((state) => state.login);
	const { t } = useTranslation();
	const validationSchema = getUserLoginSchema(t);


	const handleLogin = async (values: LoginCredentials) => {
		values.setErrors = setServerErrors;
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 600));

		await login(values);
		setLoading(false);
	};

	return (
		<FormContainer>
			<TranslateButtonContainer>
				<LanguageChangerButton />
			</TranslateButtonContainer>

			<FormHeader>
				<HeaderTitle>{t("login")}</HeaderTitle>
				<HeaderDescription>{t("loginDescription")}</HeaderDescription>
			</FormHeader>

			<Formik
				initialValues={initialValues}
				validationSchema={validationSchema}
				onSubmit={(values) => handleLogin(values)}
			>
				{({ errors, touched }) => (
					<StyledForm>
						<Field
							name="email"
							placeholder={t("email")}
							component={Input}
							error={touched.email && errors.email}
						/>
						<Field
							name="password"
							type="password"
							placeholder={t("password")}
							component={Input}
							error={touched.password && errors.password}
						/>

						{serverErrors ? (
							<Typography color="error">
								{serverErrors}
							</Typography>
						) : (
							<Spacer />
						)}

						<LoginButton type="submit">
							{loading ? t("loginProcess") : t("login")}
						</LoginButton>

						<StyledLink to="/restore-password">
							<ForgotPasswordText>
								{t("forgotPassword")}
							</ForgotPasswordText>
						</StyledLink>
					</StyledForm>
				)}
			</Formik>

			<BottomBlock>
				<StyledLink to="/register">
					<ChangeFormContainer>
						{t("registerFormLink")}
					</ChangeFormContainer>
				</StyledLink>
			</BottomBlock>
		</FormContainer>
	);
};

export default LoginForm;

const FormContainer = styled.div`
	width: 100%;
	max-width: 400px;
	padding: 32px 24px;
	border-radius: 20px;
	background-color: white;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;

	@media (max-width: 768px) {
		padding: 24px 16px;
	}
`;

const TranslateButtonContainer = styled.div`
	position: absolute;
	right: 16px;
	top: 16px;
`;

const FormHeader = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-bottom: 24px;
`;

const HeaderTitle = styled.div`
	font-size: 36px;
	font-weight: 600;
	color: #13190f;

	@media (max-width: 768px) {
		font-size: 28px;
	}
	@media (max-width: 480px) {
		font-size: 24px;
	}
`;

const HeaderDescription = styled.div`
	font-size: 16px;
	font-weight: 400;
	color: #837e84;
	margin-top: 8px;

	@media (max-width: 768px) {
		font-size: 14px;
	}
`;

const StyledForm = styled(Form)`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
`;

const LoginButton = styled(Button)`
	background-color: black;
	color: white;
	font-size: 18px;
	width: 100%;
	font-weight: 500;
	padding: 10px 0;

	&:hover {
		background-color: #333;
	}
`;

const BottomBlock = styled.div`
	margin-top: 32px;
	display: flex;
	justify-content: center;
	width: 100%;
`;

const ChangeFormContainer = styled.div`
	font-size: 16px;
	font-weight: 500;
	color: black;
`;

const StyledLink = styled(Link)`
	text-decoration: none;
`;

const ForgotPasswordText = styled.div`
	font-size: 14px;
	color: black;
	opacity: 0.7;

	&:hover {
		text-decoration: underline;
	}
`;

const Spacer = styled.div`
	height: 24px;
`;
