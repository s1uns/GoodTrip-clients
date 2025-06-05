import styled from "@emotion/styled";
import { Button, IconButton, Drawer } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useCallback, useMemo, useState } from "react";

import { useUserStore } from "../../../../store/userStore";
import logoImg from "../../../../assets/logo.png";
import {
	USER_NAVIGATION_OPTIONS,
	ADMIN_NAVIGATION_OPTIONS,
	NavOption,
} from "../../utils/navigationOptions";
import { ROLE_USER } from "../../../../shared/constants/user";
import { useNavigate } from "react-router-dom";
import LanguageChangerButton from "../../../../shared/components/LanguageChanger";
import { useTranslation } from "react-i18next";

interface HeaderOptionProps extends NavOption {
	navigateToRoute: (route: string) => void;
}

const HeaderOption = ({ title, route, navigateToRoute }: HeaderOptionProps) => {
	const { t } = useTranslation();
	const handleNavigate = useCallback(() => navigateToRoute(route), [route]);
	return <NavButton onClick={handleNavigate}>{t(title)}</NavButton>;
};

const Header = () => {
	const user = useUserStore((state) => state.user);
	const logout = useUserStore((state) => state.logout);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [isMenuOpen, setMenuOpen] = useState(false);

	if (!user) {
		return null;
	}

	const navOptions = useMemo(
		() =>
			user.role === ROLE_USER
				? USER_NAVIGATION_OPTIONS
				: ADMIN_NAVIGATION_OPTIONS,
		[user],
	);

	const navigateHome = useCallback(() => navigate("/"), []);
	const navigateToRoute = useCallback((route: string) => navigate(route), []);

	return (
		<HeaderContainer>
			<LogoContainer onClick={navigateHome}>
				<LogoImg src={logoImg} />
			</LogoContainer>

			<DesktopNav>
				{navOptions.map((option) => (
					<HeaderOption
						key={option.title}
						{...option}
						navigateToRoute={navigateToRoute}
					/>
				))}
				<LanguageChangerButton />
				<LogoutButton onClick={logout}>
					{t("logout")}
					<LogoutIcon />
				</LogoutButton>
			</DesktopNav>

			<MobileNav>
				<IconButton onClick={() => setMenuOpen(true)}>
					<MenuIcon sx={{ color: "#fff", fontSize: 32 }} />
				</IconButton>
			</MobileNav>

			<Drawer
				anchor="right"
				open={isMenuOpen}
				onClose={() => setMenuOpen(false)}
			>
				<DrawerContent>
					<CloseIconButton onClick={() => setMenuOpen(false)}>
						<CloseIcon />
					</CloseIconButton>
					{navOptions.map((option) => (
						<HeaderOption
							key={option.title}
							{...option}
							navigateToRoute={(route) => {
								navigateToRoute(route);
								setMenuOpen(false);
							}}
						/>
					))}
					<LanguageChangerButton />
					<LogoutButton onClick={logout}>
						{t("logout")}
						<LogoutIcon />
					</LogoutButton>
				</DrawerContent>
			</Drawer>
		</HeaderContainer>
	);
};

export default Header;

const HeaderContainer = styled.div`
	background-color: black;
	height: 80px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 20px;
	position: relative;
`;

const LogoContainer = styled.div`
	height: 60px;
	width: 60px;
	cursor: pointer;
`;

const LogoImg = styled.img`
	height: 100%;
	width: 100%;
	object-fit: contain;
`;

const DesktopNav = styled.div`
	display: flex;
	align-items: center;
	gap: 16px;

	@media (max-width: 768px) {
		display: none;
	}
`;

const MobileNav = styled.div`
	display: none;

	@media (max-width: 768px) {
		display: flex;
	}
`;

const DrawerContent = styled.div`
	width: 250px;
	padding: 24px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	background-color: #000;
	height: 100%;

	button {
		color: #fff;
	}
`;

const CloseIconButton = styled(IconButton)`
	align-self: flex-end;
	color: #fff;
`;

const NavButton = styled(Button)`
	color: #fff;
	background-color: transparent;
	text-transform: none;
	font-weight: 500;
	font-size: 20px;
	min-width: 100px;
	border-radius: 8px;
	padding: 6px 12px;
	border: none;
	transition: all 0.3s ease;

	&:hover {
		border: 1px solid #fff;
		background-color: rgba(255, 255, 255, 0.05);
	}
`;

const LogoutButton = styled(Button)`
	color: #000;
	border: 1px solid #fff;
	padding: 8px 16px;
	border-radius: 12px;
	text-transform: none;
	font-weight: 600;
	transition: all 0.3s ease;
	width: 140px;

	@media (min-width: 768px) {
		background-color: #fff;
	}

	&:hover {
		background-color: transparent;
		color: #fff;
		border-color: #fff;
	}

	svg {
		margin-left: 8px;
		font-size: 20px;
	}
`;
