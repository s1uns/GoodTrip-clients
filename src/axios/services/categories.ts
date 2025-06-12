import customRequest from "../customRequest";

interface CreateCategoryRequestData {
	name: string;
}

interface UpdateCategoryRequestData {
	name: string;
}

export const createCategory = async (data: CreateCategoryRequestData) => {
	return customRequest<CreateCategoryRequestData, TravelCategory>(
		"post",
		"/categories",
		data,
	);
};

export const getCategories = async (params?: SearchParams) => {
	const query = new URLSearchParams();
	if (params?.search) query.append("search", params.search);
	if (params?.page) query.append("page", params.page.toString());
	if (params?.pageSize) query.append("pageSize", params.pageSize.toString());

	return customRequest<undefined, PaginatedResponse<TravelCategory>>(
		"get",
		`/categories?${query.toString()}`,
	);
};

export const updateCategory = async (
	categoryId: string,
	data: UpdateCategoryRequestData,
) => {
	return customRequest<UpdateCategoryRequestData, TravelCategory>(
		"put",
		`/categories/${categoryId}`,
		data,
	);
};

export const deleteCategory = async (categoryId: string) => {
	return customRequest<undefined, { message: string }>(
		"delete",
		`/categories/${categoryId}`,
	);
};
