import * as yup from "yup";

const getUserLoginSchema = (t: (key: string) => string) =>
	yup.object().shape({
		email: yup.string().required(t("errors.email_required")),
		password: yup.string().required(t("errors.password_required")),
	});

export default getUserLoginSchema;
