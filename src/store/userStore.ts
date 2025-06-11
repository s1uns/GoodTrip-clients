import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockedUser, ROLE_USER } from "../shared/constants/user";
import {
	LoginCredentials,
	RegistrationCredentials,
} from "../shared/types/auth";

interface User {
	userId: string;
	role: number;
	login: string;
	email: string;
	firstName: string;
	lastName: string;
	username: string;
	token: string;
	bio: string;
	rating: number;
	reviewsCount: number;
	joinDate: string;
}

interface LoginState {
	user: User | null;
	login: (values: LoginCredentials) => Promise<void>;
	register: (values: RegistrationCredentials) => Promise<void>;
	logout: () => void;
}

export const useUserStore = create<LoginState>()(
	persist(
		(set) => ({
			user: null,
			login: async (values) => {
				set({
					user:
						values.email === "illia.teliuk@nure.ua"
							? mockedUser
							: { ...mockedUser, role: ROLE_USER },
				});
			},
			register: async (values) => {
				set({ user: mockedUser });
			},
			logout: () => set({ user: null }),
		}),
		{
			name: "login-storage",
		},
	),
);

// login: async (values) => {
// 	const res = await customRequest<LoginCredentials, User>(
// 		"POST",
// 		"/api/auth/login",
// 		values,
// 	);

// 	if (res.success) {
// 		set({ user: res.data });
// 	} else {
// 		console.log("RES: ", res);
// 		toast.error(res.message);
// 	}
// },

// register: async (values) => {
// 	const res = await customRequest<RegistrationCredentials, User>(
// 		"POST",
// 		"/api/auth/register",
// 		values,
// 	);

// 	if (res.success) {
// 		set({ user: res.data });
// 	} else {
// 		toast.error(res.message);
// 	}
// },
