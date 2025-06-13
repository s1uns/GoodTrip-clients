import customRequest from "../customRequest";

interface CreateTagRequestData {
	name: string;
}

interface UpdateTagRequestData {
	name: string;
}

export const createTag = async (data: CreateTagRequestData) => {
	return customRequest<CreateTagRequestData, TravelTag>(
		"post",
		"/tags",
		data,
	);
};

export const getTags = async (params?: SearchParams) => {
	const query = new URLSearchParams();
	if (params?.search) query.append("search", params.search);
	if (params?.page) query.append("page", params.page.toString());
	if (params?.pageSize) query.append("pageSize", params.pageSize.toString());

	return customRequest<undefined, PaginatedResponse<TravelTag>>(
		"get",
		`/tags?${query.toString()}`,
	);
};

export const updateTag = async (tagId: string, data: UpdateTagRequestData) => {
	return customRequest<UpdateTagRequestData, TravelTag>(
		"put",
		`/tags/${tagId}`,
		data,
	);
};

export const deleteTag = async (tagId: string) => {
	return customRequest<undefined, { message: string }>(
		"delete",
		`/tags/${tagId}`,
	);
};
