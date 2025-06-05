import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useState } from "react";

import LanguageChangerButton from "../../../../shared/components/LanguageChanger";
import { RegistrationCredentials } from "../../../../shared/types/auth";
import { useUserStore } from "../../../../store/userStore";
import Input from "../../../../shared/components/Input";
import { getUserRegistrationSchema } from "../../../../shared/utils/validators";

const initialValues: RegistrationCredentials = {
	email: "",
	password: "",
	firstName: "",
	lastName: "",
	username: "",
	passwordConfirmation: "",
};

const RegistrationForm = () => {
	const [serverErrors, setServerErrors] = useState<string | null>(null);
	const register = useUserStore((state) => state.register);
	const { t } = useTranslation();
	const validationSchema = getUserRegistrationSchema(t);

	const handleRegister = async (values: RegistrationCredentials) => {
		values.setErrors = setServerErrors;
		await register(values);
	};

	return (
		<FormWrapper>
			<FormContainer>
				<TranslateButtonContainer>
					<LanguageChangerButton />
				</TranslateButtonContainer>

				<HeaderTitle>{t("createAnAccount")}</HeaderTitle>
				<HeaderDescription>
					{t("registrationDescription")}
				</HeaderDescription>

				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={(values) => handleRegister(values)}
				>
					{({ errors, touched }) => (
						<StyledForm>
							<FullNameContainer>
								<Field
									name="firstName"
									placeholder={t("firstName")}
									component={Input}
									error={
										touched.firstName && errors.firstName
									}
								/>
								<Field
									name="lastName"
									placeholder={t("lastName")}
									component={Input}
									error={touched.lastName && errors.lastName}
								/>
							</FullNameContainer>

							<Field
								name="email"
								placeholder={t("email")}
								component={Input}
								error={touched.email && errors.email}
							/>
							<Field
								name="username"
								placeholder={t("username")}
								component={Input}
								error={touched.username && errors.username}
							/>
							<Field
								name="password"
								type="password"
								placeholder={t("password")}
								component={Input}
								error={touched.password && errors.password}
							/>
							<Field
								name="passwordConfirmation"
								type="password"
								placeholder={t("passwordConfirmation")}
								component={Input}
								error={
									touched.passwordConfirmation &&
									errors.passwordConfirmation
								}
							/>

							{serverErrors ? (
								<Typography color="error">
									{serverErrors}
								</Typography>
							) : (
								"\u00A0"
							)}

							<RegisterButton type="submit">
								{t("register")}
							</RegisterButton>
						</StyledForm>
					)}
				</Formik>

				<BottomBlock>
					<StyledLink to="/login">
						<ChangeFormContainer>
							{t("loginFormLink")}
						</ChangeFormContainer>
					</StyledLink>
				</BottomBlock>
			</FormContainer>
		</FormWrapper>
	);
};

export default RegistrationForm;

const FormWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 40px 20px;
	box-sizing: border-box;
`;

const FormContainer = styled.div`
	width: 100%;
	max-width: 600px;
	background-color: white;
	border-radius: 15px;
	border: 1px solid black;
	padding: 60px 20px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
`;

const TranslateButtonContainer = styled.div`
	position: absolute;
	right: 10px;
	top: 10px;
`;

const HeaderTitle = styled.div`
	font-family: Inter;
	font-size: 40px;
	font-weight: 400;
	color: #13190f;
	text-align: center;

	@media (max-width: 600px) {
		font-size: 32px;
	}
`;

const HeaderDescription = styled.div`
	font-family: Inter;
	font-size: 20px;
	line-height: 30px;
	font-weight: 400;
	color: #837e84;
	margin-top: 10px;
	text-align: center;

	@media (max-width: 600px) {
		font-size: 16px;
		line-height: 24px;
	}
`;

const StyledForm = styled(Form)`
	width: 100%;
	margin-top: 30px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
`;

const FullNameContainer = styled.div`
	width: 100%;
	display: flex;
	gap: 20px;

	@media (max-width: 600px) {
		flex-direction: column;
		gap: 10px;
	}
`;

const RegisterButton = styled(Button)`
	background-color: black;
	color: white;
	font-family: Inter;
	font-weight: 500;
	font-size: 20px;
	width: 100%;
	padding: 12px;
`;

const BottomBlock = styled.div`
	margin-top: 20px;
	display: flex;
	justify-content: center;
	width: 100%;
`;

const ChangeFormContainer = styled.div`
	font-family: Inter;
	color: black;
	font-size: 18px;
	font-weight: 500;
`;

const StyledLink = styled(Link)`
	text-decoration: none;
`;
