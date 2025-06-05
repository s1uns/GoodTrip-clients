"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Star,
	Users,
	Loader2,
	FileText,
	Search,
	UserPlus,
	X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/shared/utils/helpers/formatNumber";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ITEMS_PER_PAGE = 3;

interface Subscription {
	id: number;
	firstName: string;
	lastName: string;
	since?: string;
	subscribers: number;
	rating: number;
	reviews: number;
}

const allSubscribers = [
	{
		id: 1,
		firstName: "David",
		lastName: "Travel",
		since: "Jan 2023",
		subscribers: 1240,
		rating: 4.7,
		reviews: 89,
	},
	{
		id: 2,
		firstName: "Emma",
		lastName: "Wanderlust",
		since: "Mar 2023",
		subscribers: 3450,
		rating: 4.9,
		reviews: 156,
	},
	{
		id: 3,
		firstName: "Frank",
		lastName: "Explorer",
		since: "May 2023",
		subscribers: 780,
		rating: 4.5,
		reviews: 42,
	},
	{
		id: 4,
		firstName: "Sarah",
		lastName: "Hiker",
		since: "Feb 2023",
		subscribers: 2100,
		rating: 4.8,
		reviews: 112,
	},
	{
		id: 5,
		firstName: "Alex",
		lastName: "Traveler",
		since: "Apr 2023",
		subscribers: 1560,
		rating: 4.6,
		reviews: 78,
	},
	{
		id: 6,
		firstName: "Maria",
		lastName: "Explorer",
		since: "Jun 2023",
		subscribers: 890,
		rating: 4.4,
		reviews: 36,
	},
	{
		id: 7,
		firstName: "John",
		lastName: "Backpacker",
		since: "Jul 2023",
		subscribers: 1320,
		rating: 4.7,
		reviews: 64,
	},
	{
		id: 8,
		firstName: "Lisa",
		lastName: "Adventurer",
		since: "Aug 2023",
		subscribers: 2450,
		rating: 4.8,
		reviews: 128,
	},
];

const allSubscriptions = [
	{
		id: 1,
		firstName: "Mountain",
		lastName: "Tours",
		subscribers: 100500,
		rating: 4.8,
		reviews: 1245,
	},
	{
		id: 2,
		firstName: "Beach",
		lastName: "Resorts",
		subscribers: 150200,
		rating: 4.9,
		reviews: 2356,
	},
	{
		id: 3,
		firstName: "City",
		lastName: "Breaks",
		subscribers: 120800,
		rating: 4.7,
		reviews: 1876,
	},
	{
		id: 4,
		firstName: "Jungle",
		lastName: "Tours",
		subscribers: 80300,
		rating: 4.6,
		reviews: 987,
	},
	{
		id: 5,
		firstName: "Desert",
		lastName: "Expeditions",
		subscribers: 60100,
		rating: 4.5,
		reviews: 756,
	},
	{
		id: 6,
		firstName: "Island",
		lastName: "Hopping",
		subscribers: 90400,
		rating: 4.7,
		reviews: 1123,
	},
	{
		id: 7,
		firstName: "Cultural",
		lastName: "Experiences",
		subscribers: 110700,
		rating: 4.8,
		reviews: 1567,
	},
];

export default function SubscriptionsTab() {
	const [subscribers, setSubscribers] = useState<Subscription[]>([]);
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [subscribersPage, setSubscribersPage] = useState(1);
	const [subscriptionsPage, setSubscriptionsPage] = useState(1);
	const [loadingSubscribers, setLoadingSubscribers] = useState(false);
	const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
	const [hasMoreSubscribers, setHasMoreSubscribers] = useState(true);
	const [hasMoreSubscriptions, setHasMoreSubscriptions] = useState(true);

	const [subscribersSearch, setSubscribersSearch] = useState("");
	const [subscriptionsSearch, setSubscriptionsSearch] = useState("");
	const [subscribersSort, setSubscribersSort] = useState("name-asc");
	const [subscriptionsSort, setSubscriptionsSort] = useState("name-asc");
	const [activeTab, setActiveTab] = useState("subscriptions");

	const filteredSubscribers = allSubscribers.filter((sub) => {
		const fullName = `${sub.firstName} ${sub.lastName}`.toLowerCase();
		return fullName.includes(subscribersSearch.toLowerCase());
	});

	const filteredSubscriptions = allSubscriptions.filter((sub) => {
		const fullName = `${sub.firstName} ${sub.lastName}`.toLowerCase();
		return fullName.includes(subscriptionsSearch.toLowerCase());
	});

	const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
		switch (subscribersSort) {
			case "name-asc":
				return `${a.firstName} ${a.lastName}`.localeCompare(
					`${b.firstName} ${b.lastName}`,
				);
			case "name-desc":
				return `${b.firstName} ${b.lastName}`.localeCompare(
					`${a.firstName} ${a.lastName}`,
				);
			case "subscribers-asc":
				return a.subscribers - b.subscribers;
			case "subscribers-desc":
				return b.subscribers - a.subscribers;
			case "rating-asc":
				return a.rating - b.rating;
			case "rating-desc":
				return b.rating - a.rating;
			default:
				return 0;
		}
	});

	const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
		switch (subscriptionsSort) {
			case "name-asc":
				return `${a.firstName} ${a.lastName}`.localeCompare(
					`${b.firstName} ${b.lastName}`,
				);
			case "name-desc":
				return `${b.firstName} ${b.lastName}`.localeCompare(
					`${a.firstName} ${a.lastName}`,
				);
			case "subscribers-asc":
				return a.subscribers - b.subscribers;
			case "subscribers-desc":
				return b.subscribers - a.subscribers;
			case "rating-asc":
				return a.rating - b.rating;
			case "rating-desc":
				return b.rating - a.rating;
			default:
				return 0;
		}
	});

	useEffect(() => {
		loadMoreSubscribers();
		loadMoreSubscriptions();
	}, []);

	const loadMoreSubscribers = () => {
		if (loadingSubscribers) return;

		setLoadingSubscribers(true);

		setTimeout(() => {
			const startIndex = (subscribersPage - 1) * ITEMS_PER_PAGE;
			const endIndex = startIndex + ITEMS_PER_PAGE;
			const newItems = sortedSubscribers.slice(startIndex, endIndex);

			setSubscribers((prev) => [...prev, ...newItems]);
			setSubscribersPage((prev) => prev + 1);
			setHasMoreSubscribers(endIndex < sortedSubscribers.length);
			setLoadingSubscribers(false);
		}, 800);
	};

	const loadMoreSubscriptions = () => {
		if (loadingSubscriptions) return;

		setLoadingSubscriptions(true);

		setTimeout(() => {
			const startIndex = (subscriptionsPage - 1) * ITEMS_PER_PAGE;
			const endIndex = startIndex + ITEMS_PER_PAGE;
			const newItems = sortedSubscriptions.slice(startIndex, endIndex);

			setSubscriptions((prev) => [...prev, ...newItems]);
			setSubscriptionsPage((prev) => prev + 1);
			setHasMoreSubscriptions(endIndex < sortedSubscriptions.length);
			setLoadingSubscriptions(false);
		}, 800);
	};

	useEffect(() => {
		setSubscribers([]);
		setSubscribersPage(1);
		setHasMoreSubscribers(true);
		loadMoreSubscribers();
	}, [subscribersSearch, subscribersSort]);

	useEffect(() => {
		setSubscriptions([]);
		setSubscriptionsPage(1);
		setHasMoreSubscriptions(true);
		loadMoreSubscriptions();
	}, [subscriptionsSearch, subscriptionsSort]);

	return (
		<div className="space-y-6">
			<Tabs
				defaultValue="subscriptions"
				value={activeTab}
				onValueChange={setActiveTab}
			>
				<TabsList className="mb-4">
					<TabsTrigger value="subscriptions">
						My Subscriptions
					</TabsTrigger>
					<TabsTrigger value="subscribers">
						My Subscribers
					</TabsTrigger>
				</TabsList>

				<TabsContent value="subscriptions">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle className="text-lg">
									My Subscriptions
								</CardTitle>
								<CardDescription>
									Users you are subscribed to
								</CardDescription>
							</div>
							<Badge variant="secondary" className="ml-2">
								<Users className="h-3 w-3 mr-1" />
								{filteredSubscriptions.length}
							</Badge>
						</CardHeader>

						<CardContent className="border-t pt-4">
							<div className="flex flex-col gap-4 mb-4 mt-4">
								<div className="flex-1 relative">
									<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search subscriptions..."
										value={subscriptionsSearch}
										onChange={(e) =>
											setSubscriptionsSearch(
												e.target.value,
											)
										}
										className="pl-8"
									/>
									{subscriptionsSearch && (
										<Button
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full"
											onClick={() =>
												setSubscriptionsSearch("")
											}
										>
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>
								<Select
									value={subscriptionsSort}
									onValueChange={setSubscriptionsSort}
								>
									<SelectTrigger className="w-full md:w-[180px]">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="name-asc">
											Name (A-Z)
										</SelectItem>
										<SelectItem value="name-desc">
											Name (Z-A)
										</SelectItem>
										<SelectItem value="subscribers-asc">
											Subscribers (Low-High)
										</SelectItem>
										<SelectItem value="subscribers-desc">
											Subscribers (High-Low)
										</SelectItem>
										<SelectItem value="rating-asc">
											Rating (Low-High)
										</SelectItem>
										<SelectItem value="rating-desc">
											Rating (High-Low)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{subscriptions.length === 0 &&
							!loadingSubscriptions ? (
								<div className="text-center py-8">
									<UserPlus className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
									<p className="mt-2 text-lg font-medium">
										No subscriptions found
									</p>
									<p className="text-sm text-muted-foreground">
										{subscriptionsSearch
											? "Try a different search term"
											: "You haven't subscribed to anyone yet"}
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{subscriptions.map((sub) => (
										<div
											key={sub.id}
											className="flex items-center justify-between border p-3 rounded-md hover:bg-muted/50 transition-colors"
										>
											<div>
												<p className="font-semibold">
													{sub.firstName}{" "}
													{sub.lastName}
												</p>
												<div className="flex items-center text-sm text-muted-foreground space-x-3">
													<span className="flex items-center">
														<Users className="h-3 w-3 mr-1" />
														{formatNumber(
															sub.subscribers,
														)}
													</span>
													<span className="flex items-center">
														<Star className="h-3 w-3 mr-1" />
														{sub.rating}
													</span>
													<span className="flex items-center">
														<FileText className="h-3 w-3 mr-1" />
														{formatNumber(
															sub.reviews,
														)}
													</span>
												</div>
											</div>
											<Button
												variant="outline"
												size="sm"
												className="text-xs"
											>
												Unsubscribe
											</Button>
										</div>
									))}
								</div>
							)}
						</CardContent>

						<CardFooter className="flex justify-center">
							{hasMoreSubscriptions && (
								<Button
									onClick={loadMoreSubscriptions}
									variant="outline"
									size="sm"
									className="text-xs"
									disabled={loadingSubscriptions}
								>
									{loadingSubscriptions ? (
										<>
											<Loader2 className="mr-2 h-3 w-3 animate-spin" />
											Loading...
										</>
									) : (
										"Load More"
									)}
								</Button>
							)}
						</CardFooter>
					</Card>
				</TabsContent>

				<TabsContent value="subscribers">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<div>
								<CardTitle className="text-lg">
									My Subscribers
								</CardTitle>
								<CardDescription>
									Users who are subscribed to you
								</CardDescription>
							</div>
							<Badge variant="secondary" className="ml-2">
								<Users className="h-3 w-3 mr-1" />
								{filteredSubscribers.length}
							</Badge>
						</CardHeader>

						<CardContent className="border-t pt-4">
							<div className="flex flex-col gap-4 mb-4 mt-4">
								<div className="flex-1 relative">
									<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search subscribers..."
										value={subscribersSearch}
										onChange={(e) =>
											setSubscribersSearch(e.target.value)
										}
										className="pl-8"
									/>
									{subscribersSearch && (
										<Button
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full"
											onClick={() =>
												setSubscribersSearch("")
											}
										>
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>
								<Select
									value={subscribersSort}
									onValueChange={setSubscribersSort}
								>
									<SelectTrigger className="w-full md:w-[180px]">
										<SelectValue placeholder="Sort by" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="name-asc">
											Name (A-Z)
										</SelectItem>
										<SelectItem value="name-desc">
											Name (Z-A)
										</SelectItem>
										<SelectItem value="subscribers-asc">
											Subscribers (Low-High)
										</SelectItem>
										<SelectItem value="subscribers-desc">
											Subscribers (High-Low)
										</SelectItem>
										<SelectItem value="rating-asc">
											Rating (Low-High)
										</SelectItem>
										<SelectItem value="rating-desc">
											Rating (High-Low)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{subscribers.length === 0 && !loadingSubscribers ? (
								<div className="text-center py-8">
									<Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
									<p className="mt-2 text-lg font-medium">
										No subscribers found
									</p>
									<p className="text-sm text-muted-foreground">
										{subscribersSearch
											? "Try a different search term"
											: "You don't have any subscribers yet"}
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{subscribers.map((sub) => (
										<div
											key={sub.id}
											className="flex items-center justify-between border p-3 rounded-md hover:bg-muted/50 transition-colors"
										>
											<div>
												<p className="font-semibold">
													{sub.firstName}{" "}
													{sub.lastName}
												</p>
												<div className="flex items-center text-sm text-muted-foreground space-x-3">
													<span className="flex items-center">
														<Users className="h-3 w-3 mr-1" />
														{formatNumber(
															sub.subscribers,
														)}
													</span>
													<span className="flex items-center">
														<Star className="h-3 w-3 mr-1" />
														{sub.rating}
													</span>
													<span className="flex items-center">
														<FileText className="h-3 w-3 mr-1" />
														{formatNumber(
															sub.reviews,
														)}
													</span>
												</div>
											</div>
											<Button
												variant="outline"
												size="sm"
												className="text-xs"
											>
												View Profile
											</Button>
										</div>
									))}
								</div>
							)}
						</CardContent>

						<CardFooter className="flex justify-center">
							{hasMoreSubscribers && (
								<Button
									onClick={loadMoreSubscribers}
									variant="outline"
									size="sm"
									className="text-xs"
									disabled={loadingSubscribers}
								>
									{loadingSubscribers ? (
										<>
											<Loader2 className="mr-2 h-3 w-3 animate-spin" />
											Loading...
										</>
									) : (
										"Load More"
									)}
								</Button>
							)}
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
