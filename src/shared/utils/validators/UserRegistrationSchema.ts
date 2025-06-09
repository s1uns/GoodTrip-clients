import * as yup from "yup";
import YupPassword from "yup-password";

YupPassword(yup);

const getUserRegistrationSchema = (t: (key: string) => string) =>
	yup.object().shape({
		email: yup
			.string()
			.email(t("errors.invalid_email"))
			.required(t("errors.email_required")),
		firstName: yup.string().required(t("errors.first_name_required")),
		lastName: yup.string().required(t("errors.last_name_required")),
		username: yup.string().required(t("errors.username_required")),
		password: yup
			.string()
			.min(8, t("errors.password_min_length"))
			.minLowercase(1, t("errors.password_lowercase"))
			.minUppercase(1, t("errors.password_uppercase"))
			.minNumbers(1, t("errors.password_number"))
			.required(t("errors.password_required")),
		passwordConfirmation: yup
			.string()
			.oneOf(
				[yup.ref("password"), undefined],
				t("errors.password_mismatch"),
			)
			.required(t("errors.password_confirmation_required")),
	});

export default getUserRegistrationSchema;
