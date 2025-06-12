import customRequest from "../customRequest";

export const getMySubscriptions = async (params?: SubscriptionSearchParams) => {
	const query = new URLSearchParams();
	if (params?.search) query.append("search", params.search);
	if (params?.page) query.append("page", params.page.toString());
	if (params?.pageSize) query.append("pageSize", params.pageSize.toString());
	if (params?.sortField) query.append("sortField", params.sortField);
	if (params?.sortDesc !== undefined)
		query.append("sortDesc", params.sortDesc.toString());

	return customRequest<undefined, PaginatedSubscriptionsResponse>(
		"get",
		`/subscriptions/my?${query.toString()}`,
	);
};

export const getMySubscribers = async (params?: SubscriptionSearchParams) => {
	const query = new URLSearchParams();
	if (params?.search) query.append("search", params.search);
	if (params?.page) query.append("page", params.page.toString());
	if (params?.pageSize) query.append("pageSize", params.pageSize.toString());
	if (params?.sortField) query.append("sortField", params.sortField);
	if (params?.sortDesc !== undefined)
		query.append("sortDesc", params.sortDesc.toString());

	return customRequest<undefined, PaginatedSubscribersResponse>(
		"get",
		`/subscribers/my?${query.toString()}`,
	);
};

export const subscribeToUser = async (userIdToSubscribe: string) => {
	return customRequest<undefined, SubscribeToggleResponse>(
		"post",
		`/users/${userIdToSubscribe}/subscribe`,
	);
};

export const unsubscribeFromUser = async (userIdToUnsubscribe: string) => {
	return customRequest<undefined, SubscribeToggleResponse>(
		"delete",
		`/users/${userIdToUnsubscribe}/subscribe`,
	);
};
