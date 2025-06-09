import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import { Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useState } from "react";

import LanguageChangerButton from "../../../../shared/components/LanguageChanger";
import Input from "../../../../shared/components/Input";

const initialValues = {
	email: "",
	code: "",
	newPassword: "",
};

const RestorePasswordForm = () => {
	const [step, setStep] = useState(1);
	const [serverErrors, setServerErrors] = useState<string | null>(null);
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleNext = () => setStep(step + 1);
	const handleBack = () =>
		step === 1 ? navigate("/login") : setStep(step - 1);

	const handleSubmit = (values: typeof initialValues) => {
		console.log("Submit values:", values);
	};

	return (
		<FormContainer>
			<TranslateButtonContainer>
				<LanguageChangerButton />
			</TranslateButtonContainer>

			<FormHeader>
				<HeaderTitle>{t("restorePassword")}</HeaderTitle>
				<HeaderDescription>
					{t("restorePasswordDescription")}
				</HeaderDescription>
			</FormHeader>

			<Formik initialValues={initialValues} onSubmit={handleSubmit}>
				{({ errors, touched }) => (
					<StyledForm>
						{step === 1 && (
							<Field
								name="email"
								placeholder={t("email")}
								component={Input}
								error={touched.email && errors.email}
							/>
						)}

						{step === 2 && (
							<Field
								name="code"
								placeholder={t("verificationCode")}
								component={Input}
								error={touched.code && errors.code}
							/>
						)}

						{step === 3 && (
							<Field
								name="newPassword"
								type="password"
								placeholder={t("newPassword")}
								component={Input}
								error={
									touched.newPassword && errors.newPassword
								}
							/>
						)}

						{serverErrors ? (
							<Typography color="error">
								{serverErrors}
							</Typography>
						) : (
							<Spacer />
						)}

						<ButtonContainer>
							<BackButton type="button" onClick={handleBack}>
								{t("back")}
							</BackButton>

							{step < 3 ? (
								<NextButton type="button" onClick={handleNext}>
									{t("next")}
								</NextButton>
							) : (
								<NextButton type="submit">
									{t("confirm")}
								</NextButton>
							)}
						</ButtonContainer>
					</StyledForm>
				)}
			</Formik>
		</FormContainer>
	);
};

export default RestorePasswordForm;

const FormContainer = styled.div`
	width: 100%;
	max-width: 400px;
	padding: 50px 24px;
	border-radius: 20px;
	background-color: white;
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
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
`;

const HeaderDescription = styled.div`
	font-size: 16px;
	font-weight: 400;
	color: #837e84;
	margin-top: 8px;
`;

const StyledForm = styled(Form)`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
`;

const ButtonContainer = styled.div`
	display: flex;
	width: 100%;
	gap: 8px;
	justify-content: space-between;
`;

const NextButton = styled(Button)`
	background-color: black;
	color: white;
	font-size: 16px;
	flex: 1;

	&:hover {
		background-color: #333;
	}
`;

const BackButton = styled(Button)`
	background-color: #ddd;
	color: black;
	font-size: 16px;
	flex: 1;

	&:hover {
		background-color: #bbb;
	}
`;

const Spacer = styled.div`
	height: 24px;
`;
