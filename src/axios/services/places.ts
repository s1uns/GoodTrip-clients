import { ServerResponse } from "@/shared/types/ServerResponse";
import customRequest from "../customRequest";

export const getRecommendedPlaces = (
	params?: GetRecommendedPlacesQueryParams,
): Promise<ServerResponse<Place[]>> => {
	const queryParams = new URLSearchParams();
	if (params?.placeName) queryParams.append("placeName", params.placeName);
	if (params?.city) queryParams.append("city", params.city);
	if (params?.useMyLocation)
		queryParams.append("useMyLocation", params.useMyLocation.toString());
	if (params?.distanceFilter)
		queryParams.append("distanceFilter", params.distanceFilter);
	if (params?.showOnlyFavorites)
		queryParams.append(
			"showOnlyFavorites",
			params.showOnlyFavorites.toString(),
		);
	params?.travelTagIds?.forEach((id) =>
		queryParams.append("travelTagIds", id),
	);
	params?.travelCategoryIds?.forEach((id) =>
		queryParams.append("travelCategoryIds", id),
	);
	if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
	if (params?.userLatitude)
		queryParams.append("userLatitude", params.userLatitude.toString());
	if (params?.userLongitude)
		queryParams.append("userLongitude", params.userLongitude.toString());

	const queryString = queryParams.toString();
	const url = queryString
		? `/places/recommendations?${queryString}`
		: "/places/recommendations";
	return customRequest<void, Place[]>("GET", url);
};

export const toggleFavoritePlace = (
	placeId: string,
): Promise<ServerResponse<void>> => {
	return customRequest<void, void>(
		"POST",
		`/places/${placeId}/toggle-favorite`,
	);
};

export const getPlaceById = (
	placeId: string,
): Promise<ServerResponse<Place>> => {
	return customRequest<void, Place>("GET", `/places/${placeId}`);
};

export const getAdminPlaces = (
	params?: GetAdminPlacesQueryParams,
): Promise<ServerResponse<Place[]>> => {
	const queryParams = new URLSearchParams();
	if (params?.search) queryParams.append("search", params.search);
	if (params?.page) queryParams.append("page", params.page.toString());
	if (params?.limit) queryParams.append("limit", params.limit.toString());

	const queryString = queryParams.toString();
	const url = queryString ? `/admin/places?${queryString}` : "/admin/places";
	return customRequest<void, Place[]>("GET", url);
};

export const createPlace = (
	data: CreateUpdatePlaceData,
): Promise<ServerResponse<Place>> => {
	return customRequest<CreateUpdatePlaceData, Place>(
		"POST",
		"/admin/places",
		data,
	);
};

export const updatePlace = (
	placeId: string,
	data: CreateUpdatePlaceData,
): Promise<ServerResponse<Place>> => {
	return customRequest<CreateUpdatePlaceData, Place>(
		"PUT",
		`/admin/places/${placeId}`,
		data,
	);
};

export const deletePlace = (placeId: string): Promise<ServerResponse<void>> => {
	return customRequest<void, void>("DELETE", `/admin/places/${placeId}`);
};
