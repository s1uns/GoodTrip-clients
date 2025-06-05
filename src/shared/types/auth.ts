import { Dispatch } from "react";

export type LoginCredentials = {
	email: string;
	password: string;
	setErrors?: Dispatch<React.SetStateAction<string | null>>;
};

export type RegistrationCredentials = {
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	password: string;
	passwordConfirmation: string;

	setErrors?: Dispatch<React.SetStateAction<string | null>>;
};
