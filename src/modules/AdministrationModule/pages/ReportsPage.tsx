"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	Search,
	AlertTriangle,
	Loader2,
	X,
	Filter,
	CheckCircle,
	Trash2,
	UserX,
	MessageSquare,
	Calendar,
	User,
	MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Report {
	id: string;
	type: "review" | "reply";
	reportedContentId: string;
	reportedContent: string;
	reportedBy: {
		id: string;
		name: string;
		username: string;
	};
	reportedUser: {
		id: string;
		name: string;
		username: string;
	};
	reason: string;
	description: string;
	status: "pending" | "resolved";
	createdAt: string;
	placeName?: string;
	placeId?: string;
}

const mockReports: Report[] = [
	{
		id: "1",
		type: "review",
		reportedContentId: "review_123",
		reportedContent:
			"This place is absolutely terrible! The staff was rude and the food was disgusting. I would never recommend this dump to anyone. Complete waste of money!",
		reportedBy: {
			id: "user_456",
			name: "Emma Wanderlust",
			username: "emmawanders",
		},
		reportedUser: {
			id: "user_789",
			name: "David Backpacker",
			username: "davidbackpacks",
		},
		reason: "Inappropriate language",
		description:
			"This review contains offensive language and seems unnecessarily harsh.",
		status: "pending",
		createdAt: "2025-01-20T10:30:00Z",
		placeName: "Central Park Cafe",
		placeId: "place_001",
	},
	{
		id: "2",
		type: "reply",
		reportedContentId: "reply_456",
		reportedContent:
			"You're an idiot if you think this place is good. Your taste is garbage and you should stop writing reviews.",
		reportedBy: {
			id: "user_321",
			name: "Marco Explorer",
			username: "marcoexplores",
		},
		reportedUser: {
			id: "user_654",
			name: "Zara Urban",
			username: "zaraurban",
		},
		reason: "Personal attack",
		description: "This reply is a direct personal attack on another user.",
		status: "pending",
		createdAt: "2025-01-19T15:45:00Z",
		placeName: "Louvre Museum",
		placeId: "place_002",
	},
	{
		id: "3",
		type: "review",
		reportedContentId: "review_789",
		reportedContent:
			"I had an amazing time here! The service was excellent and the atmosphere was perfect for a romantic dinner.",
		reportedBy: {
			id: "user_987",
			name: "Sophia Traveler",
			username: "sophiatravels",
		},
		reportedUser: {
			id: "user_147",
			name: "Camila Volcano",
			username: "camilavolcano",
		},
		reason: "Spam/Fake review",
		description:
			"This user has posted identical reviews for multiple different restaurants.",
		status: "resolved",
		createdAt: "2025-01-18T09:15:00Z",
		placeName: "Santorini Sunset Restaurant",
		placeId: "place_003",
	},
	{
		id: "4",
		type: "reply",
		reportedContentId: "reply_321",
		reportedContent:
			"Check out my travel blog at www.example.com for more amazing destinations!",
		reportedBy: {
			id: "user_258",
			name: "Luna Photographer",
			username: "lunaphotos",
		},
		reportedUser: {
			id: "user_369",
			name: "Hassan Nomad",
			username: "hassannomad",
		},
		reason: "Spam/Self-promotion",
		description: "User is promoting their personal website in replies.",
		status: "pending",
		createdAt: "2025-01-17T14:20:00Z",
		placeName: "Machu Picchu",
		placeId: "place_004",
	},
	{
		id: "5",
		type: "review",
		reportedContentId: "review_654",
		reportedContent:
			"This place discriminates against certain groups of people. They refused service based on appearance.",
		reportedBy: {
			id: "user_741",
			name: "Carlos Foodie",
			username: "carlosfoodie",
		},
		reportedUser: {
			id: "user_852",
			name: "Diego Jungle",
			username: "diegojungle",
		},
		reason: "False information",
		description: "This appears to be a false accusation without evidence.",
		status: "pending",
		createdAt: "2025-01-16T11:30:00Z",
		placeName: "Tokyo Skytree Restaurant",
		placeId: "place_005",
	},
	{
		id: "6",
		type: "reply",
		reportedContentId: "reply_987",
		reportedContent:
			"You clearly don't know what you're talking about. Your opinion is worthless.",
		reportedBy: {
			id: "user_159",
			name: "Aria Wellness",
			username: "ariawellness",
		},
		reportedUser: {
			id: "user_753",
			name: "Felix Arctic",
			username: "felixarctic",
		},
		reason: "Harassment",
		description:
			"This user consistently posts hostile replies to other users' reviews.",
		status: "pending",
		createdAt: "2025-01-15T16:45:00Z",
		placeName: "Grand Canyon Viewpoint",
		placeId: "place_006",
	},
	{
		id: "7",
		type: "review",
		reportedContentId: "review_258",
		reportedContent:
			"Great place! 5 stars! Highly recommend! Amazing experience! Perfect location!",
		reportedBy: {
			id: "user_486",
			name: "Ryan Historian",
			username: "ryanhistory",
		},
		reportedUser: {
			id: "user_951",
			name: "Yuki Snow",
			username: "yukisnow",
		},
		reason: "Spam/Low quality",
		description:
			"This review lacks substance and appears to be generic spam.",
		status: "resolved",
		createdAt: "2025-01-14T08:20:00Z",
		placeName: "Bali Rice Terraces",
		placeId: "place_007",
	},
	{
		id: "8",
		type: "reply",
		reportedContentId: "reply_147",
		reportedContent:
			"I can't believe people actually enjoy this overrated tourist trap. Anyone who likes this has no taste.",
		reportedBy: {
			id: "user_357",
			name: "Maya Adventure",
			username: "mayaadventure",
		},
		reportedUser: {
			id: "user_468",
			name: "Elena Wine",
			username: "elenawine",
		},
		reason: "Inappropriate language",
		description:
			"Dismissive and condescending tone towards other travelers.",
		status: "pending",
		createdAt: "2025-01-13T13:10:00Z",
		placeName: "Swiss Alps Lodge",
		placeId: "place_008",
	},
	{
		id: "9",
		type: "review",
		reportedContentId: "review_369",
		reportedContent:
			"The owner of this establishment is involved in illegal activities. I have evidence that they are running a scam.",
		reportedBy: {
			id: "user_642",
			name: "Alex Nomad",
			username: "alexnomad",
		},
		reportedUser: {
			id: "user_579",
			name: "Jamal Safari",
			username: "jamalsafari",
		},
		reason: "Defamation",
		description: "Making serious accusations without providing evidence.",
		status: "pending",
		createdAt: "2025-01-12T12:00:00Z",
		placeName: "French Quarter Hotel",
		placeId: "place_009",
	},
	{
		id: "10",
		type: "reply",
		reportedContentId: "reply_753",
		reportedContent:
			"Visit my Instagram @travelblogger for exclusive travel deals and discounts!",
		reportedBy: {
			id: "user_864",
			name: "Kai Mountain",
			username: "kaimountain",
		},
		reportedUser: {
			id: "user_195",
			name: "Astrid Fjord",
			username: "astridfjord",
		},
		reason: "Spam/Self-promotion",
		description: "Promoting social media accounts in replies.",
		status: "resolved",
		createdAt: "2025-01-11T17:30:00Z",
		placeName: "Lake Tahoe Resort",
		placeId: "place_010",
	},
	{
		id: "11",
		type: "review",
		reportedContentId: "review_951",
		reportedContent:
			"This place gave me food poisoning and I ended up in the hospital for three days.",
		reportedBy: {
			id: "user_753",
			name: "Isabella Coastal",
			username: "bellacoastal",
		},
		reportedUser: {
			id: "user_426",
			name: "Mateo Waterfall",
			username: "mateowaterfall",
		},
		reason: "False information",
		description: "Medical claims without verification.",
		status: "pending",
		createdAt: "2025-01-10T09:45:00Z",
		placeName: "Desert Oasis Spa",
		placeId: "place_011",
	},
	{
		id: "12",
		type: "reply",
		reportedContentId: "reply_426",
		reportedContent:
			"Stop being so negative all the time. Nobody wants to hear your complaints.",
		reportedBy: {
			id: "user_537",
			name: "Nina Forest",
			username: "ninaforest",
		},
		reportedUser: {
			id: "user_681",
			name: "Amara Coral",
			username: "amaracoral",
		},
		reason: "Harassment",
		description: "Dismissive and hostile response to legitimate concerns.",
		status: "pending",
		createdAt: "2025-01-09T14:15:00Z",
		placeName: "Redwood National Park",
		placeId: "place_012",
	},
	{
		id: "13",
		type: "review",
		reportedContentId: "review_681",
		reportedContent:
			"Best place ever! Amazing! Fantastic! Incredible! Must visit! 10/10!",
		reportedBy: {
			id: "user_294",
			name: "Liam Island",
			username: "liamisland",
		},
		reportedUser: {
			id: "user_815",
			name: "Sakura Temple",
			username: "sakuratemple",
		},
		reason: "Spam/Low quality",
		description: "Generic review with excessive exclamation marks.",
		status: "resolved",
		createdAt: "2025-01-08T11:20:00Z",
		placeName: "Ancient Ruins Tour",
		placeId: "place_013",
	},
	{
		id: "14",
		type: "reply",
		reportedContentId: "reply_815",
		reportedContent: "You're wrong and your review is stupid. Delete it.",
		reportedBy: {
			id: "user_628",
			name: "Priya Spiritual",
			username: "priyaspiritual",
		},
		reportedUser: {
			id: "user_372",
			name: "Thor Glacier",
			username: "thorglacier",
		},
		reason: "Personal attack",
		description: "Direct attack on another user's review.",
		status: "pending",
		createdAt: "2025-01-07T16:30:00Z",
		placeName: "Countryside Retreat",
		placeId: "place_014",
	},
	{
		id: "15",
		type: "review",
		reportedContentId: "review_372",
		reportedContent:
			"The staff here are all criminals and thieves. They stole money from my wallet when I wasn't looking.",
		reportedBy: {
			id: "user_149",
			name: "Omar Desert",
			username: "omardesert",
		},
		reportedUser: {
			id: "user_506",
			name: "Fatima Oasis",
			username: "fatimaoasis",
		},
		reason: "Defamation",
		description: "Serious criminal accusations without evidence.",
		status: "pending",
		createdAt: "2025-01-06T10:45:00Z",
		placeName: "Urban Skyline Hotel",
		placeId: "place_015",
	},
];

const REPORTS_PER_PAGE = 8;

const simulateApiCall = (
	page: number,
	pageSize: number,
	searchQuery: string,
	statusFilter: string,
	typeFilter: string,
	delay = 1000,
): Promise<{
	reports: Report[];
	hasMore: boolean;
	total: number;
}> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			let filtered = mockReports.filter((report) => {
				if (searchQuery) {
					const query = searchQuery.toLowerCase();
					if (
						!report.reportedContent.toLowerCase().includes(query) &&
						!report.reportedUser.name
							.toLowerCase()
							.includes(query) &&
						!report.reportedBy.name.toLowerCase().includes(query) &&
						!report.reason.toLowerCase().includes(query) &&
						!(
							report.placeName &&
							report.placeName.toLowerCase().includes(query)
						)
					) {
						return false;
					}
				}

				if (statusFilter !== "all" && report.status !== statusFilter) {
					return false;
				}

				if (typeFilter !== "all" && report.type !== typeFilter) {
					return false;
				}

				return true;
			});

			filtered = filtered.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime(),
			);

			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			const reports = filtered.slice(startIndex, endIndex);
			const hasMore = endIndex < filtered.length;

			resolve({
				reports,
				hasMore,
				total: filtered.length,
			});
		}, delay);
	});
};

export default function AdminReportsPage() {
	const [reports, setReports] = useState<Report[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [totalReports, setTotalReports] = useState(0);

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");

	const [processingActions, setProcessingActions] = useState<Set<string>>(
		new Set(),
	);

	const { t } = useTranslation();

	useEffect(() => {
		setReports([]);
		setCurrentPage(1);
		setHasMore(true);
		fetchReports(true);
	}, [searchQuery, statusFilter, typeFilter]);

	const fetchReports = async (isInitial = false) => {
		if (isInitial) {
			setLoading(true);
		} else {
			setLoadingMore(true);
		}

		try {
			const response = await simulateApiCall(
				isInitial ? 1 : currentPage,
				REPORTS_PER_PAGE,
				searchQuery,
				statusFilter,
				typeFilter,
			);

			if (isInitial) {
				setReports(response.reports);
				setCurrentPage(2);
			} else {
				setReports((prev) => [...prev, ...response.reports]);
				setCurrentPage((prev) => prev + 1);
			}

			setHasMore(response.hasMore);
			setTotalReports(response.total);
		} catch (error) {
			console.error("Error loading reports:", error);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	const handleLoadMore = () => {
		if (!loadingMore && hasMore) {
			fetchReports(false);
		}
	};

	const handleCloseReport = async (reportId: string) => {
		if (!confirm(t("reportsPage.confirmCloseReport"))) return;

		setProcessingActions((prev) => new Set(prev).add(reportId));

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setReports((prev) =>
				prev.map((report) =>
					report.id === reportId
						? { ...report, status: "resolved" }
						: report,
				),
			);

			const reportIndex = mockReports.findIndex((r) => r.id === reportId);
			if (reportIndex !== -1) {
				mockReports[reportIndex].status = "resolved";
			}
		} catch (error) {
			console.error("Error closing report:", error);
		} finally {
			setProcessingActions((prev) => {
				const newSet = new Set(prev);
				newSet.delete(reportId);
				return newSet;
			});
		}
	};

	const handleDeleteContent = async (
		reportId: string,
		contentType: string,
	) => {
		if (
			!confirm(
				t("reportsPage.confirmDeleteContent", {
					contentType: contentType,
				}),
			)
		)
			return;

		setProcessingActions((prev) => new Set(prev).add(reportId));

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setReports((prev) =>
				prev.map((report) =>
					report.id === reportId
						? { ...report, status: "resolved" }
						: report,
				),
			);

			const reportIndex = mockReports.findIndex((r) => r.id === reportId);
			if (reportIndex !== -1) {
				mockReports[reportIndex].status = "resolved";
			}

			alert(
				t("reportsPage.contentDeletedSuccess", {
					contentType:
						contentType.charAt(0).toUpperCase() +
						contentType.slice(1),
				}),
			);
		} catch (error) {
			console.error("Error deleting content:", error);
		} finally {
			setProcessingActions((prev) => {
				const newSet = new Set(prev);
				newSet.delete(reportId);
				return newSet;
			});
		}
	};

	const handleBlockUser = async (
		reportId: string,
		userId: string,
		userName: string,
	) => {
		if (!confirm(t("reportsPage.confirmBlockUser", { userName: userName })))
			return;

		setProcessingActions((prev) => new Set(prev).add(reportId));

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setReports((prev) =>
				prev.map((report) =>
					report.id === reportId
						? { ...report, status: "resolved" }
						: report,
				),
			);

			const reportIndex = mockReports.findIndex((r) => r.id === reportId);
			if (reportIndex !== -1) {
				mockReports[reportIndex].status = "resolved";
			}

			alert(t("reportsPage.userBlockedSuccess", { userName: userName }));
		} catch (error) {
			console.error("Error blocking user:", error);
		} finally {
			setProcessingActions((prev) => {
				const newSet = new Set(prev);
				newSet.delete(reportId);
				return newSet;
			});
		}
	};

	const clearFilters = () => {
		setSearchQuery("");
		setStatusFilter("all");
		setTypeFilter("all");
	};

	const activeFiltersCount = [
		searchQuery,
		statusFilter !== "all",
		typeFilter !== "all",
	].filter(Boolean).length;

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
						<p className="text-muted-foreground">
							{t("reportsPage.loadingReports")}
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-2">
						<AlertTriangle className="w-8 h-8" />
						{t("reportsPage.reportsManagementTitle")}
					</h1>
					<p className="text-muted-foreground mt-1">
						{t("reportsPage.reportsManagementDescription")}
					</p>
				</div>
				{activeFiltersCount > 0 && (
					<Button
						variant="outline"
						onClick={clearFilters}
						className="flex items-center gap-2"
					>
						<X className="h-4 w-4" />
						{t("reportsPage.clearFiltersButton", {
							count: activeFiltersCount,
						})}
					</Button>
				)}
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						{t("reportsPage.searchFilterTitle")}
					</CardTitle>
					<CardDescription>
						{t("reportsPage.searchFilterDescription")}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="search">
								{t("reportsPage.searchReportsLabel")}
							</Label>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="search"
									placeholder={t(
										"reportsPage.searchReportsPlaceholder",
									)}
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="pl-8"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="status-filter">
								{t("reportsPage.reportStatusLabel")}
							</Label>
							<Select
								value={statusFilter}
								onValueChange={setStatusFilter}
							>
								<SelectTrigger id="status-filter">
									<SelectValue
										placeholder={t(
											"reportsPage.filterByStatusPlaceholder",
										)}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										{t("reportsPage.allReports")}
									</SelectItem>
									<SelectItem value="pending">
										{t("reportsPage.pendingReports")}
									</SelectItem>
									<SelectItem value="resolved">
										{t("reportsPage.resolvedReports")}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="type-filter">
								{t("reportsPage.contentTypeLabel")}
							</Label>
							<Select
								value={typeFilter}
								onValueChange={setTypeFilter}
							>
								<SelectTrigger id="type-filter">
									<SelectValue
										placeholder={t(
											"reportsPage.filterByTypePlaceholder",
										)}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										{t("reportsPage.allTypes")}
									</SelectItem>
									<SelectItem value="review">
										{t("reportsPage.reviews")}
									</SelectItem>
									<SelectItem value="reply">
										{t("reportsPage.replies")}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="mb-4">
				<p className="text-muted-foreground">
					{t("reportsPage.showingReports", {
						current: reports.length,
						total: totalReports,
					})}
					{totalReports !== mockReports.length &&
						t("reportsPage.matchFilters", {
							totalFiltered: totalReports,
						})}
				</p>
			</div>

			{reports.length === 0 ? (
				<div className="text-center py-12">
					<AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
					<h3 className="text-lg font-semibold mb-2">
						{t("reportsPage.noReportsFoundTitle")}
					</h3>
					<p className="text-muted-foreground mb-4">
						{totalReports === 0
							? t("reportsPage.noReportsAdjustFilter")
							: t("reportsPage.noReportsAvailable")}
					</p>
					{activeFiltersCount > 0 && (
						<Button variant="outline" onClick={clearFilters}>
							{t("reportsPage.clearAllFiltersButton")}
						</Button>
					)}
				</div>
			) : (
				<>
					<div className="space-y-6">
						{reports.map((report) => (
							<Card
								key={report.id}
								className={
									report.status === "pending"
										? "border-orange-200"
										: ""
								}
							>
								<CardHeader>
									<div className="flex justify-between items-start">
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<Badge
													variant={
														report.type === "review"
															? "default"
															: "secondary"
													}
												>
													{report.type ===
													"review" ? (
														<>
															<MessageSquare className="w-3 h-3 mr-1" />
															{t(
																"reportsPage.reviewType",
															)}
														</>
													) : (
														<>
															<MessageSquare className="w-3 h-3 mr-1" />
															{t(
																"reportsPage.replyType",
															)}
														</>
													)}
												</Badge>
												<Badge
													variant={
														report.status ===
														"pending"
															? "destructive"
															: "default"
													}
												>
													{report.status === "pending"
														? t(
																"reportsPage.pendingStatus",
														  )
														: t(
																"reportsPage.resolvedStatus",
														  )}
												</Badge>
												<span className="text-sm text-muted-foreground flex items-center gap-1">
													<Calendar className="w-3 h-3" />
													{formatDate(
														report.createdAt,
													)}
												</span>
											</div>
											{report.placeName && (
												<div className="flex items-center gap-1 text-sm text-muted-foreground">
													<MapPin className="w-3 h-3" />
													{report.placeName}
												</div>
											)}
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label className="text-sm font-semibold">
											{t(
												"reportsPage.reportedContentLabel",
											)}
											:
										</Label>
										<div className="p-3 bg-muted rounded-lg">
											<p className="text-sm">
												{report.reportedContent}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label className="text-sm font-semibold">
												{t(
													"reportsPage.reportedUserLabel",
												)}
												:
											</Label>
											<div className="flex items-center gap-2">
												<User className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm">
													{report.reportedUser.name}{" "}
													(@
													{
														report.reportedUser
															.username
													}
													)
												</span>
											</div>
										</div>
										<div className="space-y-2">
											<Label className="text-sm font-semibold">
												{t(
													"reportsPage.reportedByLabel",
												)}
												:
											</Label>
											<div className="flex items-center gap-2">
												<User className="w-4 h-4 text-muted-foreground" />
												<span className="text-sm">
													{report.reportedBy.name} (@
													{report.reportedBy.username}
													)
												</span>
											</div>
										</div>
									</div>

									<div className="space-y-2">
										<Label className="text-sm font-semibold">
											{t("reportsPage.reasonLabel")}:
										</Label>
										<p className="text-sm text-orange-600 font-medium">
											{report.reason}
										</p>
									</div>

									<div className="space-y-2">
										<Label className="text-sm font-semibold">
											{t("reportsPage.descriptionLabel")}:
										</Label>
										<p className="text-sm text-muted-foreground">
											{report.description}
										</p>
									</div>

									{report.status === "pending" && (
										<div className="flex flex-wrap gap-2 pt-4 border-t">
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													handleCloseReport(report.id)
												}
												disabled={processingActions.has(
													report.id,
												)}
											>
												{processingActions.has(
													report.id,
												) ? (
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
												) : (
													<CheckCircle className="w-4 h-4 mr-2" />
												)}
												{t(
													"reportsPage.closeReportButton",
												)}
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() =>
													handleDeleteContent(
														report.id,
														report.type,
													)
												}
												disabled={processingActions.has(
													report.id,
												)}
											>
												{processingActions.has(
													report.id,
												) ? (
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
												) : (
													<Trash2 className="w-4 h-4 mr-2" />
												)}
												{t(
													"reportsPage.deleteContentButton",
													{
														contentType: t(
															`reportsPage.${report.type}Item`,
														),
													},
												)}
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() =>
													handleBlockUser(
														report.id,
														report.reportedUser.id,
														report.reportedUser
															.name,
													)
												}
												disabled={processingActions.has(
													report.id,
												)}
											>
												{processingActions.has(
													report.id,
												) ? (
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
												) : (
													<UserX className="w-4 h-4 mr-2" />
												)}
												{t(
													"reportsPage.blockUserButton",
												)}
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>

					{hasMore && (
						<div className="flex justify-center mt-8">
							<Button
								onClick={handleLoadMore}
								disabled={loadingMore}
								variant="outline"
								size="lg"
								className="min-w-[200px]"
							>
								{loadingMore ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										{t("reportsPage.loadingMoreReports")}
									</>
								) : (
									<>
										{t("reportsPage.loadMoreReportsButton")}
										<span className="ml-2 text-muted-foreground">
											({reports.length} of {totalReports})
										</span>
									</>
								)}
							</Button>
						</div>
					)}

					{!hasMore && reports.length > 0 && (
						<div className="text-center mt-8 py-4 border-t">
							<p className="text-muted-foreground">
								{t("reportsPage.endOfReports", {
									count: reports.length,
								})}
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}
