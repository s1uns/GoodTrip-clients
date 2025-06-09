import { ROLE_USER } from "@/shared/constants/user";

export interface NavOption {
	title: string;
	route: string;
}

const USER_NAVIGATION_OPTIONS: NavOption[] = [
	{ title: "Places", route: "places" },
	{ title: "Profile", route: "profile" },
	{ title: "Users", route: "users" },
];

const ADMIN_NAVIGATION_OPTIONS: NavOption[] = [
	{ title: "Preferences", route: "preferences" },
	{ title: "Places", route: "places" },
	{ title: "Reports", route: "reports" },
	{ title: "Users", route: "users" },
];

export const getLocalizedNavigation = (
	role: number,
	t: (key: string) => string,
): NavOption[] => {
	const navOptions =
		role === ROLE_USER ? USER_NAVIGATION_OPTIONS : ADMIN_NAVIGATION_OPTIONS;

	return navOptions.map(({ route }) => ({
		route,
		title: t(`navigation.${route}`),
	}));
};
