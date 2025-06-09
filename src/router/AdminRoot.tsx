import { Route, Navigate } from "react-router-dom";
import { ROUTES } from "../shared/constants/routes";
import {
	PreferencesPage,
	ReportsPage,
	UsersPage,
	AdminPlacesPage,
} from "@/modules/AdministrationModule/pages";

const AdminRoot = () => {
	return (
		<>
			<Route
				path="/"
				element={<Navigate to={ROUTES.REPORTS} replace />}
			/>
			<Route path={ROUTES.USERS} element={<UsersPage />} />
			<Route path={ROUTES.PREFERENCES} element={<PreferencesPage />} />
			<Route path={ROUTES.REPORTS} element={<ReportsPage />} />
			<Route path={ROUTES.PLACES} element={<AdminPlacesPage />} />

			<Route
				path="*"
				element={<Navigate to={ROUTES.REPORTS} replace />}
			/>
		</>
	);
};

export default AdminRoot;
