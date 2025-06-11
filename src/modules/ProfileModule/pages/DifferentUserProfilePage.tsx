import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, FileText, Share2, UserPlus } from "lucide-react";
import { formatNumber } from "@/shared/utils/helpers/formatNumber";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { convertDateToDDMonYYYY } from "@/shared/utils/helpers/convertDateToDDMonYYYY";
import { showSuccessToast } from "@/shared/utils/helpers/showToast";

const mockUsers = {
	"1": {
		id: "1",
		firstName: "Emma",
		lastName: "Wanderlust",
		username: "emmawanders",
		email: "emma.wanderlust@example.com",
		bio: "Adventure seeker and cultural enthusiast who has traveled to over 60 countries. I love discovering hidden gems, trying local cuisines, and connecting with fellow travelers. Always planning my next adventure!",
		location: "Barcelona, Spain",
		occupation: "Travel Blogger & Photographer",
		joinDate: "March 2025",
		profilePicture: "/placeholder.svg?height=200&width=200",
		coverPhoto: "/placeholder.svg?height=300&width=800",
		travelPreferences: [
			"adventure",
			"culture",
			"food",
			"photography",
			"history",
		],
		travelCategories: [
			"beach",
			"mountain",
			"city",
			"historical",
			"islands",
		],
		stats: {
			placesVisited: 62,
			rating: 4.9,
			reviewsWritten: 156,
			followers: 3450,
			following: 892,
		},
	},
	"2": {
		id: "2",
		firstName: "Marco",
		lastName: "Explorer",
		email: "marco.explorer@example.com",
		bio: "Professional travel guide and mountain climber from the Italian Alps. Specializing in adventure tourism and sustainable travel practices. Love sharing the beauty of nature with fellow adventurers.",
		location: "Milan, Italy",
		occupation: "Adventure Guide & Mountaineer",
		joinDate: "January 2020",
		profilePicture: "/placeholder.svg?height=200&width=200",
		coverPhoto: "/placeholder.svg?height=300&width=800",
		travelPreferences: ["adventure", "nature", "sports", "photography"],
		travelCategories: ["mountain", "parks", "forest", "lakes"],
		stats: {
			rating: 4.7,
			reviewsWritten: 94,
			followers: 1240,
			following: 456,
		},
	},
	"3": {
		id: "3",
		firstName: "Sophia",
		lastName: "Traveler",
		email: "sophia.traveler@example.com",
		bio: "Luxury travel enthusiast with a passion for fine dining and cultural experiences. I believe in traveling with style and immersing myself in local traditions. Join me on my journey to discover the world's most exclusive destinations.",
		location: "Paris, France",
		occupation: "Travel Influencer & Food Critic",
		joinDate: "June 2025",
		profilePicture: "/placeholder.svg?height=200&width=200",
		coverPhoto: "/placeholder.svg?height=300&width=800",
		travelPreferences: [
			"food",
			"culture",
			"relaxation",
			"shopping",
			"nightlife",
		],
		travelCategories: [
			"city",
			"beach",
			"islands",
			"historical",
			"countryside",
		],
		stats: {
			rating: 4.8,
			reviewsWritten: 128,
			followers: 2780,
			following: 534,
		},
	},
};

const getLabelFromValue = (
	value: string,
	options: { label: string; value: string }[],
) => {
	const option = options.find((opt) => opt.value === value);
	return option ? option.label : value;
};

const travelPreferencesOptions = [
	{ label: "Adventure", value: "adventure" },
	{ label: "Culture", value: "culture" },
	{ label: "Food & Cuisine", value: "food" },
	{ label: "Nature", value: "nature" },
	{ label: "Photography", value: "photography" },
	{ label: "History", value: "history" },
	{ label: "Relaxation", value: "relaxation" },
	{ label: "Nightlife", value: "nightlife" },
	{ label: "Shopping", value: "shopping" },
	{ label: "Sports", value: "sports" },
];

const travelCategoriesOptions = [
	{ label: "Beach", value: "beach" },
	{ label: "Mountain", value: "mountain" },
	{ label: "City", value: "city" },
	{ label: "Countryside", value: "countryside" },
	{ label: "Historical Sites", value: "historical" },
	{ label: "National Parks", value: "parks" },
	{ label: "Islands", value: "islands" },
	{ label: "Desert", value: "desert" },
	{ label: "Forest", value: "forest" },
	{ label: "Lakes", value: "lakes" },
];

export default function DifferentUserProfilePage() {
	const { userId } = useParams<{ userId: string }>();
	const { t, i18n } = useTranslation();

	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [isFollowing, setIsFollowing] = useState(false);

	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				setTimeout(() => {
					const userData =
						mockUsers[userId as keyof typeof mockUsers];
					setUser(userData);
					setLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Error fetching user:", error);
				setLoading(false);
			}
		};

		fetchUser();
	}, [userId]);

	const handleFollow = () => {
		setIsFollowing(!isFollowing);
	};

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
		showSuccessToast(t("userProfilePage.profileLinkCopied"));
	};

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-muted-foreground">
							{t("userProfilePage.loadingProfile")}
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">
						{t("userProfilePage.userNotFoundTitle")}
					</h1>
					<p className="text-muted-foreground">
						{t("userProfilePage.userNotFoundDescription")}
					</p>
					<Button
						variant="outline"
						className="mt-4"
						onClick={() => window.history.back()}
					>
						{t("userProfilePage.goBack")}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="relative mb-8">
				<div className="flex flex-col md:flex-row items-start md:items-end gap-6">
					<div className="flex-1">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div>
								<h1 className="text-3xl font-bold">
									{user.firstName} {user.lastName} (
									<b>@{user.username}</b>)
								</h1>
							</div>

							<div className="flex gap-2">
								<Button
									onClick={handleFollow}
									variant={
										isFollowing ? "outline" : "default"
									}
									className="cursor-pointer"
								>
									<UserPlus className="w-4 h-4 mr-2" />
									{isFollowing
										? t("userProfilePage.followingButton")
										: t("userProfilePage.followButton")}
								</Button>

								<Button
									onClick={handleShare}
									variant="outline"
									size="icon"
									className="cursor-pointer"
								>
									<Share2 className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<Card className="lg:col-span-1 h-1/2">
					<CardHeader>
						<CardTitle>
							{t("userProfilePage.connectionsTitle")}
						</CardTitle>
						<CardDescription>
							{t("userProfilePage.connectionsDescription")}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="text-center p-4 border rounded-lg">
								<Users className="w-6 h-6 mx-auto mb-2 text-primary" />
								<div className="text-2xl font-bold">
									{formatNumber(user.stats.followers)}
								</div>
								<div className="text-sm text-muted-foreground">
									{t("userProfilePage.followers")}
								</div>
							</div>
							<div className="text-center p-4 border rounded-lg">
								<Users className="w-6 h-6 mx-auto mb-2 text-primary" />
								<div className="text-2xl font-bold">
									{formatNumber(user.stats.following)}
								</div>
								<div className="text-sm text-muted-foreground">
									{t("userProfilePage.following")}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>
							{t("userProfilePage.profileInformationTitle")}
						</CardTitle>
						<CardDescription>
							{t("common.about")} {user.firstName}{" "}
							<span className="text-muted-foreground">
								(
								{t("userProfilePage.joinedOn", {
									date: convertDateToDDMonYYYY(
										user.joinDate,
										i18n.language,
									),
								})}
								)
							</span>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<h3 className="text-lg font-semibold">
								{t("userProfilePage.bioTitle")}
							</h3>
							<p className="text-muted-foreground">{user.bio}</p>
						</div>

						<Separator />

						<div className="space-y-4">
							<h3 className="text-lg font-semibold">
								{t("userProfilePage.travelPreferencesTitle")}
							</h3>
							<div className="space-y-4">
								<div className="space-y-2">
									<h4 className="text-sm font-medium">
										{t(
											"userProfilePage.travelCategoriesTitle",
										)}
									</h4>
									<div className="flex flex-wrap gap-2">
										{user.travelPreferences.map(
											(pref: string) => (
												<Badge
													key={pref}
													variant="secondary"
												>
													{getLabelFromValue(
														pref,
														travelPreferencesOptions,
													)}
												</Badge>
											),
										)}
									</div>
								</div>

								<div className="space-y-2">
									<h4 className="text-sm font-medium">
										{t("userProfilePage.travelTagsTitle")}
									</h4>
									<div className="flex flex-wrap gap-2">
										{user.travelCategories.map(
											(category: string) => (
												<Badge
													key={category}
													variant="outline"
												>
													{getLabelFromValue(
														category,
														travelCategoriesOptions,
													)}
												</Badge>
											),
										)}
									</div>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<div className="flex flex-wrap gap-4">
							<div className="flex items-center">
								<Star className="mr-2 h-5 w-5 text-muted-foreground" />
								<span>
									{user.stats.rating}{" "}
									{t("userProfilePage.userRating")}
								</span>
							</div>
							<div className="flex items-center">
								<FileText className="mr-2 h-5 w-5 text-muted-foreground" />
								<span>
									{user.stats.reviewsWritten}{" "}
									{t("userProfilePage.reviewsWritten")}
								</span>
							</div>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
