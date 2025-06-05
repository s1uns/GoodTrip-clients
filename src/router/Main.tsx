import styled from "@emotion/styled";
import { Suspense, useMemo } from "react";
import { Routes } from "react-router-dom";

import GuestRoot from "./GuestRoot";
import { useUserStore } from "../store/userStore";
import ClientRoot from "./ClientRoot";
import { ROLE_ADMINISTRATOR, ROLE_USER } from "../shared/constants/user";
import AdminRoot from "./AdminRoot";
import { Header } from "../modules/ApplicationModule/components";

const Main = () => {
	const user = useUserStore((state) => state.user);

	const PreparedRoot = useMemo(() => {
		if (!user) {
			return GuestRoot;
		}

		if (user && user.role === ROLE_USER) {
			return ClientRoot;
		}

		if (user && user.role === ROLE_ADMINISTRATOR) {
			return AdminRoot;
		}

		return GuestRoot;
	}, [user]);

	return (
		<Suspense fallback={<LoaderContainer>Loading...</LoaderContainer>}>
			{user ? <Header /> : null}
			<RoutesContainer>
				<Routes>{PreparedRoot()}</Routes>
			</RoutesContainer>
		</Suspense>
	);
};

export default Main;

const LoaderContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const RoutesContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow-y: auto;
`;
