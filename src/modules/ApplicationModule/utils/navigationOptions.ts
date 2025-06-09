export const USER_NAVIGATION_OPTIONS: NavOption[] = [
	{
		title: "Places",
		route: "places",
	},
	{
		title: "Profile",
		route: "profile",
	},
	{
		title: "Users",
		route: "users",
	},
];

export const ADMIN_NAVIGATION_OPTIONS: NavOption[] = [
	{
		title: "Preferences",
		route: "preferences",
	},
	{
		title: "Places",
		route: "places",
	},
	{
		title: "Reports",
		route: "reports",
	},
	{
		title: "Users",
		route: "users",
	},
];

export interface NavOption {
	title: string;
	route: string;
}
