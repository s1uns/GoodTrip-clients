interface LoginRequestData {
	email: string;
	password: string;
}

interface LoginResponseData {
	token: string;
	userId: string;
	userRole: number;
}

interface RegisterRequestData {
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	password: string;
	confirmPassword: string;
}

interface RegisterResponseData {
	userId: string;
	message: string;
}

interface ConfirmRegistrationRequestData {
	email: string;
	code: string;
}

interface ConfirmRegistrationResponseData {
	message: string;
	success: boolean;
}

interface RequestPasswordResetEmailData {
	email: string;
}

interface RequestPasswordResetEmailResponse {
	message: string;
	success: boolean;
}

interface VerifyResetCodeRequestData {
	email: string;
	code: string;
}

interface VerifyResetCodeResponseData {
	message: string;
	success: boolean;
	resetToken?: string;
}

interface SetNewPasswordRequestData {
	email: string;
	newPassword: string;
	confirmNewPassword: string;
}

interface SetNewPasswordResponseData {
	message: string;
	success: boolean;
}

interface TravelCategory {
	categoryId: string;
	name: string;
}

interface TravelTag {
	tagId: string;
	name: string;
}

interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

interface SearchParams {
	search?: string;
	page?: number;
	pageSize?: number;
}

type Subscription = {
	subscriptionId: string;
	firstName: string;
	lastName: string;
	since: string;
	subscribers: number;
	rating: number;
	reviews: number;
};

type Subscriber = {
	subscriberId: string;
	firstName: string;
	lastName: string;
	since: string;
	subscriptions: number;
	rating: number;
	reviews: number;
};

interface SubscriptionSearchParams {
	search?: string;
	page?: number;
	pageSize?: number;
	sortField?: string;
	sortDesc?: boolean;
}

interface PaginatedSubscriptionsResponse {
	items: Subscription[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
	totalSubscriptionsCount: number;
}

interface PaginatedSubscribersResponse {
	items: Subscriber[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
	totalSubscribersCount: number;
}

interface SubscribeToggleResponse {
	message: string;
	isSubscribed: boolean;
}

interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	bio?: string;
	travelTags: string[];
	travelCategories: string[];
	userRating: number;
	reviewsWritten: number;
	joinedDate: string;
	username?: string;
	followers?: number;
	following?: number;
	isBlocked?: boolean;
}

interface UserSearchParams {
	search?: string;
	page?: number;
	pageSize?: number;
	subscriptionStatus?: "All Users" | "Subscribed" | "Not Subscribed";
	sortBy?: "Highest Rating" | "Lowest Rating" | "Newest" | "Oldest";
}

interface PaginatedUsersResponse {
	items: User[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
}

interface UpdateUserRequestData {
	firstName?: string;
	lastName?: string;
	email?: string;
	bio?: string;
	travelTags?: string[];
	travelCategories?: string[];
}

interface ToggleBlockResponse {
	message: string;
	isBlocked: boolean;
}

interface Review {
	id: string;
	rating: number;
	text: string;
	photos?: string[];
	userId: string;
	createdAt: string;
	updatedAt: string;
	replies: Reply[];
	likes: number;
	dislikes: number;
}

interface Reply {
	id: string;
	text: string;
	reviewId: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

interface CreateReviewData {
	rating: number;
	text: string;
	photos?: string[];
}

interface CreateReplyData {
	text: string;
	reviewId: string;
}

interface UpdateReviewData {
	rating?: number;
	text?: string;
	photos?: string[];
}

interface UpdateReplyData {
	text: string;
}

interface GetReviewsQueryParams {
	page?: number;
	limit?: number;
	filter?: "all" | "positive" | "negative";
	sortBy?: "newest" | "oldest" | "highestRating" | "lowestRating";
}

enum ReportReasonValue {
	SEXUAL_HARASSMENT = 0,
	EXTREMISM = 1,
	HATE_SPEECH = 2,
	SPAM = 3,
	OTHER = 4,
}

const reportReasons = [
	{ label: "Sexual Harassment", value: ReportReasonValue.SEXUAL_HARASSMENT },
	{ label: "Extremism", value: ReportReasonValue.EXTREMISM },
	{ label: "Hate Speech", value: ReportReasonValue.HATE_SPEECH },
	{ label: "Spam", value: ReportReasonValue.SPAM },
	{ label: "Other", value: ReportReasonValue.OTHER },
];

enum ReportEntityType {
	REVIEW = 1,
	REPLY = 2,
}

const ENTITY_REVIEW = ReportEntityType.REVIEW;
const ENTITY_REPLY = ReportEntityType.REPLY;

enum ReportStatus {
	PENDING = "Pending",
	RESOLVED = "Resolved",
	CLOSED = "Closed",
}

interface Report {
	id: string;
	contentId: string;
	contentType: ReportEntityType;
	reason: ReportReasonValue;
	details?: string;
	reportedByUserId: string;
	reportedUserId: string;
	status: ReportStatus;
	createdAt: string;
	updatedAt: string;
	reportedContent: string;
}

interface CreateReportData {
	contentId: string;
	contentType: ReportEntityType;
	reason: ReportReasonValue;
	details?: string;
}

interface GetReportsQueryParams {
	search?: string;
	status?: ReportStatus | "All Reports";
	type?: ReportEntityType | "All Types";
	page?: number;
	limit?: number;
}

interface Place {
	id: string;
	name: string;
	address: string;
	imageUrl: string;
	categories: TravelCategory[];
	tags: TravelTag[];
	rating: number;
	reviewsCount: number;
	isFavorite: boolean;
	latitude?: number;
	longitude?: number;
}

interface GetRecommendedPlacesQueryParams {
	placeName?: string;
	city?: string;
	useMyLocation?: boolean;
	distanceFilter?: "none" | "short" | "medium" | "long";
	showOnlyFavorites?: boolean;
	travelTagIds?: string[];
	travelCategoryIds?: string[];
	sortBy?: "ratingHighLow" | "ratingLowHigh" | "newest" | "oldest";
	userLatitude?: number;
	userLongitude?: number;
}

interface CreateUpdatePlaceData {
	name: string;
	address: string;
	imageUrl: string;
	categoryIds: string[];
	tagIds: string[];
	latitude?: number;
	longitude?: number;
}

interface GetAdminPlacesQueryParams {
	search?: string;
	page?: number;
	limit?: number;
}
