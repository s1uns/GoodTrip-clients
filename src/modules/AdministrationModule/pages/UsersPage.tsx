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
import { Switch } from "@/components/ui/switch";
import {
	Search,
	Users,
	Loader2,
	X,
	Filter,
	Shield,
	UserCheck,
	UserX,
	ArrowUpDown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { convertDateToDDMonYYYY } from "@/shared/utils/helpers/convertDateToDDMonYYYY";
import useDebounce from "@/shared/utils/hooks/useDebounce";

interface AdminUser {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	status: "active" | "blocked";
	joinDate: string;
	lastActive: string;
	reviewsCount: number;
	reportsCount: number;
}

const mockAdminUsers: AdminUser[] = [
	{
		id: "1",
		firstName: "Emma",
		lastName: "Wanderlust",
		username: "emmawanders",
		email: "emma.wanderlust@example.com",
		status: "active",
		joinDate: "2025-03-15",
		lastActive: "2025-01-20",
		reviewsCount: 156,
		reportsCount: 0,
	},
	{
		id: "2",
		firstName: "Marco",
		lastName: "Explorer",
		username: "marcoexplores",
		email: "marco.explorer@example.com",
		status: "active",
		joinDate: "2025-01-20",
		lastActive: "2025-01-19",
		reviewsCount: 94,
		reportsCount: 1,
	},
	{
		id: "3",
		firstName: "Sophia",
		lastName: "Traveler",
		username: "sophiatravels",
		email: "sophia.traveler@example.com",
		status: "blocked",
		joinDate: "2025-06-10",
		lastActive: "2025-01-15",
		reviewsCount: 128,
		reportsCount: 3,
	},
	{
		id: "4",
		firstName: "Alex",
		lastName: "Nomad",
		username: "alexnomad",
		email: "alex.nomad@example.com",
		status: "active",
		joinDate: "2025-05-05",
		lastActive: "2025-01-21",
		reviewsCount: 89,
		reportsCount: 0,
	},
	{
		id: "5",
		firstName: "Maya",
		lastName: "Adventure",
		username: "mayaadventure",
		email: "maya.adventure@example.com",
		status: "active",
		joinDate: "2025-05-12",
		lastActive: "2025-01-18",
		reviewsCount: 203,
		reportsCount: 0,
	},
	{
		id: "6",
		firstName: "Carlos",
		lastName: "Foodie",
		username: "carlosfoodie",
		email: "carlos.foodie@example.com",
		status: "active",
		joinDate: "2025-04-08",
		lastActive: "2025-01-17",
		reviewsCount: 167,
		reportsCount: 2,
	},
	{
		id: "7",
		firstName: "Luna",
		lastName: "Photographer",
		username: "lunaphotos",
		email: "luna.photographer@example.com",
		status: "active",
		joinDate: "2025-02-28",
		lastActive: "2025-01-20",
		reviewsCount: 145,
		reportsCount: 0,
	},
	{
		id: "8",
		firstName: "David",
		lastName: "Backpacker",
		username: "davidbackpacks",
		email: "david.backpacker@example.com",
		status: "blocked",
		joinDate: "2025-03-14",
		lastActive: "2025-01-10",
		reviewsCount: 234,
		reportsCount: 5,
	},
	{
		id: "9",
		firstName: "Aria",
		lastName: "Wellness",
		username: "ariawellness",
		email: "aria.wellness@example.com",
		status: "active",
		joinDate: "2025-05-22",
		lastActive: "2025-01-19",
		reviewsCount: 98,
		reportsCount: 0,
	},
	{
		id: "10",
		firstName: "Ryan",
		lastName: "Historian",
		username: "ryanhistory",
		email: "ryan.historian@example.com",
		status: "active",
		joinDate: "2025-12-03",
		lastActive: "2025-01-16",
		reviewsCount: 189,
		reportsCount: 1,
	},
	{
		id: "11",
		firstName: "Isabella",
		lastName: "Coastal",
		username: "bellacoastal",
		email: "isabella.coastal@example.com",
		status: "active",
		joinDate: "2025-05-18",
		lastActive: "2025-01-14",
		reviewsCount: 112,
		reportsCount: 0,
	},
	{
		id: "12",
		firstName: "Kai",
		lastName: "Mountain",
		username: "kaimountain",
		email: "kai.mountain@example.com",
		status: "active",
		joinDate: "2025-03-25",
		lastActive: "2025-01-21",
		reviewsCount: 87,
		reportsCount: 0,
	},
	{
		id: "13",
		firstName: "Zara",
		lastName: "Urban",
		username: "zaraurban",
		email: "zara.urban@example.com",
		status: "blocked",
		joinDate: "2025-06-11",
		lastActive: "2025-01-08",
		reviewsCount: 156,
		reportsCount: 4,
	},
	{
		id: "14",
		firstName: "Omar",
		lastName: "Desert",
		username: "omardesert",
		email: "omar.desert@example.com",
		status: "active",
		joinDate: "2025-01-30",
		lastActive: "2025-01-20",
		reviewsCount: 93,
		reportsCount: 0,
	},
	{
		id: "15",
		firstName: "Nina",
		lastName: "Forest",
		username: "ninaforest",
		email: "nina.forest@example.com",
		status: "active",
		joinDate: "2025-06-07",
		lastActive: "2025-01-18",
		reviewsCount: 134,
		reportsCount: 1,
	},
	{
		id: "16",
		firstName: "Liam",
		lastName: "Island",
		username: "liamisland",
		email: "liam.island@example.com",
		status: "active",
		joinDate: "2025-04-20",
		lastActive: "2025-01-17",
		reviewsCount: 78,
		reportsCount: 0,
	},
	{
		id: "17",
		firstName: "Priya",
		lastName: "Spiritual",
		username: "priyaspiritual",
		email: "priya.spiritual@example.com",
		status: "active",
		joinDate: "2025-03-15",
		lastActive: "2025-01-19",
		reviewsCount: 102,
		reportsCount: 0,
	},
	{
		id: "18",
		firstName: "Felix",
		lastName: "Arctic",
		username: "felixarctic",
		email: "felix.arctic@example.com",
		status: "active",
		joinDate: "2025-11-28",
		lastActive: "2025-01-15",
		reviewsCount: 67,
		reportsCount: 0,
	},
	{
		id: "19",
		firstName: "Camila",
		lastName: "Volcano",
		username: "camilavolcano",
		email: "camila.volcano@example.com",
		status: "blocked",
		joinDate: "2025-02-14",
		lastActive: "2025-01-12",
		reviewsCount: 89,
		reportsCount: 6,
	},
	{
		id: "20",
		firstName: "Hassan",
		lastName: "Nomad",
		username: "hassannomad",
		email: "hassan.nomad@example.com",
		status: "active",
		joinDate: "2025-08-03",
		lastActive: "2025-01-20",
		reviewsCount: 145,
		reportsCount: 0,
	},
	{
		id: "21",
		firstName: "Yuki",
		lastName: "Snow",
		username: "yukisnow",
		email: "yuki.snow@example.com",
		status: "active",
		joinDate: "2025-03-10",
		lastActive: "2025-01-21",
		reviewsCount: 76,
		reportsCount: 0,
	},
	{
		id: "22",
		firstName: "Elena",
		lastName: "Wine",
		username: "elenawine",
		email: "elena.wine@example.com",
		status: "active",
		joinDate: "2025-05-18",
		lastActive: "2025-01-16",
		reviewsCount: 123,
		reportsCount: 1,
	},
	{
		id: "23",
		firstName: "Jamal",
		lastName: "Safari",
		username: "jamalsafari",
		email: "jamal.safari@example.com",
		status: "active",
		joinDate: "2025-03-08",
		lastActive: "2025-01-19",
		reviewsCount: 167,
		reportsCount: 0,
	},
	{
		id: "24",
		firstName: "Astrid",
		lastName: "Fjord",
		username: "astridfjord",
		email: "astrid.fjord@example.com",
		status: "active",
		joinDate: "2025-04-25",
		lastActive: "2025-01-18",
		reviewsCount: 98,
		reportsCount: 0,
	},
	{
		id: "25",
		firstName: "Diego",
		lastName: "Jungle",
		username: "diegojungle",
		email: "diego.jungle@example.com",
		status: "blocked",
		joinDate: "2025-05-05",
		lastActive: "2025-01-09",
		reviewsCount: 134,
		reportsCount: 7,
	},
];

const USERS_PER_PAGE = 10;

const simulateApiCall = (
	page: number,
	pageSize: number,
	searchQuery: string,
	statusFilter: string,
	sortBy: string,
	delay = 1000,
): Promise<{
	users: AdminUser[];
	hasMore: boolean;
	total: number;
}> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			let filtered = mockAdminUsers.filter((user) => {
				if (searchQuery) {
					const fullName =
						`${user.firstName} ${user.lastName}`.toLowerCase();
					const query = searchQuery.toLowerCase();
					if (
						!fullName.includes(query) &&
						!user.username.toLowerCase().includes(query) &&
						!user.email.toLowerCase().includes(query)
					) {
						return false;
					}
				}

				if (statusFilter !== "all" && user.status !== statusFilter) {
					return false;
				}

				return true;
			});

			filtered = filtered.sort((a, b) => {
				const fullNameA = `${a.firstName} ${a.lastName}`;
				const fullNameB = `${b.firstName} ${b.lastName}`;

				if (sortBy === "name-asc") {
					return fullNameA.localeCompare(fullNameB);
				} else if (sortBy === "name-desc") {
					return fullNameB.localeCompare(fullNameA);
				}

				return 0;
			});

			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			const users = filtered.slice(startIndex, endIndex);
			const hasMore = endIndex < filtered.length;

			resolve({
				users,
				hasMore,
				total: filtered.length,
			});
		}, delay);
	});
};

export default function AdminUsersPage() {
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [totalUsers, setTotalUsers] = useState(0);

	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState("name-asc");
	const debouncedUserSearch = useDebounce(searchQuery);

	const { t, i18n } = useTranslation();

	useEffect(() => {
		setUsers([]);
		setCurrentPage(1);
		setHasMore(true);
		fetchUsers(true);
	}, [debouncedUserSearch, statusFilter, sortBy]);

	const fetchUsers = async (isInitial = false) => {
		if (isInitial) {
			setLoading(true);
		} else {
			setLoadingMore(true);
		}

		try {
			const response = await simulateApiCall(
				isInitial ? 1 : currentPage,
				USERS_PER_PAGE,
				searchQuery,
				statusFilter,
				sortBy,
			);

			if (isInitial) {
				setUsers(response.users);
				setCurrentPage(2);
			} else {
				setUsers((prev) => [...prev, ...response.users]);
				setCurrentPage((prev) => prev + 1);
			}

			setHasMore(response.hasMore);
			setTotalUsers(response.total);
		} catch (error) {
			console.error("Error loading users:", error);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	const handleLoadMore = () => {
		if (!loadingMore && hasMore) {
			fetchUsers(false);
		}
	};

	const handleStatusToggle = async (userId: string) => {
		try {
			setUsers((prev) =>
				prev.map((user) =>
					user.id === userId
						? {
								...user,
								status:
									user.status === "active"
										? "blocked"
										: "active",
						  }
						: user,
				),
			);

			const userIndex = mockAdminUsers.findIndex((u) => u.id === userId);
			if (userIndex !== -1) {
				mockAdminUsers[userIndex].status =
					mockAdminUsers[userIndex].status === "active"
						? "blocked"
						: "active";
			}

			await new Promise((resolve) => setTimeout(resolve, 500));
		} catch (error) {
			console.error("Error updating user status:", error);
			setUsers((prev) =>
				prev.map((user) =>
					user.id === userId
						? {
								...user,
								status:
									user.status === "active"
										? "blocked"
										: "active",
						  }
						: user,
				),
			);
		}
	};

	const clearFilters = () => {
		setSearchQuery("");
		setStatusFilter("all");
		setSortBy("name-asc");
	};

	const activeFiltersCount = [
		searchQuery,
		statusFilter !== "all",
		sortBy !== "name-asc",
	].filter(Boolean).length;

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-2">
						<Shield className="w-8 h-8" />
						{t("userManagement.title")}
					</h1>
					<p className="text-muted-foreground mt-1">
						{t("userManagement.description")}
					</p>
				</div>
				{activeFiltersCount > 0 && (
					<Button
						variant="outline"
						onClick={clearFilters}
						className="flex items-center gap-2"
					>
						<X className="h-4 w-4" />
						{t("userManagement.clearFilters", {
							count: activeFiltersCount,
						})}
					</Button>
				)}
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						{t("userManagement.searchFilter.title")}
					</CardTitle>
					<CardDescription>
						{t("userManagement.searchFilter.description")}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="search">
								{t("userManagement.searchFilter.searchUsers")}
							</Label>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="search"
									placeholder={t(
										"userManagement.searchFilter.searchPlaceholder",
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
								{t("userManagement.searchFilter.userStatus")}
							</Label>
							<Select
								value={statusFilter}
								onValueChange={setStatusFilter}
							>
								<SelectTrigger id="status-filter">
									<SelectValue
										placeholder={t(
											"userManagement.searchFilter.filterByStatusPlaceholder",
										)}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										{t(
											"userManagement.searchFilter.allUsers",
										)}
									</SelectItem>
									<SelectItem value="active">
										{t(
											"userManagement.searchFilter.activeUsers",
										)}
									</SelectItem>
									<SelectItem value="blocked">
										{t(
											"userManagement.searchFilter.blockedUsers",
										)}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="sort-by">
								{t("userManagement.searchFilter.sortBy")}
							</Label>
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger id="sort-by">
									<SelectValue
										placeholder={t(
											"userManagement.searchFilter.sortBy",
										)}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name-asc">
										<div className="flex items-center gap-2">
											<ArrowUpDown className="w-4 h-4" />
											{t(
												"userManagement.searchFilter.sortByNameAsc",
											)}
										</div>
									</SelectItem>
									<SelectItem value="name-desc">
										<div className="flex items-center gap-2">
											<ArrowUpDown className="w-4 h-4" />
											{t(
												"userManagement.searchFilter.sortByNameDesc",
											)}
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="mb-4">
				<p className="text-muted-foreground">
					{t("userManagement.showingUsers", {
						current: users.length,
					})}

				</p>
			</div>

			{loading ? (
				<div className="container mx-auto px-4 py-8">
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
							<p className="text-muted-foreground">
								{t("loadingUsers")}
							</p>
						</div>
					</div>
				</div>
			) : users.length === 0 ? (
				<div className="text-center py-12">
					<Users className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
					<h3 className="text-lg font-semibold mb-2">
						{t("userManagement.noUsersFound.title")}
					</h3>
					<p className="text-muted-foreground mb-4">
						{totalUsers === 0
							? t("userManagement.noUsersFound.adjustSearch")
							: t("userManagement.noUsersFound.noUsersAvailable")}
					</p>
					{activeFiltersCount > 0 && (
						<Button variant="outline" onClick={clearFilters}>
							{t("userManagement.noUsersFound.clearAllFilters")}
						</Button>
					)}
				</div>
			) : (
				<>
					<Card>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="border-b">
										<tr className="text-left">
											<th className="p-4 font-semibold">
												{t(
													"userManagement.tableHeaders.user",
												)}
											</th>
											<th className="p-4 font-semibold">
												{t(
													"userManagement.tableHeaders.contact",
												)}
											</th>
											<th className="p-4 font-semibold">
												{t(
													"userManagement.tableHeaders.status",
												)}
											</th>

											<th className="p-4 font-semibold">
												{t(
													"userManagement.tableHeaders.actions",
												)}
											</th>
										</tr>
									</thead>
									<tbody>
										{users.map((user) => (
											<tr
												key={user.id}
												className="border-b hover:bg-muted/50"
											>
												<td className="p-4">
													<div>
														<p className="font-semibold">
															{user.firstName}{" "}
															{user.lastName}
														</p>
														<p className="text-sm text-muted-foreground">
															@{user.username}
														</p>
													</div>
												</td>
												<td className="p-4">
													<p className="text-sm">
														{user.email}
													</p>
													<p className="text-xs text-muted-foreground">
														{t(
															"userManagement.joined",
															{
																date: convertDateToDDMonYYYY(
																	user.joinDate,
																	i18n.language,
																),
															},
														)}
													</p>
												</td>
												<td className="p-4">
													<Badge
														variant={
															user.status ===
															"active"
																? "default"
																: "destructive"
														}
													>
														{user.status ===
														"active" ? (
															<>
																<UserCheck className="w-3 h-3 mr-1" />
																{t(
																	"userManagement.status.active",
																)}
															</>
														) : (
															<>
																<UserX className="w-3 h-3 mr-1" />
																{t(
																	"userManagement.status.blocked",
																)}
															</>
														)}
													</Badge>
												</td>

												<td className="p-4">
													<div className="flex items-center gap-2">
														<Label
															htmlFor={`status-${user.id}`}
															className="text-sm"
														>
															{user.status ===
															"active"
																? t(
																		"userManagement.actionLabels.block",
																  )
																: t(
																		"userManagement.actionLabels.activate",
																  )}
														</Label>
														<Switch
															id={`status-${user.id}`}
															checked={
																user.status ===
																"active"
															}
															onCheckedChange={() =>
																handleStatusToggle(
																	user.id,
																)
															}
														/>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>

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
										{t("userManagement.loadMore.loading")}
									</>
								) : (
									<>
										{t("userManagement.loadMore.button")}
										<span className="ml-2 text-muted-foreground">
											{t(
												"userManagement.loadMore.count",
												{
													current: users.length,
												},
											)}
										</span>
									</>
								)}
							</Button>
						</div>
					)}

					{!hasMore && users.length > 0 && (
						<div className="text-center mt-8 py-4 border-t">
							<p className="text-muted-foreground">
								{t("userManagement.loadMore.endReached", {
									count: users.length,
								})}
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}
