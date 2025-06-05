"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import { Star, Search, MapPin, Filter, X, Heart, Info } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

const userPreferences = {
	travelTags: [
		"adventure-sports",
		"cultural-immersion",
		"food-cuisine",
		"photography",
	],
	travelCategories: [
		"mountain-ranges",
		"metropolitan-cities",
		"coastal-towns",
		"wine-regions",
	],
	location: {
		lat: 37.7749,
		lng: -122.4194,
		city: "San Francisco, CA",
	},
};

const travelTagsOptions = [
	{ label: "Adventure Sports", value: "adventure-sports" },
	{ label: "Cultural Immersion", value: "cultural-immersion" },
	{ label: "Food & Cuisine", value: "food-cuisine" },
	{ label: "Photography", value: "photography" },
	{ label: "Historical Sites", value: "historical-sites" },
	{ label: "Nature & Wildlife", value: "nature-wildlife" },
	{ label: "Relaxation & Wellness", value: "relaxation-wellness" },
	{ label: "Nightlife & Entertainment", value: "nightlife-entertainment" },
	{ label: "Shopping & Markets", value: "shopping-markets" },
	{ label: "Art & Museums", value: "art-museums" },
	{ label: "Music & Festivals", value: "music-festivals" },
	{ label: "Architecture", value: "architecture" },
	{ label: "Local Transportation", value: "local-transportation" },
	{ label: "Street Food", value: "street-food" },
	{ label: "Luxury Travel", value: "luxury-travel" },
	{ label: "Budget Travel", value: "budget-travel" },
	{ label: "Solo Travel", value: "solo-travel" },
	{ label: "Family Travel", value: "family-travel" },
	{ label: "Eco Tourism", value: "eco-tourism" },
	{ label: "Volunteer Travel", value: "volunteer-travel" },
];

const travelCategoriesOptions = [
	{ label: "Tropical Beaches", value: "tropical-beaches" },
	{ label: "Mountain Ranges", value: "mountain-ranges" },
	{ label: "Metropolitan Cities", value: "metropolitan-cities" },
	{ label: "Rural Countryside", value: "rural-countryside" },
	{ label: "Ancient Ruins", value: "ancient-ruins" },
	{ label: "National Parks", value: "national-parks" },
	{ label: "Private Islands", value: "private-islands" },
	{ label: "Desert Landscapes", value: "desert-landscapes" },
	{ label: "Rainforests", value: "rainforests" },
	{ label: "Alpine Lakes", value: "alpine-lakes" },
	{ label: "Coastal Towns", value: "coastal-towns" },
	{ label: "Wine Regions", value: "wine-regions" },
	{ label: "Ski Resorts", value: "ski-resorts" },
	{ label: "Safari Destinations", value: "safari-destinations" },
	{ label: "Volcanic Areas", value: "volcanic-areas" },
	{ label: "Fjords", value: "fjords" },
	{ label: "Coral Reefs", value: "coral-reefs" },
	{ label: "Hot Springs", value: "hot-springs" },
	{ label: "Glaciers", value: "glaciers" },
	{ label: "Waterfalls", value: "waterfalls" },
];

const distanceOptions = [
	{ label: "None", value: "none" },
	{ label: "Within 10 km", value: "10" },
	{ label: "Within 25 km", value: "25" },
	{ label: "Within 50 km", value: "50" },
	{ label: "Within 100 km", value: "100" },
	{ label: "Within 250 km", value: "250" },
	{ label: "Within 500 km", value: "500" },
	{ label: "Within 1000 km", value: "1000" },
];

const calculateDistance = (
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number,
): number => {
	const R = 6371;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLng = ((lng2 - lng1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
};

export default function RecommendationsPage() {
	const [searchName, setSearchName] = useState("");
	const [searchCity, setSearchCity] = useState("");
	const [selectedTravelTags, setSelectedTravelTags] = useState<string[]>([]);
	const [selectedTravelCategories, setSelectedTravelCategories] = useState<
		string[]
	>([]);
	const [useProfilePreferences, setUseProfilePreferences] = useState(false);
	const [distance, setDistance] = useState("none");
	const [useMyLocation, setUseMyLocation] = useState(false);
	const [userCoordinates, setUserCoordinates] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 3, 5]);

	const [sort, setSort] = useState("rating");
	const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

	useEffect(() => {
		if (useMyLocation) {
			setUserCoordinates({
				lat: userPreferences.location.lat,
				lng: userPreferences.location.lng,
			});
		} else if (searchCity) {
			setUserCoordinates({
				lat: 34.0522,
				lng: -118.2437,
			});
		} else {
			setUserCoordinates(null);
		}
	}, [useMyLocation, searchCity]);

	useEffect(() => {
		if (useProfilePreferences) {
			setSelectedTravelTags(userPreferences.travelTags);
			setSelectedTravelCategories(userPreferences.travelCategories);
		} else {
			setSelectedTravelTags([]);
			setSelectedTravelCategories([]);
		}
	}, [useProfilePreferences]);

	useEffect(() => {
		if (!userCoordinates) {
			setDistance("none");
		}
	}, [userCoordinates]);

	const clearFilters = () => {
		setSearchName("");
		setSearchCity("");
		setSelectedTravelTags([]);
		setSelectedTravelCategories([]);
		setUseProfilePreferences(false);
		setDistance("none");
		setUseMyLocation(false);
		setShowOnlyFavorites(false);
	};

	const toggleFavorite = (placeId: number) => {
		if (favoriteIds.includes(placeId)) {
			setFavoriteIds(favoriteIds.filter((id) => id !== placeId));
		} else {
			setFavoriteIds([...favoriteIds, placeId]);
		}
	};

	const filteredAndSortedPlaces = places
		.filter((place) => {
			if (showOnlyFavorites && !favoriteIds.includes(place.id)) {
				return false;
			}

			if (
				searchName &&
				!place.name.toLowerCase().includes(searchName.toLowerCase())
			) {
				return false;
			}

			if (
				searchCity &&
				!place.city.toLowerCase().includes(searchCity.toLowerCase())
			) {
				return false;
			}

			if (selectedTravelTags.length > 0) {
				const hasMatchingTag = selectedTravelTags.some((tag) =>
					place.travelTags.includes(tag),
				);
				if (!hasMatchingTag) return false;
			}

			if (selectedTravelCategories.length > 0) {
				const hasMatchingCategory = selectedTravelCategories.some(
					(category) => place.travelCategories.includes(category),
				);
				if (!hasMatchingCategory) return false;
			}

			if (distance !== "none" && userCoordinates) {
				const placeDistance = calculateDistance(
					userCoordinates.lat,
					userCoordinates.lng,
					place.coordinates.lat,
					place.coordinates.lng,
				);
				if (placeDistance > Number.parseInt(distance)) return false;
			}

			return true;
		})
		.sort((a, b) => {
			if (sort === "rating") return b.rating - a.rating;
			if (sort === "name") return a.name.localeCompare(b.name);
			if (sort === "distance" && userCoordinates) {
				const distanceA = calculateDistance(
					userCoordinates.lat,
					userCoordinates.lng,
					a.coordinates.lat,
					a.coordinates.lng,
				);
				const distanceB = calculateDistance(
					userCoordinates.lat,
					userCoordinates.lng,
					b.coordinates.lat,
					b.coordinates.lng,
				);
				return distanceA - distanceB;
			}
			return 0;
		});

	const activeFiltersCount = [
		searchName,
		searchCity,
		selectedTravelTags.length > 0,
		selectedTravelCategories.length > 0,
		distance !== "none",
		showOnlyFavorites,
	].filter(Boolean).length;

	const isDistanceFilterDisabled = !userCoordinates;

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Recommended Places</h1>
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
						Filters & Search
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="search-name">
								Search by Place Name
							</Label>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="search-name"
									placeholder="Search places..."
									value={searchName}
									onChange={(e) =>
										setSearchName(e.target.value)
									}
									className="pl-8"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="search-city">Search by City</Label>
							<div className="relative">
								<MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="w-full">
												<Input
													id="search-city"
													placeholder="Search cities..."
													value={searchCity}
													onChange={(e) =>
														setSearchCity(
															e.target.value,
														)
													}
													className="pl-8"
													disabled={useMyLocation}
												/>
											</div>
										</TooltipTrigger>
										{useMyLocation && (
											<TooltipContent>
												<p>
													Uncheck "Use my location" to
													enter a city manually
												</p>
											</TooltipContent>
										)}
									</Tooltip>
								</TooltipProvider>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div>
												<Checkbox
													id="use-my-location"
													checked={useMyLocation}
													onCheckedChange={(
														checked: boolean,
													) =>
														setUseMyLocation(
															checked === true,
														)
													}
													disabled={!!searchCity}
												/>
											</div>
										</TooltipTrigger>
										{searchCity && (
											<TooltipContent>
												<p>
													Clear the city field to use
													your location
												</p>
											</TooltipContent>
										)}
									</Tooltip>
								</TooltipProvider>
								<Label
									htmlFor="use-my-location"
									className="text-base"
								>
									Use my location
								</Label>
								{useMyLocation && (
									<span className="text-sm text-muted-foreground">
										({userPreferences.location.city})
									</span>
								)}
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="show-favorites"
									checked={showOnlyFavorites}
									onCheckedChange={(checked: boolean) =>
										setShowOnlyFavorites(checked === true)
									}
								/>
								<Label
									htmlFor="show-favorites"
									className="text-base"
								>
									Show only favorites
								</Label>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label
									htmlFor="distance"
									className="flex items-center gap-1"
								>
									Distance Filter
									{isDistanceFilterDisabled && (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className="h-4 w-4 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p>
														Enter a city or use your
														location to enable
														distance filtering
													</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									)}
								</Label>
							</div>
							<Select
								value={distance}
								onValueChange={setDistance}
								disabled={isDistanceFilterDisabled}
							>
								<SelectTrigger id="distance">
									<SelectValue placeholder="Select distance" />
								</SelectTrigger>
								<SelectContent>
									{distanceOptions.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{isDistanceFilterDisabled && (
								<p className="text-xs text-muted-foreground">
									Enter a city or use your location to enable
								</p>
							)}
						</div>
					</div>

					<div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
						<div className="space-y-1">
							<Label
								htmlFor="use-profile-preferences"
								className="text-base font-medium"
							>
								Use My Profile Preferences
							</Label>
							<p className="text-sm text-muted-foreground">
								Automatically fill filters with your saved
								travel preferences
							</p>
						</div>
						<Switch
							id="use-profile-preferences"
							checked={useProfilePreferences}
							onCheckedChange={setUseProfilePreferences}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="travel-tags">Travel Tags</Label>
							<MultiSelect
								options={travelTagsOptions}
								selected={selectedTravelTags}
								onChange={setSelectedTravelTags}
								placeholder="Select travel tags..."
								disabled={useProfilePreferences}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="travel-categories">
								Travel Categories
							</Label>
							<MultiSelect
								options={travelCategoriesOptions}
								selected={selectedTravelCategories}
								onChange={setSelectedTravelCategories}
								placeholder="Select travel categories..."
								disabled={useProfilePreferences}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="sort-by">Sort by</Label>
						<Select value={sort} onValueChange={setSort}>
							<SelectTrigger id="sort-by" className="md:w-48">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="rating">Rating</SelectItem>
								<SelectItem value="name">Name</SelectItem>
								{distance !== "none" && (
									<SelectItem value="distance">
										Distance
									</SelectItem>
								)}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<div className="mb-4">
				<p className="text-muted-foreground">
					Showing {filteredAndSortedPlaces.length} of {places.length}{" "}
					places
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredAndSortedPlaces.map((place) => (
					<Card
						key={place.id}
						className="hover:shadow-lg transition-shadow"
					>
						<CardHeader className="p-0 relative">
							<img
								src={place.image || "/placeholder.svg"}
								alt={place.name}
								className="w-full h-48 object-cover rounded-t-lg"
							/>
							<div
								className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
								onClick={(e) => {
									e.stopPropagation();
									e.preventDefault();
									toggleFavorite(place.id);
								}}
							>
								<Heart
									className={`w-4 h-4 ${
										favoriteIds.includes(place.id)
											? "text-red-500 fill-current"
											: "text-gray-400"
									}`}
								/>
							</div>
						</CardHeader>
						<CardContent className="p-4">
							<CardTitle className="text-xl mb-2">
								{place.name}
							</CardTitle>
							<div className="flex items-center mb-2 text-muted-foreground">
								<MapPin className="w-4 h-4 mr-1" />
								<span className="text-sm">{place.city}</span>
							</div>
							<div className="flex items-center mb-3">
								<Star className="w-5 h-5 text-yellow-400 fill-current" />
								<span className="ml-1 font-semibold">
									{place.rating.toFixed(1)}
								</span>
								{distance !== "none" && userCoordinates && (
									<span className="ml-auto text-sm text-muted-foreground">
										{calculateDistance(
											userCoordinates.lat,
											userCoordinates.lng,
											place.coordinates.lat,
											place.coordinates.lng,
										).toFixed(1)}{" "}
										km
									</span>
								)}
							</div>

							<div className="mb-2">
								<div className="flex flex-wrap gap-1">
									{place.travelTags.slice(0, 3).map((tag) => (
										<span
											key={tag}
											className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
										>
											{travelTagsOptions.find(
												(opt) => opt.value === tag,
											)?.label || tag}
										</span>
									))}
									{place.travelTags.length > 3 && (
										<span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
											+{place.travelTags.length - 3} more
										</span>
									)}
								</div>
							</div>

							<div className="flex flex-wrap gap-1">
								{place.travelCategories
									.slice(0, 2)
									.map((category) => (
										<span
											key={category}
											className="px-2 py-1 bg-secondary/10 text-secondary-foreground rounded-full text-xs"
										>
											{travelCategoriesOptions.find(
												(opt) => opt.value === category,
											)?.label || category}
										</span>
									))}
								{place.travelCategories.length > 2 && (
									<span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
										+{place.travelCategories.length - 2}{" "}
										more
									</span>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{filteredAndSortedPlaces.length === 0 && (
				<div className="text-center py-12">
					<div className="text-muted-foreground mb-4">
						<Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
						<h3 className="text-lg font-semibold mb-2">
							No places found
						</h3>
						<p>Try adjusting your filters or search terms</p>
					</div>
					<Button variant="outline" onClick={clearFilters}>
						Clear All Filters
					</Button>
				</div>
			)}
		</div>
	);
}

const places = [
	{
		id: 1,
		name: "VDNH (Exhibition Center of Ukraine)",
		city: "Kyiv",
		image: "https://www.alamy.com/stock-photo/soviet-vdnh-architecture-in-kiev.html", 
		travelTags: [
			"relaxation-wellness",
			"family-travel",
			"events-festivals",
		],
		travelCategories: ["parks", "cultural-centers"],
		rating: 4.6,
		coordinates: { lat: 50.3817, lng: 30.4772 },
	},
	{
		id: 2,
		name: "Andriyivskyy Descent",
		city: "Kyiv",
		image: "https://destinations.ua/storage/crop/articles/slider_173_max.jpg", 
		travelTags: ["historical-sites", "cultural-immersion", "art-museums"],
		travelCategories: ["ancient-streets", "architecture"],
		rating: 4.8,
		coordinates: { lat: 50.4594, lng: 30.5171 },
	},
	{
		id: 3,
		name: "Pyrohiv Museum",
		city: "Kyiv",
		image: "https://www.shutterstock.com/search/pyrohiv-museum", 
		travelTags: ["historical-sites", "photography", "nature-wildlife"],
		travelCategories: ["open-air-museums", "parks"],
		rating: 4.7,
		coordinates: { lat: 50.3599, lng: 30.5152 },
	},
	{
		id: 4,
		name: "Natalka Park",
		city: "Kyiv",
		image: "https://scontent.fplv1-1.fna.fbcdn.net/v/t39.30808-6/473779983_1012373487584468_3843425620001693165_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=60Ep0PyK6kMQ7kNvwHpAbrD&_nc_oc=AdldsViTGAUmZm-nhTaUOwCAJuGNrAOWKDrljvhCpk8lA0iRPmQLaXnvO4sJEMLaPNo&_nc_zt=23&_nc_ht=scontent.fplv1-1.fna&_nc_gid=zgYOVW4UZBYFTYCdiMZBUA&oh=00_AfKWkuDu7ZCt4vdNavHgERve7oN07E9LVTp2dJI4vOQcJQ&oe=68437F2D", // :contentReference[oaicite:3]{index=3}
		travelTags: ["relaxation-wellness", "nature-wildlife", "family-travel"],
		travelCategories: ["parks", "riverfronts"],
		rating: 4.9,
		coordinates: { lat: 50.5212, lng: 30.5056 },
	},
	{
		id: 5,
		name: "SkyBar",
		city: "Kyiv",
		image: "https://skybar.ua/en/", 
		travelTags: ["nightlife-entertainment", "luxury-travel"],
		travelCategories: ["bars-clubs"],
		rating: 4.2,
		coordinates: { lat: 50.4453, lng: 30.5207 },
	},
	{
		id: 6,
		name: "Kyiv Pechersk Lavra",
		city: "Kyiv",
		image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqCNPUepMqds9PuSP2mELTMC5OfwAnozCeY3ErQ9P6vHzS4OWen3GgRjhmjMm7BUMagcShuBwyQupIsxxVQdNJ37GQTU1wDI1oJQT4GKx_AT7o6ViBoXeIisEQuCTEdMG6L27k=s1360-w1360-h1020-rw", // :contentReference[oaicite:5]{index=5}
		travelTags: ["historical-sites", "cultural-immersion", "photography"],
		travelCategories: ["monasteries", "UNESCO-heritage"],
		rating: 4.8,
		coordinates: { lat: 50.4346, lng: 30.5571 },
	},
	{
		id: 7,
		name: "Hydropark",
		city: "Kyiv",
		image: "https://www.gettyimages.com/photos/hydropark-in-kyiv",
		travelTags: ["nature-wildlife", "family-travel", "adventure-sports"],
		travelCategories: ["parks", "river-beaches"],
		rating: 4.1,
		coordinates: { lat: 50.4503, lng: 30.5695 },
	},
	{
		id: 8,
		name: "Hryshko Botanical Garden",
		city: "Kyiv",
		image: "https://www.gettyimages.com/photos/hryshko-national-botanical-garden", 
		travelTags: ["nature-wildlife", "photography", "relaxation-wellness"],
		travelCategories: ["parks", "botanical-gardens"],
		rating: 4.7,
		coordinates: { lat: 50.4053, lng: 30.5637 },
	},
	{
		id: 9,
		name: "Trukhaniv Island",
		city: "Kyiv",
		image: "https://www.gettyimages.com/photos/trukhaniv-island-kyiv",
		travelTags: ["nature-wildlife", "adventure-sports", "eco-tourism"],
		travelCategories: ["islands", "beaches"],
		rating: 4.3,
		coordinates: { lat: 50.4683, lng: 30.5391 },
	},
	{
		id: 10,
		name: "Vozdvyzhenka",
		city: "Kyiv",
		image: "https://www.gettyimages.com/photos/vozdvyzhenka-kyiv",
		travelTags: ["architecture", "photography", "shopping-markets"],
		travelCategories: ["urban-quarters", "luxury-housing"],
		rating: 4.4,
		coordinates: { lat: 50.4608, lng: 30.5082 },
	},
];
