import { ServerResponse } from "@/shared/types/ServerResponse";
import customRequest from "../customRequest";

export const createReview = (
	data: CreateReviewData,
): Promise<ServerResponse<Review>> => {
	return customRequest<CreateReviewData, Review>("POST", "/reviews", data);
};

export const updateReview = (
	reviewId: string,
	data: UpdateReviewData,
): Promise<ServerResponse<Review>> => {
	return customRequest<UpdateReviewData, Review>(
		"PATCH",
		`/reviews/${reviewId}`,
		data,
	);
};

export const deleteReview = (
	reviewId: string,
): Promise<ServerResponse<void>> => {
	return customRequest<void, void>("DELETE", `/reviews/${reviewId}`);
};

export const likeReview = (
	reviewId: string,
): Promise<ServerResponse<Review>> => {
	return customRequest<void, Review>("POST", `/reviews/${reviewId}/like`);
};

export const dislikeReview = (
	reviewId: string,
): Promise<ServerResponse<Review>> => {
	return customRequest<void, Review>("POST", `/reviews/${reviewId}/dislike`);
};

export const createReply = (
	data: CreateReplyData,
): Promise<ServerResponse<Reply>> => {
	return customRequest<CreateReplyData, Reply>("POST", "/replies", data);
};

export const updateReply = (
	replyId: string,
	data: UpdateReplyData,
): Promise<ServerResponse<Reply>> => {
	return customRequest<UpdateReplyData, Reply>(
		"PATCH",
		`/replies/${replyId}`,
		data,
	);
};

export const deleteReply = (replyId: string): Promise<ServerResponse<void>> => {
	return customRequest<void, void>("DELETE", `/replies/${replyId}`);
};

export const getReviews = (
	params?: GetReviewsQueryParams,
): Promise<ServerResponse<Review[]>> => {
	const queryParams = new URLSearchParams();
	if (params?.page) queryParams.append("page", params.page.toString());
	if (params?.limit) queryParams.append("limit", params.limit.toString());
	if (params?.filter) queryParams.append("filter", params.filter);
	if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

	const queryString = queryParams.toString();
	const url = queryString ? `/reviews?${queryString}` : "/reviews";
	return customRequest<void, Review[]>("GET", url);
};
