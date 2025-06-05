import styled from "@emotion/styled";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "../shared/constants/routes";
import {
	LoginPage,
	RegistrationPage,
} from "../modules/AuthenticationModule/pages";

const GuestRoot = () => {
	return (
		<>
			<Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
			<Route path={ROUTES.LOGIN} element={<LoginPage />} />
			<Route path={ROUTES.REGISTRATION} element={<RegistrationPage />} />
			<Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
		</>
	);
};

export default GuestRoot;
