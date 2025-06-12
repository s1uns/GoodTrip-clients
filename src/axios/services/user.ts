import customRequest from "../customRequest";

export const discoverUsers = async (params?: UserSearchParams) => {
	const query = new URLSearchParams();
	if (params?.search) query.append("search", params.search);
	if (params?.page) query.append("page", params.page.toString());
	if (params?.pageSize) query.append("pageSize", params.pageSize.toString());
	if (params?.subscriptionStatus)
		query.append("subscriptionStatus", params.subscriptionStatus);
	if (params?.sortBy) query.append("sortBy", params.sortBy);

	return customRequest<undefined, PaginatedUsersResponse>(
		"get",
		`/users/discover?${query.toString()}`,
	);
};

export const getUserProfile = async (userId: string) => {
	return customRequest<undefined, User>("get", `/users/${userId}/profile`);
};

export const updateMyProfile = async (data: UpdateUserRequestData) => {
	return customRequest<UpdateUserRequestData, User>(
		"put",
		"/users/me/profile",
		data,
	);
};

export const toggleBlockUser = async (userId: string) => {
	return customRequest<undefined, ToggleBlockResponse>(
		"patch",
		`/users/${userId}/toggle-block`,
	);
};
