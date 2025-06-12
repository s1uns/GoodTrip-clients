import { ServerResponse } from "@/shared/types/ServerResponse";
import customRequest from "../customRequest";

export const createReport = (
	data: CreateReportData,
): Promise<ServerResponse<Report>> => {
	return customRequest<CreateReportData, Report>("POST", "/reports", data);
};

export const getReports = (
	params?: GetReportsQueryParams,
): Promise<ServerResponse<Report[]>> => {
	const queryParams = new URLSearchParams();
	if (params?.search) queryParams.append("search", params.search);
	if (params?.status && params.status !== "All Reports")
		queryParams.append("status", params.status);
	if (params?.type && params.type !== "All Types")
		queryParams.append("type", params.type.toString());
	if (params?.page) queryParams.append("page", params.page.toString());
	if (params?.limit) queryParams.append("limit", params.limit.toString());

	const queryString = queryParams.toString();
	const url = queryString
		? `/admin/reports?${queryString}`
		: "/admin/reports";
	return customRequest<void, Report[]>("GET", url);
};

export const closeReport = (
	reportId: string,
): Promise<ServerResponse<Report>> => {
	return customRequest<void, Report>(
		"PATCH",
		`/admin/reports/${reportId}/close`,
	);
};

export const deleteReportedContent = (
	reportId: string,
): Promise<ServerResponse<void>> => {
	return customRequest<void, void>(
		"DELETE",
		`/admin/reports/${reportId}/delete-content`,
	);
};

export const blockUserFromReport = (
	reportId: string,
): Promise<ServerResponse<void>> => {
	return customRequest<void, void>(
		"POST",
		`/admin/reports/${reportId}/block-user`,
	);
};
