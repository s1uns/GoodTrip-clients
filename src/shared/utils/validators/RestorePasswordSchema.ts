import * as Yup from "yup";

const getRestorePasswordSchema = (t: any) =>
	Yup.object().shape({
		email: Yup.string().email(t("invalidEmail")).required(t("required")),
		code: Yup.string()
			.required(t("required"))
			.min(4, t("codeTooShort"))
			.max(8, t("codeTooLong")),
	});

export default getRestorePasswordSchema;
