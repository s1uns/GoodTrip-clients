import { Route, Navigate } from "react-router-dom";
import { ROUTES } from "../shared/constants/routes";
import {
	DifferentUserProfilePage,
	UserProfilePage,
	UsersPage,
} from "../modules/ProfileModule/pages";
import { PlacesPage, PlacePage } from "../modules/PlacesModule/pages";

const ClientRoot = () => {
	return (
		<>
			<Route
				path="/"
				element={<Navigate to={ROUTES.PROFILE} replace />}
			/>

			<Route path={ROUTES.PROFILE} element={<UserProfilePage />} />
			<Route path={ROUTES.USERS} element={<UsersPage />} />
			<Route
				path={`${ROUTES.PROFILE}/:userId`}
				element={<DifferentUserProfilePage />}
			/>

			<Route path={ROUTES.PLACES} element={<PlacesPage />} />
			<Route path={`${ROUTES.PLACES}/:placeId`} element={<PlacePage />} />
			<Route
				path="*"
				element={<Navigate to={ROUTES.PROFILE} replace />}
			/>
		</>
	);
};

export default ClientRoot;
