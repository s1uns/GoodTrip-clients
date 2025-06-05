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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Search,
	Users,
	Star,
	FileText,
	UserPlus,
	UserMinus,
	Loader2,
	X,
	Filter,
	RefreshCw,
} from "lucide-react";
import { formatNumber } from "@/shared/utils/helpers/formatNumber";
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

interface UserInfo {
	id: string;
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	bio: string;
	location: string;
	joinDate: string;
	profilePicture: string;
	stats: {
		rating: number;
		reviewsWritten: number;
		followers: number;
		following: number;
	};
	isSubscribed: boolean;
	travelPreferences: string[];
	travelCategories: string[];
}

const mockUsers: UserInfo[] = [
	{
		id: "1",
		firstName: "Emma",
		lastName: "Wanderlust",
		username: "emmawanders",
		email: "emma.wanderlust@example.com",
		bio: "Adventure seeker and cultural enthusiast who has traveled to over 60 countries.",
		location: "Barcelona, Spain",
		joinDate: "March 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.9,
			reviewsWritten: 156,
			followers: 3450,
			following: 892,
		},
		isSubscribed: false,
		travelPreferences: ["adventure", "culture", "food", "photography"],
		travelCategories: ["beach", "mountain", "city", "historical"],
	},
	{
		id: "2",
		firstName: "Marco",
		lastName: "Explorer",
		username: "marcoexplores",
		email: "marco.explorer@example.com",
		bio: "Professional travel guide and mountain climber from the Italian Alps.",
		location: "Milan, Italy",
		joinDate: "January 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.7,
			reviewsWritten: 94,
			followers: 1240,
			following: 456,
		},
		isSubscribed: true,
		travelPreferences: ["adventure", "nature", "sports", "photography"],
		travelCategories: ["mountain", "parks", "forest", "lakes"],
	},
	{
		id: "3",
		firstName: "Sophia",
		lastName: "Traveler",
		username: "sophiatravels",
		email: "sophia.traveler@example.com",
		bio: "Luxury travel enthusiast with a passion for fine dining and cultural experiences.",
		location: "Paris, France",
		joinDate: "June 2021",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.8,
			reviewsWritten: 128,
			followers: 2780,
			following: 534,
		},
		isSubscribed: false,
		travelPreferences: ["food", "culture", "relaxation", "shopping"],
		travelCategories: ["city", "beach", "islands", "historical"],
	},
	{
		id: "4",
		firstName: "Alex",
		lastName: "Nomad",
		username: "alexnomad",
		email: "alex.nomad@example.com",
		bio: "Digital nomad exploring the world one city at a time. Tech enthusiast and coffee lover.",
		location: "Lisbon, Portugal",
		joinDate: "September 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.5,
			reviewsWritten: 89,
			followers: 1890,
			following: 723,
		},
		isSubscribed: true,
		travelPreferences: ["culture", "food", "nightlife", "budget"],
		travelCategories: ["city", "countryside", "coastal"],
	},
	{
		id: "5",
		firstName: "Maya",
		lastName: "Adventure",
		username: "mayaadventure",
		email: "maya.adventure@example.com",
		bio: "Extreme sports enthusiast and nature photographer. Always seeking the next adrenaline rush.",
		location: "Vancouver, Canada",
		joinDate: "April 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.6,
			reviewsWritten: 203,
			followers: 4120,
			following: 1205,
		},
		isSubscribed: false,
		travelPreferences: ["adventure", "nature", "sports", "photography"],
		travelCategories: ["mountain", "forest", "parks", "lakes"],
	},
	{
		id: "6",
		firstName: "Carlos",
		lastName: "Foodie",
		username: "carlosfoodie",
		email: "carlos.foodie@example.com",
		bio: "Culinary explorer discovering authentic flavors around the globe. Food blogger and chef.",
		location: "Mexico City, Mexico",
		joinDate: "November 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.4,
			reviewsWritten: 167,
			followers: 2340,
			following: 678,
		},
		isSubscribed: false,
		travelPreferences: ["food", "culture", "street-food", "local"],
		travelCategories: ["city", "countryside", "markets"],
	},
	{
		id: "7",
		firstName: "Luna",
		lastName: "Photographer",
		username: "lunaphotos",
		email: "luna.photographer@example.com",
		bio: "Travel photographer capturing the beauty of landscapes and cultures worldwide.",
		location: "Reykjavik, Iceland",
		joinDate: "February 2021",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.9,
			reviewsWritten: 145,
			followers: 5670,
			following: 892,
		},
		isSubscribed: true,
		travelPreferences: ["photography", "nature", "culture", "solo"],
		travelCategories: ["mountain", "glaciers", "fjords", "volcanic"],
	},
	{
		id: "8",
		firstName: "David",
		lastName: "Backpacker",
		username: "davidbackpacks",
		email: "david.backpacker@example.com",
		bio: "Budget traveler sharing tips for affordable adventures. Hostels and local transport expert.",
		location: "Berlin, Germany",
		joinDate: "August 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.3,
			reviewsWritten: 234,
			followers: 1560,
			following: 1890,
		},
		isSubscribed: false,
		travelPreferences: ["budget", "culture", "local", "backpacking"],
		travelCategories: ["city", "countryside", "hostels"],
	},
	{
		id: "9",
		firstName: "Aria",
		lastName: "Wellness",
		username: "ariawellness",
		email: "aria.wellness@example.com",
		bio: "Wellness travel specialist focusing on yoga retreats, spas, and mindful journeys.",
		location: "Bali, Indonesia",
		joinDate: "May 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.7,
			reviewsWritten: 98,
			followers: 3210,
			following: 567,
		},
		isSubscribed: false,
		travelPreferences: ["wellness", "relaxation", "yoga", "spa"],
		travelCategories: ["beach", "tropical", "retreats", "islands"],
	},
	{
		id: "10",
		firstName: "Ryan",
		lastName: "Historian",
		username: "ryanhistory",
		email: "ryan.historian@example.com",
		bio: "History buff exploring ancient civilizations and archaeological sites around the world.",
		location: "Athens, Greece",
		joinDate: "December 2018",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.8,
			reviewsWritten: 189,
			followers: 2890,
			following: 445,
		},
		isSubscribed: true,
		travelPreferences: ["history", "culture", "archaeology", "museums"],
		travelCategories: ["historical", "ancient", "museums", "ruins"],
	},
	{
		id: "11",
		firstName: "Isabella",
		lastName: "Coastal",
		username: "bellacoastal",
		email: "isabella.coastal@example.com",
		bio: "Beach lover and marine life enthusiast. Diving instructor and ocean conservationist.",
		location: "Gold Coast, Australia",
		joinDate: "July 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.6,
			reviewsWritten: 112,
			followers: 2150,
			following: 634,
		},
		isSubscribed: false,
		travelPreferences: ["beach", "diving", "nature", "conservation"],
		travelCategories: ["coastal", "tropical", "islands", "reefs"],
	},
	{
		id: "12",
		firstName: "Kai",
		lastName: "Mountain",
		username: "kaimountain",
		email: "kai.mountain@example.com",
		bio: "Alpine climbing expert and mountain rescue volunteer. Sharing high-altitude adventures.",
		location: "Chamonix, France",
		joinDate: "March 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.9,
			reviewsWritten: 87,
			followers: 3890,
			following: 423,
		},
		isSubscribed: true,
		travelPreferences: ["climbing", "adventure", "nature", "extreme"],
		travelCategories: ["mountain", "alpine", "glaciers", "peaks"],
	},
	{
		id: "13",
		firstName: "Zara",
		lastName: "Urban",
		username: "zaraurban",
		email: "zara.urban@example.com",
		bio: "City explorer and street art enthusiast. Finding hidden gems in urban landscapes.",
		location: "Tokyo, Japan",
		joinDate: "October 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.4,
			reviewsWritten: 156,
			followers: 1780,
			following: 892,
		},
		isSubscribed: false,
		travelPreferences: ["urban", "art", "culture", "nightlife"],
		travelCategories: ["city", "metropolitan", "cultural", "modern"],
	},
	{
		id: "14",
		firstName: "Omar",
		lastName: "Desert",
		username: "omardesert",
		email: "omar.desert@example.com",
		bio: "Desert guide and astronomy enthusiast. Leading expeditions under starlit skies.",
		location: "Marrakech, Morocco",
		joinDate: "January 2021",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.7,
			reviewsWritten: 93,
			followers: 2340,
			following: 567,
		},
		isSubscribed: true,
		travelPreferences: ["desert", "astronomy", "adventure", "culture"],
		travelCategories: ["desert", "sahara", "oasis", "nomadic"],
	},
	{
		id: "15",
		firstName: "Nina",
		lastName: "Forest",
		username: "ninaforest",
		email: "nina.forest@example.com",
		bio: "Forest bathing guide and wildlife photographer. Connecting people with nature.",
		location: "Vancouver, Canada",
		joinDate: "June 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.8,
			reviewsWritten: 134,
			followers: 2890,
			following: 445,
		},
		isSubscribed: false,
		travelPreferences: ["forest", "wildlife", "photography", "mindfulness"],
		travelCategories: ["forest", "national-parks", "wilderness", "eco"],
	},
	{
		id: "16",
		firstName: "Liam",
		lastName: "Island",
		username: "liamisland",
		email: "liam.island@example.com",
		bio: "Island hopper and sailing enthusiast. Discovering remote paradises around the globe.",
		location: "Santorini, Greece",
		joinDate: "April 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.5,
			reviewsWritten: 78,
			followers: 1650,
			following: 723,
		},
		isSubscribed: false,
		travelPreferences: ["sailing", "islands", "beach", "adventure"],
		travelCategories: ["islands", "tropical", "coastal", "remote"],
	},
	{
		id: "17",
		firstName: "Priya",
		lastName: "Spiritual",
		username: "priyaspiritual",
		email: "priya.spiritual@example.com",
		bio: "Spiritual journey guide and meditation teacher. Seeking enlightenment through travel.",
		location: "Rishikesh, India",
		joinDate: "September 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.9,
			reviewsWritten: 102,
			followers: 3450,
			following: 234,
		},
		isSubscribed: true,
		travelPreferences: ["spiritual", "meditation", "yoga", "culture"],
		travelCategories: ["temples", "ashrams", "sacred", "pilgrimage"],
	},
	{
		id: "18",
		firstName: "Felix",
		lastName: "Arctic",
		username: "felixarctic",
		email: "felix.arctic@example.com",
		bio: "Polar expedition leader and climate researcher. Exploring Earth's frozen frontiers.",
		location: "Tromsø, Norway",
		joinDate: "November 2018",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.8,
			reviewsWritten: 67,
			followers: 4120,
			following: 156,
		},
		isSubscribed: false,
		travelPreferences: ["arctic", "expedition", "research", "extreme"],
		travelCategories: ["arctic", "glaciers", "polar", "wilderness"],
	},
	{
		id: "19",
		firstName: "Camila",
		lastName: "Volcano",
		username: "camilavolcano",
		email: "camila.volcano@example.com",
		bio: "Volcanologist and adventure photographer. Capturing the raw power of Earth.",
		location: "Guatemala City, Guatemala",
		joinDate: "February 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.6,
			reviewsWritten: 89,
			followers: 2780,
			following: 445,
		},
		isSubscribed: true,
		travelPreferences: ["volcano", "geology", "adventure", "photography"],
		travelCategories: ["volcanic", "mountains", "extreme", "geological"],
	},
	{
		id: "20",
		firstName: "Hassan",
		lastName: "Nomad",
		username: "hassannomad",
		email: "hassan.nomad@example.com",
		bio: "Traditional nomad guide sharing ancient routes and desert wisdom.",
		location: "Ouarzazate, Morocco",
		joinDate: "August 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.7,
			reviewsWritten: 145,
			followers: 1890,
			following: 567,
		},
		isSubscribed: false,
		travelPreferences: ["nomadic", "desert", "culture", "traditional"],
		travelCategories: ["desert", "nomadic", "cultural", "historical"],
	},
	{
		id: "21",
		firstName: "Yuki",
		lastName: "Snow",
		username: "yukisnow",
		email: "yuki.snow@example.com",
		bio: "Ski instructor and winter sports enthusiast. Chasing powder around the world.",
		location: "Niseko, Japan",
		joinDate: "December 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.5,
			reviewsWritten: 76,
			followers: 2340,
			following: 678,
		},
		isSubscribed: false,
		travelPreferences: ["skiing", "winter", "sports", "mountains"],
		travelCategories: ["ski-resorts", "mountains", "alpine", "winter"],
	},
	{
		id: "22",
		firstName: "Elena",
		lastName: "Wine",
		username: "elenawine",
		email: "elena.wine@example.com",
		bio: "Sommelier and vineyard explorer. Discovering the world's finest wine regions.",
		location: "Bordeaux, France",
		joinDate: "May 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.8,
			reviewsWritten: 123,
			followers: 3210,
			following: 445,
		},
		isSubscribed: true,
		travelPreferences: ["wine", "culinary", "luxury", "culture"],
		travelCategories: [
			"wine-regions",
			"countryside",
			"vineyards",
			"gourmet",
		],
	},
	{
		id: "23",
		firstName: "Jamal",
		lastName: "Safari",
		username: "jamalsafari",
		email: "jamal.safari@example.com",
		bio: "Wildlife guide and conservation photographer. Protecting Africa's magnificent creatures.",
		location: "Nairobi, Kenya",
		joinDate: "March 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.9,
			reviewsWritten: 167,
			followers: 4560,
			following: 234,
		},
		isSubscribed: false,
		travelPreferences: [
			"safari",
			"wildlife",
			"photography",
			"conservation",
		],
		travelCategories: ["safari", "national-parks", "wildlife", "savanna"],
	},
	{
		id: "24",
		firstName: "Astrid",
		lastName: "Fjord",
		username: "astridfjord",
		email: "astrid.fjord@example.com",
		bio: "Nordic culture expert and fjord kayaking guide. Exploring Scandinavia's natural beauty.",
		location: "Bergen, Norway",
		joinDate: "July 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.7,
			reviewsWritten: 98,
			followers: 2890,
			following: 567,
		},
		isSubscribed: true,
		travelPreferences: ["fjords", "kayaking", "nordic", "nature"],
		travelCategories: ["fjords", "coastal", "nordic", "wilderness"],
	},
	{
		id: "25",
		firstName: "Diego",
		lastName: "Jungle",
		username: "diegojungle",
		email: "diego.jungle@example.com",
		bio: "Rainforest guide and ethnobotanist. Learning from indigenous communities.",
		location: "Iquitos, Peru",
		joinDate: "October 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.6,
			reviewsWritten: 134,
			followers: 1780,
			following: 445,
		},
		isSubscribed: false,
		travelPreferences: ["jungle", "indigenous", "botany", "adventure"],
		travelCategories: ["rainforest", "jungle", "amazon", "tribal"],
	},
	{
		id: "26",
		firstName: "Fatima",
		lastName: "Oasis",
		username: "fatimaoasis",
		email: "fatima.oasis@example.com",
		bio: "Desert oasis specialist and traditional crafts expert. Preserving ancient traditions.",
		location: "Siwa, Egypt",
		joinDate: "January 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.8,
			reviewsWritten: 87,
			followers: 2450,
			following: 323,
		},
		isSubscribed: true,
		travelPreferences: ["oasis", "crafts", "traditional", "culture"],
		travelCategories: ["oasis", "desert", "traditional", "artisan"],
	},
	{
		id: "27",
		firstName: "Thor",
		lastName: "Glacier",
		username: "thorglacier",
		email: "thor.glacier@example.com",
		bio: "Glaciologist and ice climbing instructor. Studying climate change through ice.",
		location: "Reykjavik, Iceland",
		joinDate: "September 2018",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.9,
			reviewsWritten: 76,
			followers: 3670,
			following: 189,
		},
		isSubscribed: false,
		travelPreferences: ["glaciers", "climbing", "research", "extreme"],
		travelCategories: ["glaciers", "arctic", "ice", "research"],
	},
	{
		id: "28",
		firstName: "Sakura",
		lastName: "Temple",
		username: "sakuratemple",
		email: "sakura.temple@example.com",
		bio: "Temple architecture historian and meditation practitioner. Exploring sacred spaces.",
		location: "Kyoto, Japan",
		joinDate: "April 2019",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.7,
			reviewsWritten: 145,
			followers: 2340,
			following: 456,
		},
		isSubscribed: true,
		travelPreferences: [
			"temples",
			"meditation",
			"architecture",
			"spiritual",
		],
		travelCategories: ["temples", "sacred", "historical", "zen"],
	},
	{
		id: "29",
		firstName: "Mateo",
		lastName: "Waterfall",
		username: "mateowaterfall",
		email: "mateo.waterfall@example.com",
		bio: "Waterfall chaser and hydrogeologist. Following water's journey through landscapes.",
		location: "Iguazu, Argentina",
		joinDate: "June 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.5,
			reviewsWritten: 112,
			followers: 1950,
			following: 634,
		},
		isSubscribed: false,
		travelPreferences: ["waterfalls", "hydrology", "nature", "photography"],
		travelCategories: ["waterfalls", "rivers", "natural", "geological"],
	},
	{
		id: "30",
		firstName: "Amara",
		lastName: "Coral",
		username: "amaracoral",
		email: "amara.coral@example.com",
		bio: "Marine biologist and coral reef conservationist. Protecting underwater ecosystems.",
		location: "Cairns, Australia",
		joinDate: "August 2020",
		profilePicture: "/placeholder.svg?height=40&width=40",
		stats: {
			rating: 4.8,
			reviewsWritten: 98,
			followers: 3120,
			following: 445,
		},
		isSubscribed: true,
		travelPreferences: ["coral", "diving", "marine", "conservation"],
		travelCategories: ["coral-reefs", "marine", "tropical", "underwater"],
	},
];

const USERS_PER_PAGE = 9;

const simulateApiCall = (
	page: number,
	pageSize: number,
	allUsers: UserInfo[],
	delay = 1000,
): Promise<{
	users: UserInfo[];
	hasMore: boolean;
	total: number;
}> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			const users = allUsers.slice(startIndex, endIndex);
			const hasMore = endIndex < allUsers.length;

			resolve({
				users,
				hasMore,
				total: allUsers.length,
			});
		}, delay);
	});
};

export default function UsersPage() {
	const [users, setUsers] = useState<UserInfo[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [totalUsers, setTotalUsers] = useState(0);

	const [searchQuery, setSearchQuery] = useState("");
	const [sortBy, setSortBy] = useState("rating-desc");
	const [filterBySubscription, setFilterBySubscription] = useState("all");

	const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([]);

	useEffect(() => {
		let filtered = mockUsers.filter((user) => {
			if (searchQuery) {
				const fullName =
					`${user.firstName} ${user.lastName}`.toLowerCase();
				const username = user.username.toLowerCase();
				const query = searchQuery.toLowerCase();
				if (!fullName.includes(query) && !username.includes(query)) {
					return false;
				}
			}

			if (filterBySubscription === "subscribed" && !user.isSubscribed)
				return false;
			if (filterBySubscription === "not-subscribed" && user.isSubscribed)
				return false;

			return true;
		});

		filtered = filtered.sort((a, b) => {
			switch (sortBy) {
				case "name-asc":
					return `${a.firstName} ${a.lastName}`.localeCompare(
						`${b.firstName} ${b.lastName}`,
					);
				case "name-desc":
					return `${b.firstName} ${b.lastName}`.localeCompare(
						`${a.firstName} ${a.lastName}`,
					);
				case "rating-asc":
					return a.stats.rating - b.stats.rating;
				case "rating-desc":
					return b.stats.rating - a.stats.rating;
				case "followers-asc":
					return a.stats.followers - b.stats.followers;
				case "followers-desc":
					return b.stats.followers - a.stats.followers;
				case "reviews-asc":
					return a.stats.reviewsWritten - b.stats.reviewsWritten;
				case "reviews-desc":
					return b.stats.reviewsWritten - a.stats.reviewsWritten;
				default:
					return 0;
			}
		});

		setFilteredUsers(filtered);

		setUsers([]);
		setCurrentPage(1);
		setHasMore(true);
	}, [searchQuery, sortBy, filterBySubscription]);

	useEffect(() => {
		if (filteredUsers.length > 0) {
			fetchUsers(true);
		}
	}, [filteredUsers]);

	const fetchUsers = async (isInitial = false) => {
		if (isInitial) {
			setLoading(true);
			setError(null);
		} else {
			setLoadingMore(true);
		}

		try {
			const response = await simulateApiCall(
				isInitial ? 1 : currentPage,
				USERS_PER_PAGE,
				filteredUsers,
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
		} catch (err) {
			setError("Failed to load users. Please try again.");
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

	const handleSubscriptionToggle = (userId: string) => {
		setUsers(
			users.map((user) =>
				user.id === userId
					? { ...user, isSubscribed: !user.isSubscribed }
					: user,
			),
		);

		const userIndex = mockUsers.findIndex((u) => u.id === userId);
		if (userIndex !== -1) {
			mockUsers[userIndex].isSubscribed =
				!mockUsers[userIndex].isSubscribed;
		}
	};

	const clearFilters = () => {
		setSearchQuery("");
		setFilterBySubscription("all");
		setSortBy("rating-desc");
	};

	const activeFiltersCount = [
		searchQuery,
		filterBySubscription !== "all",
	].filter(Boolean).length;

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
						<p className="text-muted-foreground">
							Loading users...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">
						Error Loading Users
					</h1>
					<p className="text-muted-foreground mb-4">{error}</p>
					<Button
						onClick={() => fetchUsers(true)}
						className="flex items-center gap-2"
					>
						<RefreshCw className="h-4 w-4" />
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-2">
						<Users className="w-8 h-8" />
						Discover Users
					</h1>
					<p className="text-muted-foreground mt-1">
						Find and connect with fellow travelers from around the
						world
					</p>
				</div>
				{activeFiltersCount > 0 && (
					<Button
						variant="outline"
						onClick={clearFilters}
						className="flex items-center gap-2"
					>
						<X className="h-4 w-4" />
						Clear Filters ({activeFiltersCount})
					</Button>
				)}
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						Search & Filter
					</CardTitle>
					<CardDescription>
						Find users by name, username, or subscription status
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="search">Search Users</Label>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="search"
									placeholder="Search by name or username..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="pl-8"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="subscription-filter">
								Subscription Status
							</Label>
							<Select
								value={filterBySubscription}
								onValueChange={setFilterBySubscription}
							>
								<SelectTrigger id="subscription-filter">
									<SelectValue placeholder="Filter by subscription" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										All Users
									</SelectItem>
									<SelectItem value="subscribed">
										Subscribed
									</SelectItem>
									<SelectItem value="not-subscribed">
										Not Subscribed
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="sort-by">Sort By</Label>
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger id="sort-by">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="rating-desc">
										Highest Rating
									</SelectItem>
									<SelectItem value="rating-asc">
										Lowest Rating
									</SelectItem>
									<SelectItem value="followers-desc">
										Most Followers
									</SelectItem>
									<SelectItem value="followers-asc">
										Least Followers
									</SelectItem>
									<SelectItem value="reviews-desc">
										Most Reviews
									</SelectItem>
									<SelectItem value="reviews-asc">
										Least Reviews
									</SelectItem>
									<SelectItem value="name-asc">
										Name (A-Z)
									</SelectItem>
									<SelectItem value="name-desc">
										Name (Z-A)
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="mb-4">
				<p className="text-muted-foreground">
					Showing {users.length} of {totalUsers} users
					{totalUsers !== mockUsers.length &&
						` (${totalUsers} match your filters)`}
				</p>
			</div>

			{users.length === 0 && !loading ? (
				<div className="text-center py-12">
					<Users className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
					<h3 className="text-lg font-semibold mb-2">
						No users found
					</h3>
					<p className="text-muted-foreground mb-4">
						{totalUsers === 0
							? "Try adjusting your search or filter criteria"
							: "No users available at the moment"}
					</p>
					{activeFiltersCount > 0 && (
						<Button variant="outline" onClick={clearFilters}>
							Clear All Filters
						</Button>
					)}
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{users.map((user) => (
							<Card
								key={user.id}
								className="hover:shadow-lg transition-shadow"
							>
								<CardContent className="p-4">
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center gap-3 flex-1 min-w-0">

											<div className="min-w-0 flex-1">
												<Link
													to={`${ROUTES.PROFILE}/${user.id}`}
													className="hover:underline"
												>
													<h3 className="font-semibold text-lg truncate">
														{user.firstName}{" "}
														{user.lastName}
													</h3>
												</Link>
												<p className="text-sm text-muted-foreground truncate">
													@{user.username}
												</p>

											</div>
										</div>
										<Button
											variant={
												user.isSubscribed
													? "outline"
													: "default"
											}
											size="sm"
											onClick={() =>
												handleSubscriptionToggle(
													user.id,
												)
											}
											className="flex-shrink-0 ml-2"
										>
											{user.isSubscribed ? (
												<>
													<UserMinus className="w-4 h-4 mr-1" />
													Unsubscribe
												</>
											) : (
												<>
													<UserPlus className="w-4 h-4 mr-1" />
													Subscribe
												</>
											)}
										</Button>
									</div>

									<div className="grid grid-cols-2 gap-3 mb-3">
										<div className="flex items-center gap-2">
											<Star className="w-4 h-4 text-yellow-500" />
											<div>
												<div className="text-sm font-semibold">
													{user.stats.rating.toFixed(
														1,
													)}
												</div>
												<div className="text-xs text-muted-foreground">
													Rating
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<FileText className="w-4 h-4 text-blue-500" />
											<div>
												<div className="text-sm font-semibold">
													{formatNumber(
														user.stats
															.reviewsWritten,
													)}
												</div>
												<div className="text-xs text-muted-foreground">
													Reviews
												</div>
											</div>
										</div>
									</div>

									<div className="flex justify-between text-xs text-muted-foreground border-t pt-2">
										<span className="flex items-center gap-1">
											<Users className="w-3 h-3" />
											{formatNumber(
												user.stats.followers,
											)}{" "}
											followers
										</span>
										<span>Joined {user.joinDate}</span>
									</div>

									{user.isSubscribed && (
										<div className="mt-2">
											<Badge
												variant="secondary"
												className="text-xs"
											>
												Subscribed
											</Badge>
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
										Loading more users...
									</>
								) : (
									<>Load More Users</>
								)}
							</Button>
						</div>
					)}

					{!hasMore && users.length > 0 && (
						<div className="text-center mt-8 py-4 border-t">
							<p className="text-muted-foreground">
								You've reached the end! Showing all{" "}
								{users.length} users.
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}
