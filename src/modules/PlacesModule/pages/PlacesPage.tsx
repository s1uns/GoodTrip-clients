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
import { useTranslation } from "react-i18next";
import { useMyLocation } from "@/shared/utils/hooks/useMyLocation";
import useDebounce from "@/shared/utils/hooks/useDebounce";
import { Place } from "@/shared/types/Place";

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

const distanceOptions = ["none", "0.1", "0.25", "0.5", "1", "2.5", "5"];

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
	const { t } = useTranslation();
	const [searchName, setSearchName] = useState("");
	const [searchCity, setSearchCity] = useState("");
	const [loading, setLoading] = useState(false);
	const debouncedPlaceSearch = useDebounce(searchName);
	const debouncedCitySearch = useDebounce(searchCity);

	const [selectedTravelTags, setSelectedTravelTags] = useState<string[]>([]);
	const [selectedTravelCategories, setSelectedTravelCategories] = useState<
		string[]
	>([]);
	const [useProfilePreferences, setUseProfilePreferences] = useState(false);
	const [distance, setDistance] = useState("none");
	const [userCoordinates, setUserCoordinates] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 3, 5]);

	const [sort, setSort] = useState("rating-desc");
	const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
	const [places, setPlaces] = useState<Place[]>([]);
	const [useMyLocationCheckbox, setUseMyLocationCheckbox] = useState(false);

	const { getMyLocation } = useMyLocation();

	useEffect(() => {
		const fetchData = async () => {
			await handleGetPlaces();
		};

		fetchData();
	}, [
		debouncedCitySearch,
		debouncedPlaceSearch,
		showOnlyFavorites,
		userCoordinates,
		selectedTravelTags,
		selectedTravelCategories,
		distance,
		sort,
	]);

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

	const handleToggleLocation = async (checked: boolean) => {
		setUseMyLocationCheckbox(checked);

		if (!checked) {
			setUserCoordinates(null);
			return;
		}

		try {
			const pos = await getMyLocation();
			setUserCoordinates({
				lat: pos.coords.latitude,
				lng: pos.coords.longitude,
			});
		} catch (_) {
			setUseMyLocationCheckbox(false);
		}
	};

	const handleGetPlaces = async () => {
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const filteredAndSortedPlaces = mockedPlaces
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

					if (placeDistance > Number.parseFloat(distance))
						return false;
				}

				return true;
			})
			.sort((a, b) => {
				if (sort === "rating-desc") return b.rating - a.rating;
				if (sort === "rating-asc") return a.rating - b.rating;
				if (sort === "name-asc") return a.name.localeCompare(b.name);
				if (sort === "name-desc") return b.name.localeCompare(a.name);
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
		setLoading(false);

		setPlaces(filteredAndSortedPlaces);
	};

	const clearFilters = () => {
		setSearchName("");
		setSearchCity("");
		setSelectedTravelTags([]);
		setSelectedTravelCategories([]);
		setUseProfilePreferences(false);
		setDistance("none");
		setUserCoordinates(null);
		setUseMyLocationCheckbox(false);
		setShowOnlyFavorites(false);
	};

	const toggleFavorite = (placeId: number) => {
		if (favoriteIds.includes(placeId)) {
			setFavoriteIds(favoriteIds.filter((id) => id !== placeId));
		} else {
			setFavoriteIds([...favoriteIds, placeId]);
		}
	};

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
													disabled={Boolean(
														userCoordinates,
													)}
												/>
											</div>
										</TooltipTrigger>
										{userCoordinates && (
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
													checked={
														useMyLocationCheckbox
													}
													onCheckedChange={
														handleToggleLocation
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
										<SelectItem key={option} value={option}>
											{t(
												`recommendationsPage.distanceOption.${option}`,
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
								<SelectItem value="rating-desc">
									{t("recommendationsPage.sort_rating_desc")}
								</SelectItem>
								<SelectItem value="rating-asc">
									{t("recommendationsPage.sort_rating_asc")}
								</SelectItem>
								<SelectItem value="name-asc">
									{t("recommendationsPage.sort_name_asc")}
								</SelectItem>
								<SelectItem value="name-desc">
									{t("recommendationsPage.sort_name_desc")}
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
			{loading ? (
				<div className="container mx-auto px-4 py-8">
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
							<p className="text-muted-foreground">
								{t("placeView.loadingDetails")}
							</p>
						</div>
					</div>
				</div>
			) : (
				<>
					<div className="mb-4">
						<p className="text-muted-foreground">
							{t("recommendationsPage.showingPlaces", {
								filteredCount: places.length,
								totalCount: places.length,
							})}
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{places.map((place) => (
							<Link
								to={`${ROUTES.PLACES}/${place.id}`}
								key={place.id}
							>
								<Card className="hover:shadow-lg transition-shadow">
									<CardHeader className="p-0 relative">
										<img
											src={
												place.image ||
												"/placeholder.svg"
											}
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
													favoriteIds.includes(
														place.id,
													)
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
											<Star className="w-5 h-5 fill-current" />
											<span className="ml-1 font-semibold">
												{place.rating.toFixed(1)}
											</span>
											{distance !== "none" &&
												userCoordinates && (
													<span className="ml-auto text-sm text-muted-foreground">
														{calculateDistance(
															userCoordinates.lat,
															userCoordinates.lng,
															place.coordinates
																.lat,
															place.coordinates
																.lng,
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
															{travelTagsOptions.find(
																(opt) =>
																	opt.value ===
																	tag,
															)?.label || tag}
														</span>
													))}
												{place.travelTags.length >
													3 && (
													<span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
														{t(
															"recommendationsPage.moreTags",
															{
																count:
																	place
																		.travelTags
																		.length -
																	3,
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
														{travelCategoriesOptions.find(
															(opt) =>
																opt.value ===
																category,
														)?.label || category}
													</span>
												))}
											{place.travelCategories.length >
												2 && (
												<span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs">
													{t(
														"recommendationsPage.moreCategories",
														{
															count:
																place
																	.travelCategories
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
					{places.length === 0 && (
						<div className="text-center py-12">
							<div className="text-muted-foreground mb-4">
								<Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
								<h3 className="text-lg font-semibold mb-2">
									{t(
										"recommendationsPage.noPlacesFoundTitle",
									)}
								</h3>
								<p>
									{t(
										"recommendationsPage.noPlacesFoundMessage",
									)}
								</p>
							</div>
							<Button variant="outline" onClick={clearFilters}>
								{t("recommendationsPage.clearAllFiltersButton")}
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

const mockedPlaces = [
	{
		id: "1",
		name: "Pinchuk Art Centre",
		address: "Velyka Vasylkivska St., Baseyna St., 1, 3-2, Kyiv, 01004",
		rating: 4,
		totalReviews: 4,
		travelTags: [
			"relaxation-wellness",
			"family-travel",
			"events-festivals",
		],
		city: "Kyiv",
		travelCategories: ["parks", "tourist_attraction"],
		types: ["park", "tourist_attraction"],
		coordinates: {
			lat: 50.44177930000001,
			lng: 30.5211407,
		},
		image: "https://wiki.kubg.edu.ua/images/c/c3/218-pinchuk-art-centre-75-1448354257.jpg",
	},
	{
		id: "2231",
		name: "VDNH (Exhibition Center of Ukraine)",
		city: "Kyiv",
		image: "https://upload.wikimedia.org/wikipedia/commons/0/07/%D0%9A%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%D0%95%D0%BA%D1%81%D0%BF%D0%BE%D1%86%D0%B5%D0%BD%D1%82%D1%80_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B8.jpg",
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
		image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npCBjllcM0LKQtHuCNKm_sMgoj5mjqktWV_mhIExEDDJhCSmxOf_CxyyzhHLWRwAv-kLJkwgeLyqOftkGqva27MdDwfAG4EsHYUGD88Hf5WhURjr1tHxOH5HUwj5DFojvp4EiFx=s1360-w1360-h1020-rw",
		travelTags: ["historical-sites", "photography", "nature-wildlife"],
		travelCategories: ["open-air-museums", "parks"],
		rating: 4.7,
		coordinates: { lat: 50.3599, lng: 30.5152 },
	},
	{
		id: 4,
		name: "Natalka Park",
		city: "Kyiv",
		image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/f8/e0/46/caption.jpg?w=900&h=500&s=1",
		travelTags: ["nature-wildlife", "relaxation-wellness", "family-travel"],
		travelCategories: ["parks"],
		rating: 4.9,
		coordinates: { lat: 50.4907, lng: 30.5401 },
	},
	{
		id: 5,
		name: "Lviv Old Town",
		city: "Lviv",
		image: "https://whc.unesco.org/uploads/thumbs/site_0865_0002-750-750-20151104125432.jpg",
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
		image: "https://lp-cms-production.imgix.net/2023-10/iStock-1657465139-RFC.jpg",
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
		image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npqBXvoPIb4BMqyXt56LOZiEL1XGqHC6bJr_ySHXMNgdDgB81EdEfO253D2kGwyQzMR4smmZewf6W9g5JaL9ccnCfJuYaJjmy8fDZZ7hM-i3KP0Go0lszeabhstG1xWSFyi3uRIMw=s1360-w1360-h1020-rw",
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
		image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npwahLQkdaWj4XrQ3PFKIVyGGJXnp0jOr3YFKH_KWKA5TKbXB4CMWHkX-dd9sK7HbqjPR-myFK_L2L1DHx6iVFPPy00dbPyEjit2ez8yOTLVE1mpp8o9s3IwhzMqq_zsZBoduW2=s1360-w1360-h1020-rw",
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
		image: "https://lh3.googleusercontent.com/p/AF1QipM8yOcHZNk2eVBMe3lqMmv3mvImoowiTyFNvb-K=s1360-w1360-h1020-rw",
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
		image: "https://cdn.tsunamipanel.com/100594/media/galleries/1920/sofievka-park-01.jpg",
		travelTags: ["nature-wildlife", "relaxation-wellness", "photography"],
		travelCategories: ["parks", "botanical-gardens"],
		rating: 4.8,
		coordinates: { lat: 48.7844, lng: 30.2227 },
	},
	{
		id: "110",
		name: "Truskavets Wellness Center",
		city: "Truskavets",
		image: "https://truskavets.ua/wp-content/uploads/2019/12/spa_tsentr_svytyaz-1.jpg",
		travelTags: ["relaxation-wellness"],
		travelCategories: ["spa"],
		rating: 4.8,
		coordinates: { lat: 49.278, lng: 23.51 },
	},
	{
		id: "111",
		name: "Bukovel Ski Resort",
		city: "Bukovel",
		image: "data:image/jpeg;base64,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",
		travelTags: ["adventure-sports"],
		travelCategories: ["resorts"],
		rating: 4.9,
		coordinates: { lat: 48.348, lng: 24.406 },
	},
	{
		id: "112",
		name: "Khortytsia Island",
		city: "Zaporizhzhia",
		image: "https://f.zaporizhzhia.city/location/1952/4Adqe.jpg",
		travelTags: ["nature-wildlife", "historical-sites"],
		travelCategories: ["islands"],
		rating: 4.7,
		coordinates: { lat: 47.867, lng: 35.086 },
	},
	{
		id: "113",
		name: "Apollo Shopping Mall",
		address: "36 Nezalezhnosti (Titova) St, Dnipro, 49055",
		city: "Dnipro",
		image: "https://gorod.dp.ua/pic/news/newsimages/0220/169937_b.jpg",
		travelTags: ["shopping", "entertainment", "family-travel"],
		travelCategories: ["shopping-malls", "entertainment-centers"],
		rating: 4.2,
		coordinates: { lat: 48.4357, lng: 34.9754 },
	},
	{
		id: "114",
		name: "Zelenyi Hai Park",
		address: "31 Nezalezhnosti (Titova) St, Dnipro, 49055",
		city: "Dnipro",
		image: "https://tickikids.ams3.cdn.digitaloceanspaces.com/z1.cache/gallery/organizations/8891/image_611f85e6d20a03.99512423.jpg",
		travelTags: ["relaxation-wellness", "family-travel", "nature-wildlife"],
		travelCategories: ["parks"],
		rating: 4.6,
		coordinates: { lat: 48.4363, lng: 34.9782 },
	},
	{
		id: "101",
		name: "Taras Shevchenko Park",
		city: "Dnipro",
		image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExMVFhUVFRcXGBgYGBgYFxcVFxUXFxYYGBgYHSggGBolGxcXITEhJSkrLi4uHR8zODMtNygtLisBCgoKDg0OGxAQGy0lICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAJYBUQMBIgACEQEDEQH/xAAcAAAABwEBAAAAAAAAAAAAAAAAAgMEBQYHAQj/xABPEAABAgQEAgYGBgUJBQkBAAABAhEAAyExBAUSQVFhBhMicYGRFDKhscHRBxUjQlLwYnKS4fEWJDNTY4KistJUdLO0wiY0NUNkc5OjpCX/xAAaAQADAQEBAQAAAAAAAAAAAAAAAQIDBAUG/8QAJhEAAgICAQUAAgIDAAAAAAAAAAECEQMSIQQTMUFRIvAFFHGxwf/aAAwDAQACEQMRAD8AsiERyfiEoDqIF2cgOwcs8Jr1MbNtXwufOM+zzPVEpF1IJ0qSrZRJHIjv4bR25MmpyxjZaekPSYSk6ZSgVs55BttjtEDiOkhVI1qUStLLdmCVNpYcQWfvc12rGKxBV3moFLkB7d0Iy55KSxoaEAgP38qCON5nJ2bKKRcMmzZR7KRrbSpaizVa5JqQBTm5jQBNTLSHU36zud9y7xlHQ5BQtZKbIKiXolB9VqesTbfakL5rnH2k4B1glOhyolPZFuTP5xpHJqrYnG2avLxEKdfGX9GekCwo61q0AsGC1dos2/h5xeUYvshRNC3K9o6ISU1ZnJUTKZgjqQIiBPjvpB4xepNkupcEE0jeIv0kx0YgwahZLGed4LriNE4wYTDBQWOp6nhj1BreFAuDmdFK0J0IJw73jisKBaFjiBBFThDtipDScjlEXiUbgGJtUwQyxS2BpTlG2OTRnNIiADB0A84MtY2gS1Ex0nOOE1hLESWBUYcSUwpipThoi6ZdcFbmGsEiWXlajaB9TKjfeP0x0kRTQYCJhGTteHKstlgWhPLEaxsr8HSl4d4ySkWhmC0WnZL4DCW1YcpxAFAIaqmE0goMJqwuh71kITFwEqDQVxCSG2KBIAcw2mlzHVKgIQTasOqFYlojvV8YVLi8KS5vGE2xpIbKl8LQXTEjLmE2Agq5RNwISm/Y3FehkhAgxkw6EsCEVqeKuyaE+qHGBBtECACczTPZKQtClEEbMoatwxAsbPaKNmZCgFJKQ9wxSEm16ja71aG8+fdKbMaGrA2KSaivCEcPikootBU4DB2Bv6wq9zHzMsu75PYUaGgwy3cVYljS4sA5Afh3Qz0EqUHCg7OHDh6UNREhhcxJ+zVUMWFN7fl4SxGJGo0S7/dZvAjau0RwWWPBT0y5ICwCD2SLFJsCCC7O1CBZ61iCTPYhSal9ISXZuZPODYrMVTQxGkXcPSg8nIEN8LIWWCQwWoJBsCS7drmW84pu3wJcD2Tm4TMJCWBOqn4nJCu+rePjE9M6QlEpAQS9+0RVJJAtvvt7IqOJwSkK0TAAWoUnUGL15n5codJlladQB7FLahpAs1C9q+cNSlyhUmaF0czkzk6VAOmjjlyib0hyOEY5l+KXJq5HWBQDXKHDkEeIi/dG8XOWnXqSU/eST2nNNXwrwjpw5W6izKcK5LLogCAJqTvAJEddGNhguOFZhJZHGEps1u6GoWJyHImc46JjwyTiQeQgq1DcxfbJ3JQIhOYoCGsieTxbnAmOYnSnyVtwKrxKRvDadiwRaCIwyTc1jipLWjaMIoycpDUsC7fKAuYBCkwk0SPGElYNR2HnG6r2ZO/QpLxQhzKxqReI5eEWNoKMMWeBwi/YbSRN/WksQjMzdO0RJkGEyiEsMQeWRLKzR4bzceTvDHTA0xaxxRPcZ2bMeEimFCmOpEX4JCJknhBhI5Q5RPYRwTohykUkhr1Rdmji5REOlT4KFkmgeEpSG1Ea6IMgEVEPVSVAFShpAuTDHNMXLlUE1Klv6orTve8Zz6iEF+TKjik/AFB4NLTW0NMDjBMULhFypW9mAZ2Hu4xZcu9HVpAI1KD1qHYuB3N7ozXWY34L/rzG2HltB1ySTWkSM/C6e6IfOswmSUhSAgh2JVYe2IlmpWUsfoU9CHMwPQuIDRXf5UzASClIdQN7JNGFeTxPZVjlzCXIZCahqn9Inaxp3xnHqtnSLeGuWOfR0fgECFPSUcU+cCNNn9JoyXFjQtSSC4oW2PmaQ0Ews93PjS3tiwZ7gUJUFSldlZtvcgsCKCK5NUymPD8vyjxpwcXR3xlsrO1B1C5cU7o5LmaSFEPt+ecckImEqFRpALGhDPZ68acoNITMtoUSogaWJejhmqaP7YnUofYYlirSWFjZOrhpYv3Q6w+arQyXGkEEAgEGj1oahktwaE5MuaEtYqIbU4YXBB2YV/iISwc6upWogEk0ewar7ceVIpXEnhlgxWJTOKEhCjMIqOP4y5oEitSeFeCUlMtC5stadKSlILkApGpRc6SSokC4PhDfKsXqmBSkqCWYEULUSEOCB4G5J8GEyaNZUlx2nrxenJ4uc0lf0SXoWxmDWnX6joQVFyX0hQYJq6jtWt35K5FmmkgChLPxpR62pU89oQm4xRCkkJZRvUq/ad24j5CGivs5j7A0Ip3BxyjPZr8kW1fDNMy/O0qT6yQpwGo9T2e+jPSHk6eTFBwUpQPWKKWSgKuCQw0oSRs6m8Wi6YMHQHLkOCa3BL35x6vR5Xk4kuTz+ojr4OGO6jZ4U0xzTHocHIJpJEHE0wGjhTBSYW0OU4mjFoN6UmGemAExPbRXcY89NEJrng7e0whpgaYpQQt2HWRtBOtMDTHerh0hWw3X98JlR2JgwREVmOcCWWCQS7VseLe6M8mSGJbSKjGU3SJNSyYQnLCQ6iB+XitnOphU4O/gOVoRxGNMwpClWJPjHDL+Tgk1FcnTHo5N/ky0pUCWBrB1hrxWsFjzLUABS4rSsSeMzwKBHAXL+sz0azcYvH/IwlFuXDJn0kk+OR0nEA2hcJe1YgsFj0l/uuwLPVRJ8W9buoYsGHnlASBpIJd7DTSzXo/C4h4+ttW+Ql01BBL5GAZB4HyiRQNwG8fc+0HVNKm90dSy3yjLt15GWFwJUa0HP4RJycCEq1JLDm3feFJUxqEN5NFS6Z5vMExMlHJmIA7QIrYg8iS9Y5c+eUVZtixRfBJdKMUhSUpC0PU3LtUMG5xR1CWAxS/a3OosNgQzd7bwhmmOPZS/ZCa0F6liQ78eFYbTEjQku9LOXckV4M1fGPKyzcnZ2RVIe4PGaH7QDl7U4NTv2iQw2LTXkKOSaAWc3PnFXlTTZVh7nicy1SQgpNdQqzEuDsbCnH+GUZO+WU0TmMzVBCU1KhZ9QTqKnqnegiOmlK06TMUQkuUpr4Bxb5xFYqaU8hs9S3hCUrElnNreJuaHleKeV3yidQ2Jno7A0ml7eOwpD2RmqpekoLMwDDx4VrxiNmF2UKpFan4Q3nKdWz8vfGSk2/JVFk/lJiPxHyT8oEQPox4H/F/qgRrWX6xVEcBVD2tNGs9TRiDcHxhDEZeosvsl6sDwLWpCc8knSDWghSalVEhVQWU4oAAS4N6sNoSTaooNgkdWGo59rVaH2HnGWsLSWUAagA0I2fxER+H0hj334EGvnBlqLuPOM+VzfJVWOpmYrdwXLFwwHAhqXcQxWsqV2gL1FWd3I83pBQ55/m8KJZVxvxZ4e7a5DVEj9bS9IdIYUTpGnSf+rx/jGTVA1DhzT3x2VKQT9opgSAd2chzB8blzq0yZnWanIdkgB6VLAkl4uTc1YklERTKBDn1q2pSF5R0p7RJLtVjT+DwzwkpTFR2bcbn5wtMXQOAFAU4Hx43jN2WSGFxCGYgMS6bAktQavMxfsjSgSUhJJFam5Ny/nGcZUQVdoChYg2vWx8KRaMNPWgyUIupOsA0BUqYvQK7MAH3jq6TN25Wznz491SLiJcGXIesCRgwiWlLhwKlya7mvOFEpSN1eEewp2rOHUZrkkQnoPCJZWin8YTmLTsDFLK/hLxr6RvVnhA6o8DEnLW9hHU0N2h91/A7aI1Eoks0K+ikEP7DD1ct94SThYXdDthRh0C5g6MOnaDpQLbw0zHMEYdOpZJewDOTGcslK2y1C34CZthymWtSCNQD7U43pGbY2YZjhRcua295taLpiukEiZKWCFVBBHHgxDxQ8ZP8AtAaAMzC1PdHndXl3S1lZ1YIa3wBZ086+r/GFETzvwPOEtQURzZ94TxckgpIqNIqO7b3RwJJ+TpHGHetPlyhQrNvz4QjiFaU0DFnrvd2EJelDi9O478/yYWoDiSS/N783/j5xNSMcoMyqm71Z2Zn7vGK9JWkWIq/ft8xElgpm7VFqxcG0/InFMtEvFzF6UpNwxJd3dqHwMS2Hwq2Yu/OGGTLVpfUlRowIqCpz5sd4m5AUpw7NzB90ez0+S+bODLjr0EOHSkdouWtGYZ/1iZyjMHaLKNrGgAPDbwjXpOWpNyX8IybpTglDFLSTMUkKLbrYAEk30gAuKe6mPWtSii+ni02RM1INyBwFX8o5iFFnqyaWpQUp3H2xOpyCT1RxDTglSFFCS/Z0kJBmEX1ElQqze2Ik4kI2cMxexSaKcDlvHnLG4v8AJnVfwb4aakJBVvXm0OpOKBoyaniafAXvyhpJl6yopBADs3B3ap57l47hpKtQ1JalifZGbaTGyYnYCZMTpJSyXUFanGgXIH3i7i+1oh8QFJKCxazkNXfeoh/InELAPZSKBzR9RIetBUAwyx0ztMoq9btudLvcpTcJpR3joqMo2SuGFUovpe4FLO/AwqjBskEO4sSxvxq17GI5CCVJSlQ7RDOTuKP40h5iEqTQkFmbYvvQPGTVcooe+kL4+z98CGnWHiYET3JCpC82QEqCiXb5wSdNSQ7V4/CrtCXpJI8fG8FMnUBZhez13NvyIPPBpQdBvv39x3hCRLKu1qsOdnbwvDuVOSEgFjseJYP384aCcKNRxWHSGCaWoCXOwD/GHeGSWdnJoBts5+EMJMjUoLvV/DhEoMRU0DFmBLXEYzfwQSVhwCwBJsS9CQHtweH86aAhQZhoSzUFCQQw4s/dCcpYuAkJfmCdjeIvHTFJIDlndjWofz3hwk2NocEMCEhhQlw3MD2iDYLLFThMIIAloK+5rANz+MNsPOUXclRbvYXJ7gHiaybGply5iCkFSkkh2LK08WcMx4esY1jrfJMr9EflyZZ1OtKWGpyscAQBXctz8otKczQcTLW4SmXLSGB4psDwBVXuPGO9HcJOxGIXJlS5atIUsEgtpCgNJIUO12h5GLeeimM/qJN3YLWKfh/pL84uM1H9+A4bB8BiUqUCFJIIJdwaBJPwjomFgDsIayujWLICk4eUoEvSYuqeFZtFCtfZDbGdHcVKSZkzCStKApSzrWXS1G+0NvHwjs/ura6Of+q6qyQJF4Bbn5xVMnzFCJ2pWmVLWNKr6EqFUklRLB9Qcn70XFBDOGINiC4847cWdZI2cuXE4OhETTtCgmE7Dxjqu6ONGvBnyHRMI2EDq1qKdKkISSylKL6Q2yRVR8hz2gmnnHNMZzi2vxdP7V/7LjKvKF10pqC2pqZn5ttFG6bS0hzrOpSkhu8G21n/ACYtsycEBZUCwSFBT27SnDMdVG3Dc4zrP8eZ00OQBpdqgMHIvcsfdHJ1Eo9tL2dGJPeyN69mDO+/hCGNdqilTTw2g65jPp9V/H3wgMU4qH58uB5R5uvJ1iGFxLWJf4Q9UkKAqxfj4v8AwhlLk1BYgGhbhvDqchVxQC1OHEkO/OAYlOmVYuavWlGG0cnorqFiP3/GEMQ47Zdtu40Z/PyhSW5CWBOp233Iq0MCVyvLVzZE2eCPslISpJor7QzGIo33D7I5Knpqe0XbcseLA7N8YlOj+FUZM3DzFy5SJ/VEqUFKUFSlKUlgnjrILw/l9E5ZLDHyjUpqiYKtuWoK3sdoGFMY4bM1oOoFjx3FCGHJol5nTMIZgnUeNn2PGGp6KIIH87k+qT/5gty6u/K8NFdEUpAfFSVMx++bilerpSKhkyQ8MiWNS8lixXTbSwQjtbguGDsk23itZtnZWrUyQVEalADUohmBNwAwpyiIzKTLkKKUzkrVX1WIHiD8OMNUrDBzQ0/faDL1OSRCxKLJTH4+bNQmWsuEhhwHgL2Hc0QU6SpKHYlL1dh5jyh8J6QkAqO7Gw9sJEksUmjVfc7Rh3JN22UlXgTROCXGolxXj58ocYbEKLBVq1JF/wA+6IgzmtfjCyMYSQzU5QnEqh6oLQSSQU869xbiISxcoKOrWFEq7TuSEgAaifhzhbD279oSnYbtaiXD1BoAKRUciVpioAw4Z3Li3ZNvG8NZiwFnU5Z3Zh3EXEPdei9h8b0u3ODTcGlR1M78CQG47xMZtPkZG9ePxHzgRK/VaOKvIfKORXdj8KoSnqOzEO5DNTiVHuhLDEkulxSp4eHGF5mKAoWalKVHjDro/gxiJ6JOrQmbMCSoN2Ruz7wQ54LkK5Rki8XPEmQkazUkkhKACHUWskch4Vhji8IZZWhXrIUpKhwUCQWPCl41PKOi6MPilTcPiQhKpvUISoayEaNU4FRIKluh07CrvFT6bdEfRpc3FidrQrElIBqrQX7SiGdQW4alK8ouUHRnZVpcksKCgqO7j+d4L1SuDAXfYePdBMNOWAxZu6/Cu0KKL1q+wNvJ4xd2NDlGJZIHm5JFtvDaEZ/aNAGAs1H7oRM0cGHn+axxJfUdmG2zw0qLrgUwKtBVxMtY7nDP31Ijsl/f7BbxEJSfWUprIULbsT84Nq06mf1SW8vZXutDfJLNQ+hoBc/FTjp7ISlL3dalKUQLEUA8BGlTs4UCQJU5YH3kSwpNQ9wq9ozD6AZRK8UqxSiUHv66phIr+qI2WRL0hg1yaBrkm0W/A4kLLz3SG6nE044eYo+JCqwrnk1UzCTgnSrVKLABiQR+tQxMgxW+lWXhODX1ae2ye0CymSQpRe/qpMEV9G38MmGBYFaavUi4O0dl4fTVHYJq8tapb94+94xKZFMmnEolJlypiVDt1JUG7SiEhQIowAIv3xNYrpFh5c2ZIRh580SykTCgAgLSaoKVEGhS1+MU90/xD8WuSuy8ViU2mrP68tKh5oYwvLzeePW6onumI2fiqLji8VhJGHlz5i1S0qoAUBSxqCiQoI1WLg3D04QMhzTA4ialEmclaqK0GVMS4Tf1kNWKXU5o8f8ASXgxv0ViXmc1nMuTvbEB6AGykDjCwzBdXlJo9p0o2v8AeFnEW7GYnAyphlTZuEQtLEpWUgjUAU+ty98PcBhsHOSVyk4aakKbUjqlJAAqCQ4Cqg+Xja63L+0Q+lx/tmeY7F4ibLWhSQ6tTEGWGLlS37dQAU0o1a1inTui+MIYoBIdu0mzPx4VjbeqwBauDP8Afk7Wsa0+MGn9HsIUdYJcrSxOrWkI209p2Z3rGTzOS5RaxRTMKHRHFmhEoWutIqQ424Vh1h+iawjtTJQXympY0ceyNamZZgU6u3httJM2Xdi79o7tTlC+PyvByAF4gSZbsO0tKUkheogOfwgiI7j+F6IxxeQrDtNljmHU1Nm3b8vBJfRsByqcSeSC3O8atIwmBnzCjDzMOVEOAlRKglJDns8qX3iIzxeXyVKlTJxTMSSSEomqZKkuEjskFnBd4Wz+D0RRVZJLZlGYpNyFMkP4Q6w2UiWGQgJ51J8zEjOmYcyjNQorS5oAAq42NrPDSTnImhWhKnCXSCR2mv6rWp5xabfkOEdw+DAPaL14Ggfdo3H6rwv+zou/9Gn4CMNyzFKmALFCnUCNioUdo2+RgusSOtGtCkg6VJQ1WIdiXhtcE3yJ4jKcOWAkJFakSkvx+8kgg241o0JZlkuFVKmJEhAJQoA9WzEpLF2fm8OjkGF/2eV+wIjp2HVhhNMoJCNRWE6QwBQlg5UABqCtjcc4hcjZ5ikpCqv4Vqb0McTjaUSx8xU8LwmrMFLUpX35ilKUWdyouaQphjyS5NQKF3cN8nhNUZHVTnFRc91eTw5TikesSRt3jnSGs6VqVcA8Hoe4wmJoBY1Bs/zhaphQhiFJKjptC+CZVCWPewMMFrc0pWw2hXDqr+bxq1wOiZUQkAVY0FTQ+3hCEyeQoMTSjE8LQlMxK9NTvXjDE9tbUDxnGH0VEkpSlkLQ9tLee3C0OsJOJcLceO/APE9j8tkJwGGnylEzzMKJoJooMpTgG2kgJpxrWK7PUUkuD3HZ6imwq8KmCHf973fOOxHaz+A+QgQ6RViM9ZWQRatHSD+8Q6wwOp06kkWZwxoeyoGjQsrBITMKASoJLBTAOQLt+bQ80ClTTfmOMNceBt2NvrCYClKZsyi9QYmiyCCt7uQePGE8XjZsxHUzJi+qSpS0g/dUpyS91b8bnjBsRLrs+zWHCGqpb0dr/lopy4okJOWAAkWYMXuePtrAQss12gno7FiX33pyhzLkkF2f8tENpAKIli5FbgcObQishlM/73g63INPJ7eUMlEtWJSstC8iZQ338mIh9gm6uaD94JSz1d9VGv6nuiMlFwQN/nD/AA0zsrU5GhNGoSpR0geWo/3aRaRL8msfQLIAl4tYNFLkgV/ClavPth41aM2+gv8A7nOLAfzjTvtKlmr/AK0aPDGHBiK6T/8Ad1fqr9kmYYlBDDOpOtAlu2rUPNJH/VAMyz6PUa80m6kuEJm3Y1C0JttQnziExWYqkY2cE+qqfMJTsQuYr3MIsP0ZHVmuYLZkhUwADh6QsfCKp0xwvV5qZWsl1yjSlZjKNK/iaM1tFXF07KdPyad9IWHBk6C5HUKuSagODXcEAxD/AEX5alJS4GolaiSASWGkXfifOJDp/PUcXhJAPZmp0r4spZTTz9kTOQ4KXKxapUugRLdncjVprXxjqjkTVfEzFxaf+Wiv4uSkrU6UntG4HGCdCZIk4XMKtLlzFEXokJBNi3shfFUWt/xK95g+VywctzFQNFCaXdnGi77UjfqHSjRlh5bM1z1agVjShjqA0pCSGUainAbW9kWVGIV/JoqKyQmboBq+nr2ZyWKeTc71iiT567FWpizmvPce6L5iTq6LLJDfbJ5WxaRtaOK+TZGVqnqqAov7G+bxrPSxUyblGXzFK1LWhBWqpKvsie05qXJJMYypXCPQYypU/KMvCWdOHQuvASBal4b4RUfJjXQ+f/8A0cKAp3xEoXLMpTGncpm74t/0oyT9arQPVMmWQ1AOzt4v5xTuiWHAzDCEEFsVJdnf+lEaD9JMl86Fb4VNP2w7eEDYRKx0RWTIxqbaQnx/peXKG/Rc6jKdvVne1KT8LRIdDySMek7FAHd9rEX0JWCtuAJT+yQQ3j7oAJ7o6lpc0cJy/Jkn4xvmVqeRKPGUj/IIwbIQwnj+3PtlojdMjU+GkH+xl/5BA/BSHjxG5zKWtC0oAJUkAg8DqFOdokSYKn1vAe9UQM8Zrk6SxNiX8C0HlzNOw8yPcYc5xL04ickfdmzB5TFCGmqnt7o0MxUTiq/Gh3HED98HxIZII2s4u48nhPDzbOCWOze3lC+LDjTS7gO0T4YiPPBrR1KqxwGhh7lWUT8QVCRLKyhOpTEBkiuqpFA0aDEjqJSCSxVvFk6DZxIwuKM2agKQEKDFLsSnSaNuNQ8TFTCjx/JvC2oCg8X4xNCZoX8p8L6AvCGQH1rVKGlwhySkhWxsDWocQ06ZdIpeMVh5iEaFJldXMJDFRB7PeEgX58op0perVwSl27t4AmvR2PsaB+BUSbq4D9mBEc/6cCFx8Ksl0zACdu/82jpxCgWdh7zEezbk/mlBeDdqxDN38vC8QSGxs0k98N+uPwjuJSQz2A3+EGkhx4bRpLyMkMPL1ICgnkSK1qaj4QeXLua0pv8AkQXAAS+0KtcEUbY8L+MWHI0JVMVqBSVMoAhhpdie6/fGbQ6K8uWSdIQongAS9huOY84LiMpxBTTCz23+xmMa7HTGs4Do0Zi+vDUc6RZQse0fVoOF+Ii7YGWrUCFK0EMUkuzUDEG9z+XgSRVHmuVkuICX6mcklaUsZaxQv2qptDnMMPMYSkylMlWonQpiW0pAp6qU+1So9QhP63mfnHFDmvzhtgkUX6FpBRlxKgQVYiYagiwQmx/Vi/mEpYpv4w2zrKk4lHVqXMQAoKeWrQpwCLjasCHQ+htjfXQOSj/iQPjCmGkBCEoBJCEhIJLkhIABJ3NISxX9IjklX+eX8oYjM/opna8bjzSixb9KZNNf2RFU6ZjVnzEBjPwiQS+4k2PjFg+gmd1kzGzGbUZO2/2xP+aIDpJPJ6QpS4IOLwoZrMJI4fmkSlXCG2Xbpup85wCf0UH/AO2YfcIm8mUTnOKD0GHlU7wiK30uX/2hwI/sZf8AmxH74nujpfPMfykYYeaRbyiUuRmX5jm0wrnSio6RNmUu3bU/rUPcY0PKFNkuMN/sJh5/0AMZLmmIImzi95izT9dVLxrOWlsjxh/9NN9mHBhQcndk0jEcZidNDRRpbuty+UaWivRFZ/tH/wD3CMcnTCouS/B6xsmBr0Rm96v+cBjaqJSMe1iPUfQ4Pl+X/wC7Sv8AgpjywCP4x6n6Gf8Ah2A/3eT/AMEQpeBx8mB5bhwnNJJSzDHIDcGxIFBF8+kZJ+vJRahwQr/fnRQsGojNk7D6wT/zQi/fSRMbO8OOODH+bEbwwRA9EU/aY8NvLN71mtFZ6IT/AOdyxZ0rH+Aq8PVi1dElPPxw4dX5dr5xU+iigcckMOyZlW/RUB74Blzyq84cJg9qExtXRw/zSR/7SB5JaMVysdvED9NJ/wAA+UbP0VL4SR+o3kSPhA/AySgj9ofq+4j5wp1ZhNaWUP1Ve9MQM8kdLE6cdixwxM8eU1QiLEeo8T9HGWzJi5szCJUuYtS1KMybVSyVKLa2Dkmggqvo1ytm9CljnqW/tUYvYijy5qOxPhwiT6NoV16FadSQWLhwxDP7QY9Jy/o6ywBvQ5Pi5PmTDOV0PwaMUqUiUmWiZIKextqC0kpd2LCE8lD1s86ZzgOqWACdKkhTni5BFOYi9fRJ0bnKnTFqUqVLXhpiNSVS3aYlgSFHYsWbhs8WXE5PJl9kMvQSHWElQLuQCAKO8WboRikomrCi2pAAPPUG98Hctug1pcmF9J+iOIwS3mgGWVKCJiVJUCEkMVaSdBIIoed2iHUgkO7d9o3r6aZxGCUkgsZks8qKB2jCnLNt5+MFkMNh5d3+8lSfZBMBhVTKCr+bQtKppu0SfQmRqxOgh+wthZylztxAIi1yhIJ/JhXL2wI1P0OV+Ee3/RHIdDKVkn0d4nEAmRPw80ouBMmoNbdlcgKiBy/J5pnKS4JlvrD6Skg6SCmZpNDekegcmlYLBzygTpaZygUpQuegrUkkEdjSkvTnFZ6U4KVNx09foTqCJbTftka1N2jqSQhTAgUD0YvYXqvKJTfsy7McmWpIYkr1NopUNRQU7CtGPKEujeW9a9PvMA+4AiazzUFpTLBJCjRLkhqVAHPhFukTpAxUvqsOiVKBSkXF2BUQUvSps8ZSds0Ufg1xPRpCJUuZpUD6pBHZIYkHxu3GE0yUMkObix7TAM2q5TenfF96USJPo51TdOhmJlLqahn4El/CMvRhptftb/oiJopKzQ8LmikaUtdi3FNW9pMW7BIo7Xr5xj/Rzo0qesg4yZLMtOoF1E3sAFBhz7uMS+dYabhtAGYTpqzVgVJZNnqo7wtR0asBBVGMa+s8T/tM/wD+RUP8lw03ELWFYyYgpS4KlkuSWYBxTn3cYGmPWjVkW/PGDvFEzHPJ+ETLlidJm0+6hTpSGAcqUSSa1PCGf8ucR+GX+yr/AFQUwUbNIeGOZKYlXBB+PyiFw+ZYhaETEz8GApIUUqStw+2oL27rxV806VT5w0nSnYmW4djxeog5BKxh9Akkol4lwQdaNmshz74rOYy1K6RJXpOn0uUrUxYhKUV1WakTMpZT6pKe4ke6JbKOjxno6wTpKO0Qy1MqjF6d/sivdg40jvSkNn+DmF9IkpClfdAAnmpsKkbxM9GcSPrfMF3R1eGCVfdPYrpLVbvMVrNMH1c1UvWJmlu0moLpBp3O3hCOHklSkoBAKiEgqLJBJZydhE6j1M/xstfWTCJcx9Sz6q/xGlr70jX8vL5NjEC5kTEsLk9QAwAuYb5l0aXJl9YZ8hbM4QovUgDS4reIVoFFehKPxmXYqQNASiX20qU9DrIIDAp5MTGrZVLUei02XpVrZZ0sdRbEhVu4GIfL8vScWpdAVMNR21EAk14ARccb0XXKlLmKnyFaa6UKJJDtu1Y1mqpExSfkwQ4OYLy1jvSflHpzoXPbLsCFUIkygXozSmrwtGfERK5PkpxKF6Z0tBQQAmYSAXetNqcIiXKL1S5M10q+tdVWGPfw9JfyaLv9JSwc4wq9vRGfh2sQa+Y84cZnlysPN0FaFqAB1Sy4qNjtDSaSr1nV3198AlAiOiax6Vja3SiK50aKUYwqV95S0p37RVTuoFRfcBg0qWEOmXrLajQPVntv74Ux3ROXKl+kPJLLCeySFuQ5UOI284YOJVcVnQw81bgkLmIcgkABILuR4U7437oar+ZyTyWPKYsRgGb5aiZpRLUynWu+qqUslwX3UPB40HJOm82Xh5SEIl6dIIJBL6u09CNzA1wKn4NXM0QwzXMUSU9YuyQeDkkpYB94rP19iz20ehGWUhQUZhCi7ltL0I5nxim9Mc8m43DFKihCUKT6gVqBW6EqIckpBLFvxDwhJvgKS5NGzPpPJk4jDSVBxiEqVrFkDs9WVBvVUSQ+zRYNMeb80zien0AoUFBMpMrWpLjQVIqQt2cr8HozRqOCn42cgTE5kgIU90ywoM/rMhhUe2KaoHVIvzRBZvO0YqUq5KQlnY1UU/8AXGdTOkmMLvipvgU+xhCeBVOxOIGrGrlzWOkqYgsCagMdqRDVj1od4ifqVMPGYs+BUWhXKFfaCm3xB+ERmc5TNkaSnFCZremliCAkuz2OqDZTmplLSpadYAILHTsQ4cEXYwJUwptFm+meTqy9XFKkr8EkEx54OKq1wxB4Dm4vHpaTmvp6FtMQmWRoKTKVMUCQHIWFAWozRWMoxGGw2JWmZLdKApKZiTMZRChdCEnZ9opV7IpsxrC6ytB00JFww/eItXRaSU5jhypKWUopLVDqSU18TETnaz6ZNWErShc9ak6gR2VLJF+RiQkTikpWLpUk+III90XsqDtmufyc5p/YECKz/LSf+BP7Z/0wINidWUifh0HBKxU4Bc2f1yyopdWvrCh9WoaWKaXYE90N53TafiNCFsGQkKUCdSilIGovuWeBAjQVDqRmsxqLU0LJzOb+L2CBAg1XwezFDm85m1uO4QUZpN4j9kfKOwIWkfg7YpKzqcmqVMeQAMCbnU5RdStRs5ANOFYECDSPwLYU5nM4p/ZT8oUlZvOSXSpjxAAp4QIELVBszszN5yi6lajzAPvgJzJf6P7I+UCBC1QbMWTnuIA0iYoJswoG7oTRmix+E/3RAgRSigthvrZfBPlCsrP5yfVIS9S1H2q0CBBqg2YkrN5hL9lzU0ueJgwzhf4Ucbbi28CBBqg2l9HM/pPiFjStRUHdlFRDjkTDZWbKIYoQfA/OBAg0iLd/RrKxQSoqCBVwRUpY/omkSc3pRPUnSpRUOCiojyJjsCBxT8hs0NTnKvwo8j84Uw3SCbLJKOwSwJSVJJAdnY1ufbHIEGiDeX05Oz6YolSgFE3J1EmjXJhP63V+BP8Ai+cCBBoit5HBm6nB0poxF6EWIreFpvSGapOlRcCoBJIB7ie+BAg0QlOQ0VmDlzLlkixILjurHJeNYaQhATwAp5QIEGqHsx2jPp6U6AshDNpc6WNxpdmiLxE9JuncGhIYgghhYVECBCUUK2KyMwlIKSZauyGSHBCbWBA4WJMTuWZ4lQ0y+sArQnSOJoFGBAhuKFbHqdJtLT7YSXM0miQkjcGvtECBC1XwNmNcVj1brXS1EH3iI6Zjl7TD4oT8IECHqhWwicdP+7M9gHuEITsyngsZnu+UCBBrH4CkxJWczv6w+yOfW87+sV7I5Ag1Xwds79cTv6xXsgQIEPVfB2f/2Q==",
		travelTags: ["relaxation-wellness", "family-travel"],
		travelCategories: ["parks"],
		rating: 4.5,
		coordinates: { lat: 48.4705, lng: 35.0502 },
	},
];
