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
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";
import { useTranslation } from "react-i18next"; // Import useTranslation

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
	{ label: "Within 10 km", value: "100" },
	{ label: "Within 25 km", value: "250" },
	{ label: "Within 50 km", value: "500" },
	{ label: "Within 100 km", value: "1000" },
	{ label: "Within 250 km", value: "2500" },
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
	const { t } = useTranslation(); // Initialize useTranslation
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
				<h1 className="text-3xl font-bold">
					{t("recommendationsPage.title")}
				</h1>
				{activeFiltersCount > 0 && (
					<Button
						variant="outline"
						onClick={clearFilters}
						className="flex items-center gap-2"
					>
						<X className="h-4 w-4" />
						{t("recommendationsPage.clearFiltersButton", {
							count: activeFiltersCount,
						})}
					</Button>
				)}
			</div>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Filter className="h-5 w-5" />
						{t("recommendationsPage.filtersAndSearchTitle")}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="search-name">
								{t("recommendationsPage.searchByNameLabel")}
							</Label>
							<div className="relative">
								<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									id="search-name"
									placeholder={t(
										"recommendationsPage.searchPlacesPlaceholder",
									)}
									value={searchName}
									onChange={(e) =>
										setSearchName(e.target.value)
									}
									className="pl-8"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="search-city">
								{t("recommendationsPage.searchByCityLabel")}
							</Label>
							<div className="relative">
								<MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="w-full">
												<Input
													id="search-city"
													placeholder={t(
														"recommendationsPage.searchCitiesPlaceholder",
													)}
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
													{t(
														"recommendationsPage.uncheckLocationTooltip",
													)}
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
													{t(
														"recommendationsPage.clearCityFieldTooltip",
													)}
												</p>
											</TooltipContent>
										)}
									</Tooltip>
								</TooltipProvider>
								<Label
									htmlFor="use-my-location"
									className="text-base"
								>
									{t(
										"recommendationsPage.useMyLocationLabel",
									)}
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
									{t(
										"recommendationsPage.showOnlyFavoritesLabel",
									)}
								</Label>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label
									htmlFor="distance"
									className="flex items-center gap-1"
								>
									{t(
										"recommendationsPage.distanceFilterLabel",
									)}
									{isDistanceFilterDisabled && (
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Info className="h-4 w-4 text-muted-foreground" />
												</TooltipTrigger>
												<TooltipContent>
													<p>
														{t(
															"recommendationsPage.enableDistanceFilterTooltip",
														)}
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
									<SelectValue
										placeholder={t(
											"recommendationsPage.selectDistancePlaceholder",
										)}
									/>
								</SelectTrigger>
								<SelectContent>
									{distanceOptions.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value}
										>
											{t(
												`recommendationsPage.distanceOption.${option.value}`,
											)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{isDistanceFilterDisabled && (
								<p className="text-xs text-muted-foreground">
									{t(
										"recommendationsPage.enableDistanceFilterMessage",
									)}
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
								{t(
									"recommendationsPage.useProfilePreferencesTitle",
								)}
							</Label>
							<p className="text-sm text-muted-foreground">
								{t(
									"recommendationsPage.useProfilePreferencesDescription",
								)}
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
							<Label htmlFor="travel-tags">
								{t("recommendationsPage.travelTagsLabel")}
							</Label>
							<MultiSelect
								options={travelTagsOptions.map((option) => ({
									label: option.label,
									value: option.value,
								}))}
								selected={selectedTravelTags}
								onChange={setSelectedTravelTags}
								placeholder={t(
									"recommendationsPage.selectTravelTagsPlaceholder",
								)}
								disabled={useProfilePreferences}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="travel-categories">
								{t("recommendationsPage.travelCategoriesLabel")}
							</Label>
							<MultiSelect
								options={travelCategoriesOptions.map(
									(option) => ({
										label: option.label,
										value: option.value,
									}),
								)}
								selected={selectedTravelCategories}
								onChange={setSelectedTravelCategories}
								placeholder={t(
									"recommendationsPage.selectTravelCategoriesPlaceholder",
								)}
								disabled={useProfilePreferences}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="sort-by">
							{t("recommendationsPage.sortByLabel")}
						</Label>
						<Select value={sort} onValueChange={setSort}>
							<SelectTrigger id="sort-by" className="md:w-48">
								<SelectValue
									placeholder={t(
										"recommendationsPage.sortByPlaceholder",
									)}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="rating">
									{t(
										"recommendationsPage.sortByOptionRating",
									)}
								</SelectItem>
								<SelectItem value="name">
									{t("recommendationsPage.sortByOptionName")}
								</SelectItem>
								{distance !== "none" && (
									<SelectItem value="distance">
										{t(
											"recommendationsPage.sortByOptionDistance",
										)}
									</SelectItem>
								)}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			<div className="mb-4">
				<p className="text-muted-foreground">
					{t("recommendationsPage.showingPlaces", {
						filteredCount: filteredAndSortedPlaces.length,
						totalCount: places.length,
					})}
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredAndSortedPlaces.map((place) => (
					<Link to={`${ROUTES.PLACES}/${place.id}`} key={place.id}>
						<Card className="hover:shadow-lg transition-shadow">
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
									<span className="text-sm">
										{place.city}
									</span>
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
											{t(
												"recommendationsPage.distanceUnit",
											)}
										</span>
									)}
								</div>

								<div className="mb-2">
									<div className="flex flex-wrap gap-1">
										{place.travelTags
											.slice(0, 3)
											.map((tag) => (
												<span
													key={tag}
													className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
												>
													{t(
														`travelTagsOptions.${tag}`,
													)}
												</span>
											))}
										{place.travelTags.length > 3 && (
											<span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
												{t(
													"recommendationsPage.moreTags",
													{
														count:
															place.travelTags
																.length - 3,
													},
												)}
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
												{t(
													`travelCategoriesOptions.${category}`,
												)}
											</span>
										))}
									{place.travelCategories.length > 2 && (
										<span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
											{t(
												"recommendationsPage.moreCategories",
												{
													count:
														place.travelCategories
															.length - 2,
												},
											)}
										</span>
									)}
								</div>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			{filteredAndSortedPlaces.length === 0 && (
				<div className="text-center py-12">
					<div className="text-muted-foreground mb-4">
						<Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
						<h3 className="text-lg font-semibold mb-2">
							{t("recommendationsPage.noPlacesFoundTitle")}
						</h3>
						<p>{t("recommendationsPage.noPlacesFoundMessage")}</p>
					</div>
					<Button variant="outline" onClick={clearFilters}>
						{t("recommendationsPage.clearAllFiltersButton")}
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
		image: "https://scontent.fplv1-1.fna.fbcdn.net/v/t39.30808-6/473779983_1012373487584",
		travelTags: ["nature-wildlife", "relaxation-wellness", "family-travel"],
		travelCategories: ["parks", "river-banks"],
		rating: 4.9,
		coordinates: { lat: 50.4907, lng: 30.5401 },
	},
	{
		id: 5,
		name: "Lviv Old Town",
		city: "Lviv",
		image: "https://www.shutterstock.com/search/lviv-old-town",
		travelTags: [
			"historical-sites",
			"cultural-immersion",
			"architecture",
			"food-cuisine",
		],
		travelCategories: ["metropolitan-cities", "ancient-ruins"],
		rating: 4.9,
		coordinates: { lat: 49.8419, lng: 24.0315 },
	},
	{
		id: 6,
		name: "Carpathian Mountains",
		city: "Zakarpattia Oblast",
		image: "https://www.shutterstock.com/search/carpathian-mountains",
		travelTags: [
			"adventure-sports",
			"nature-wildlife",
			"photography",
			"relaxation-wellness",
		],
		travelCategories: ["mountain-ranges", "rural-countryside"],
		rating: 4.7,
		coordinates: { lat: 48.2917, lng: 24.5967 },
	},
	{
		id: 7,
		name: "Odesa Opera and Ballet Theater",
		city: "Odesa",
		image: "https://www.shutterstock.com/search/odesa-opera-ballet-theater",
		travelTags: [
			"art-museums",
			"cultural-immersion",
			"architecture",
			"nightlife-entertainment",
		],
		travelCategories: ["metropolitan-cities", "theaters"],
		rating: 4.8,
		coordinates: { lat: 46.4851, lng: 30.7408 },
	},
	{
		id: 8,
		name: "Kamianets-Podilskyi Castle",
		city: "Kamianets-Podilskyi",
		image: "https://www.shutterstock.com/search/kamianets-podilskyi-castle",
		travelTags: [
			"historical-sites",
			"architecture",
			"photography",
			"cultural-immersion",
		],
		travelCategories: ["ancient-ruins", "castles"],
		rating: 4.9,
		coordinates: { lat: 48.675, lng: 26.585 },
	},
	{
		id: 9,
		name: "Chernivtsi National University",
		city: "Chernivtsi",
		image: "https://www.shutterstock.com/search/chernivtsi-national-university",
		travelTags: [
			"architecture",
			"historical-sites",
			"photography",
			"cultural-immersion",
		],
		travelCategories: ["universities", "architectural-marvels"],
		rating: 4.7,
		coordinates: { lat: 48.2979, lng: 25.9366 },
	},
	{
		id: 10,
		name: "Sofiyivsky Park",
		city: "Uman",
		image: "https://www.shutterstock.com/search/sofiyivsky-park",
		travelTags: ["nature-wildlife", "relaxation-wellness", "photography"],
		travelCategories: ["parks", "botanical-gardens"],
		rating: 4.8,
		coordinates: { lat: 48.7844, lng: 30.2227 },
	},
];
