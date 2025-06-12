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
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/ui/multi-select";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import {
	Trash2,
	Plus,
	Loader2,
	Search,
	MapPin,
	Edit,
	Save,
	X,
	Upload,
	Star,
	ImageIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import useDebounce from "@/shared/utils/hooks/useDebounce";
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from "react-places-autocomplete";
import {
	showErrorToast,
	showSuccessToast,
} from "@/shared/utils/helpers/showToast";

interface Place {
	id: string;
	name: string;
	address: string;
	image: string;
	travelCategories: string[];
	travelTags: string[];
	rating: number;
	coordinates: {
		lat: number;
		lng: number;
	};
}

const travelCategoriesOptions = [
	{ label: "Tropical Beaches", value: "tropical-beaches" },
	{ label: "Mountain Ranges", value: "mountain-ranges" },
	{ label: "Metropolitan Cities", value: "metropolitan-cities" },
	{ label: "Rural Countryside", value: "rural-countryside" },
	{ label: "Ancient Ruins", value: "ancient-ruins" },
	{ label: "National Parks", value: "national-parks" },
	{ label: "Private Islands", value: "private-islands" },
	{ label: "Desert Landscapes", value: "desert-landscapes" },
];

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
];

const mockPlaces: Place[] = [
	{
		id: "1",
		name: "VDNH (Exhibition Center of Ukraine)",
		address: "Kyiv",
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
		id: "2",
		name: "Andriyivskyy Descent",
		address: "Kyiv",
		image: "https://destinations.ua/storage/crop/articles/slider_173_max.jpg",
		travelTags: ["historical-sites", "cultural-immersion", "art-museums"],
		travelCategories: ["ancient-streets", "architecture"],
		rating: 4.8,
		coordinates: { lat: 50.4594, lng: 30.5171 },
	},
	{
		id: "3",
		name: "Pyrohiv Museum",
		address: "Kyiv",
		image: "https://lh3.googleusercontent.com/gps-cs-s/AC9h4npCBjllcM0LKQtHuCNKm_sMgoj5mjqktWV_mhIExEDDJhCSmxOf_CxyyzhHLWRwAv-kLJkwgeLyqOftkGqva27MdDwfAG4EsHYUGD88Hf5WhURjr1tHxOH5HUwj5DFojvp4EiFx=s1360-w1360-h1020-rw",
		travelTags: ["historical-sites", "photography", "nature-wildlife"],
		travelCategories: ["open-air-museums", "parks"],
		rating: 4.7,
		coordinates: { lat: 50.3599, lng: 30.5152 },
	},
	{
		id: "4",
		name: "Natalka Park",
		address: "Kyiv",
		image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/f8/e0/46/caption.jpg?w=900&h=500&s=1",
		travelTags: ["nature-wildlife", "relaxation-wellness", "family-travel"],
		travelCategories: ["parks"],
		rating: 4.9,
		coordinates: { lat: 50.4907, lng: 30.5401 },
	},
	{
		id: "5",
		name: "Lviv Old Town",
		address: "Lviv",
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
		id: "6",
		name: "Carpathian Mountains",
		address: "Zakarpattia Oblast",
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
		id: "7",
		name: "Odesa Opera and Ballet Theater",
		address: "Odesa",
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
		id: "8",
		name: "Kamianets-Podilskyi Castle",
		address: "Kamianets-Podilskyi",
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
		id: "9",
		name: "Chernivtsi National University",
		address: "Chernivtsi",
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
		id: "10",
		name: "Sofiyivsky Park",
		address: "Uman",
		image: "https://cdn.tsunamipanel.com/100594/media/galleries/1920/sofievka-park-01.jpg",
		travelTags: ["nature-wildlife", "relaxation-wellness", "photography"],
		travelCategories: ["parks", "botanical-gardens"],
		rating: 4.8,
		coordinates: { lat: 48.7844, lng: 30.2227 },
	},
];

const ITEMS_PER_PAGE = 6;

const simulateApiCall = <T,>(
	items: T[],
	page: number,
	pageSize: number,
	searchQuery: string,
	searchFields: (keyof T)[],
	delay = 800,
): Promise<{
	items: T[];
	hasMore: boolean;
	total: number;
}> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			let filtered = items;
			if (searchQuery) {
				filtered = items.filter((item) =>
					searchFields.some((field) => {
						const value = item[field];
						return (
							typeof value === "string" &&
							value
								.toLowerCase()
								.includes(searchQuery.toLowerCase())
						);
					}),
				);
			}

			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			const paginatedItems = filtered.slice(startIndex, endIndex);
			const hasMore = endIndex < filtered.length;

			resolve({
				items: paginatedItems,
				hasMore,
				total: filtered.length,
			});
		}, delay);
	});
};

interface AutocompleteAddressInputProps {
	value: string;
	onChange: (address: string) => void;
	onSelect: (address: string, latLng: { lat: number; lng: number }) => void;
	placeholder: string;
}

const AutocompleteAddressInput: React.FC<AutocompleteAddressInputProps> = ({
	value,
	onChange,
	onSelect,
	placeholder,
}) => {
	const { t } = useTranslation();

	const handleSelect = async (address: string) => {
		try {
			const results = await geocodeByAddress(address);
			const latLng = await getLatLng(results[0]);

			onSelect(address, latLng);
		} catch (error) {
			showErrorToast(t("placesPage.autocomplete_error_message"));
		}
	};

	return (
		<PlacesAutocomplete
			value={value}
			onChange={onChange}
			onSelect={handleSelect}
		>
			{({
				getInputProps,
				suggestions,
				getSuggestionItemProps,
				loading,
			}) => (
				<div className="relative">
					<Input
						{...getInputProps({
							placeholder: placeholder,
						})}
					/>
					{suggestions.length > 0 && (
						<div className="absolute z-50 w-full bg-white border shadow rounded mt-1 max-h-60 overflow-auto">
							{loading && (
								<div className="px-4 py-2 text-muted-foreground text-sm">
									{t("placesPage.loading")}
								</div>
							)}
							{suggestions.map((suggestion, idx) => (
								<div
									key={idx}
									{...getSuggestionItemProps(suggestion, {
										className:
											"px-4 py-2 hover:bg-muted cursor-pointer text-sm",
									})}
								>
									{suggestion.description}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</PlacesAutocomplete>
	);
};

const AddPlaceBlock = ({ onPlaceAdded }: { onPlaceAdded: () => void }) => {
	const [newPlaceName, setNewPlaceName] = useState("");
	const [newPlaceAddress, setNewPlaceAddress] = useState("");
	const [newPlaceCoordinates, setNewPlaceCoordinates] = useState({
		lat: 0,
		lng: 0,
	});
	const [newPlaceImageFile, setNewPlaceImageFile] = useState<File | null>(
		null,
	);

	const [newPlaceCategories, setNewPlaceCategories] = useState<string[]>([]);
	const [newPlaceTags, setNewPlaceTags] = useState<string[]>([]);
	const [addingPlace, setAddingPlace] = useState(false);
	const { t } = useTranslation();

	const handleAddPlace = async () => {
		if (!newPlaceName.trim() || !newPlaceAddress.trim()) return;
		setAddingPlace(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const newPlace: Place = {
				id: Date.now().toString(),
				name: newPlaceName.trim(),
				address: newPlaceAddress.trim(),
				image: newPlaceImageFile
					? URL.createObjectURL(newPlaceImageFile)
					: "/placeholder.svg?height=200&width=300",
				travelCategories: newPlaceCategories,
				travelTags: newPlaceTags,
				rating: 0,
				coordinates: newPlaceCoordinates,
			};
			showSuccessToast(t("toasts.placeAdded"));
			mockPlaces.unshift(newPlace);
			onPlaceAdded();
		} catch (error) {
			showErrorToast(t("placesPage.add_place_error"));
		} finally {
			setNewPlaceName("");
			setNewPlaceAddress("");
			setNewPlaceCoordinates({ lat: 0, lng: 0 });
			setNewPlaceImageFile(null);
			setNewPlaceCategories([]);
			setNewPlaceTags([]);
			setAddingPlace(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Plus className="w-5 h-5" />
					{t("placesPage.add_new_place")}
				</CardTitle>
				<CardDescription>
					{t("placesPage.create_new_place")}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label>{t("placesPage.place_image")}</Label>
					{newPlaceImageFile ? (
						<div className="relative">
							<img
								src={URL.createObjectURL(newPlaceImageFile)}
								alt="Preview"
								className="w-full h-32 object-cover rounded-lg"
							/>
							<Button
								variant="outline"
								size="sm"
								className="absolute top-2 right-2"
								onClick={() => setNewPlaceImageFile(null)}
							>
								<X className="w-4 h-4" />
							</Button>
						</div>
					) : (
						<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
							<ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
							<p className="text-sm text-muted-foreground mb-2">
								{t("placesPage.upload_image")}
							</p>
							<Input
								type="file"
								accept="image/*"
								onChange={(e) =>
									e.target.files?.[0] &&
									setNewPlaceImageFile(e.target.files[0])
								}
								className="hidden"
								id="new-place-image-upload"
							/>
							<Label
								htmlFor="new-place-image-upload"
								className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer"
							>
								<Upload className="w-4 h-4 mr-2" />
								{t("placesPage.choose_image")}
							</Label>
						</div>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="new-place-name">
						{t("placesPage.place_name")}
					</Label>
					<Input
						id="new-place-name"
						placeholder={t("placesPage.place_name_placeholder")}
						value={newPlaceName}
						onChange={(e) => setNewPlaceName(e.target.value)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="new-place-address">
						{t("placesPage.address")}
					</Label>
					<AutocompleteAddressInput
						value={newPlaceAddress}
						onChange={setNewPlaceAddress}
						onSelect={(address, latLng) => {
							setNewPlaceAddress(address);
							setNewPlaceCoordinates(latLng);
						}}
						placeholder={t("placesPage.address_placeholder")}
					/>
				</div>

				<div className="space-y-2">
					<Label>{t("placesPage.categories")}</Label>
					<MultiSelect
						options={travelCategoriesOptions}
						selected={newPlaceCategories}
						onChange={setNewPlaceCategories}
						placeholder={t("placesPage.categories_placeholder")}
					/>
				</div>

				<div className="space-y-2">
					<Label>{t("placesPage.tags")}</Label>
					<MultiSelect
						options={travelTagsOptions}
						selected={newPlaceTags}
						onChange={setNewPlaceTags}
						placeholder={t("placesPage.tags_placeholder")}
					/>
				</div>

				<Button
					onClick={handleAddPlace}
					disabled={
						!newPlaceName.trim() ||
						!newPlaceAddress.trim() ||
						addingPlace
					}
					className="w-full"
				>
					{addingPlace ? (
						<>
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							{t("placesPage.adding")}
						</>
					) : (
						<>
							<Plus className="w-4 h-4 mr-2" />
							{t("placesPage.add_place")}
						</>
					)}
				</Button>
			</CardContent>
		</Card>
	);
};

const AdminPlacesPage = () => {
	const [places, setPlaces] = useState<Place[]>([]);
	const [placesLoading, setPlacesLoading] = useState(true);
	const [placesLoadingMore, setPlacesLoadingMore] = useState(false);
	const [placesPage, setPlacesPage] = useState(1);
	const [placesHasMore, setPlacesHasMore] = useState(true);
	const [placesTotalCount, setPlacesTotalCount] = useState(0);
	const [placesSearch, setPlacesSearch] = useState("");
	const debouncedPlaceSearch = useDebounce(placesSearch);

	const [editingPlace, setEditingPlace] = useState<string | null>(null);
	const [editPlaceName, setEditPlaceName] = useState("");
	const [editPlaceAddress, setEditPlaceAddress] = useState("");
	const [editPlaceImage, setEditPlaceImage] = useState("");
	const [editPlaceCategories, setEditPlaceCategories] = useState<string[]>(
		[],
	);
	const [editPlaceTags, setEditPlaceTags] = useState<string[]>([]);
	const [editPlaceCoordinates, setEditPlaceCoordinates] = useState({
		lat: 0,
		lng: 0,
	});

	const { t } = useTranslation();
	const [deleteModal, setDeleteModal] = useState<{
		isOpen: boolean;
		placeId: string | null;
		placeName: string;
		isLoading: boolean;
	}>({
		isOpen: false,
		placeId: null,
		placeName: "",
		isLoading: false,
	});

	useEffect(() => {
		loadPlaces(true);
	}, []);

	useEffect(() => {
		setPlaces([]);
		setPlacesPage(1);
		setPlacesHasMore(true);
		loadPlaces(true);
	}, [debouncedPlaceSearch]);

	const loadPlaces = async (isInitial = false) => {
		if (isInitial) {
			setPlacesLoading(true);
		} else {
			setPlacesLoadingMore(true);
		}

		try {
			const response = await simulateApiCall(
				mockPlaces,
				isInitial ? 1 : placesPage,
				ITEMS_PER_PAGE,
				debouncedPlaceSearch,
				["name", "address"],
			);

			if (isInitial) {
				setPlaces(response.items);
				setPlacesPage(2);
			} else {
				setPlaces((prev) => [...prev, ...response.items]);
				setPlacesPage((prev) => prev + 1);
			}

			setPlacesHasMore(response.hasMore);
			setPlacesTotalCount(response.total);
		} catch (error) {
			showErrorToast(t("placesPage.load_places_error"));
		} finally {
			setPlacesLoading(false);
			setPlacesLoadingMore(false);
		}
	};

	const handleDeletePlace = async () => {
		if (!deleteModal.placeId) return;

		setDeleteModal((prev) => ({ ...prev, isLoading: true }));

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const index = mockPlaces.findIndex(
				(p) => p.id === deleteModal.placeId,
			);
			if (index !== -1) {
				mockPlaces.splice(index, 1);
			}

			setPlaces((prev) =>
				prev.filter((p) => p.id !== deleteModal.placeId),
			);
			setPlacesTotalCount((prev) => prev - 1);
			showSuccessToast(t("toasts.placeDeleted"));
			setDeleteModal({
				isOpen: false,
				placeId: null,
				placeName: "",
				isLoading: false,
			});
		} catch (error) {
			showErrorToast(t("placesPage.delete_place_error"));
			setDeleteModal((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const startEditPlace = (place: Place) => {
		setEditingPlace(place.id);
		setEditPlaceName(place.name);
		setEditPlaceAddress(place.address);
		setEditPlaceImage(place.image);
		setEditPlaceCategories(place.travelCategories);
		setEditPlaceTags(place.travelTags);
		setEditPlaceCoordinates(place.coordinates);
	};

	const saveEditPlace = async () => {
		if (!editPlaceName.trim() || !editPlaceAddress.trim()) return;

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			const index = mockPlaces.findIndex((p) => p.id === editingPlace);
			if (index !== -1) {
				mockPlaces[index] = {
					...mockPlaces[index],
					name: editPlaceName.trim(),
					address: editPlaceAddress.trim(),
					image: editPlaceImage,
					travelCategories: editPlaceCategories,
					travelTags: editPlaceTags,
					coordinates: editPlaceCoordinates,
				};
			}

			setPlaces((prev) =>
				prev.map((p) =>
					p.id === editingPlace
						? {
								...p,
								name: editPlaceName.trim(),
								address: editPlaceAddress.trim(),
								image: editPlaceImage,
								travelCategories: editPlaceCategories,
								travelTags: editPlaceTags,
								coordinates: editPlaceCoordinates,
						  }
						: p,
				),
			);
			showSuccessToast(t("toasts.placeUpdated"));

			setEditingPlace(null);
		} catch (error) {
			showErrorToast(t("placesPage.update_place_error"));
		}
	};

	const openDeleteModal = (place: Place) => {
		setDeleteModal({
			isOpen: true,
			placeId: place.id,
			placeName: place.name,
			isLoading: false,
		});
	};

	const closeDeleteModal = () => {
		if (!deleteModal.isLoading) {
			setDeleteModal({
				isOpen: false,
				placeId: null,
				placeName: "",
				isLoading: false,
			});
		}
	};

	const handlePlaceAdded = () => {
		loadPlaces(true);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<MapPin className="w-8 h-8" />
					{t("placesPage.title")}
				</h1>
				<p className="text-muted-foreground mt-1">
					{t("placesPage.description")}
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<AddPlaceBlock onPlaceAdded={handlePlaceAdded} />

				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>
							{t("placesPage.places_list")} ({placesTotalCount})
						</CardTitle>
						<CardDescription>
							{t("placesPage.places_list_description")}
						</CardDescription>
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={t("placesPage.search_placeholder")}
								value={placesSearch}
								onChange={(e) =>
									setPlacesSearch(e.target.value)
								}
								className="pl-8"
							/>
						</div>
					</CardHeader>
					<CardContent>
						{placesLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin mr-2" />
								<span>{t("placesPage.loading")}</span>
							</div>
						) : places.length === 0 ? (
							<div className="text-center py-8">
								<MapPin className="w-12 h-12 mx-auto text-muted-foreground opaaddress-50 mb-4" />
								<p className="text-muted-foreground">
									{t("placesPage.no_places")}
								</p>
							</div>
						) : (
							<>
								<div className="space-y-4">
									{places.map((place) => (
										<div
											key={place.id}
											className="border rounded-lg p-4"
										>
											{editingPlace === place.id ? (
												<div className="space-y-4">
													<div className="space-y-2">
														<Label>
															{t(
																"placesPage.place_image",
															)}
														</Label>
														<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
															{editPlaceImage ? (
																<div className="relative">
																	<img
																		src={
																			editPlaceImage ||
																			"/placeholder.svg"
																		}
																		alt="Place preview"
																		className="w-full h-32 object-cover rounded-lg"
																	/>
																	<Button
																		variant="outline"
																		size="sm"
																		className="absolute top-2 right-2"
																		onClick={() =>
																			setEditPlaceImage(
																				"",
																			)
																		}
																	>
																		<X className="w-4 h-4" />
																	</Button>
																</div>
															) : (
																<div className="text-center">
																	<ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
																	<Button
																		variant="outline"
																		size="sm"
																		onClick={() =>
																			setEditPlaceImage(
																				"/placeholder.svg?height=200&width=300",
																			)
																		}
																	>
																		<Upload className="w-4 h-4 mr-2" />
																		{t(
																			"placesPage.choose_image",
																		)}
																	</Button>
																</div>
															)}
														</div>
													</div>

													<div className="space-y-2">
														<Label
															htmlFor={`edit-place-name-${place.id}`}
														>
															{t(
																"placesPage.place_name",
															)}
														</Label>
														<Input
															id={`edit-place-name-${place.id}`}
															value={
																editPlaceName
															}
															onChange={(e) =>
																setEditPlaceName(
																	e.target
																		.value,
																)
															}
														/>
													</div>

													<div className="space-y-2">
														<Label
															htmlFor={`edit-place-address-${place.id}`}
														>
															{t(
																"placesPage.address",
															)}
														</Label>
														<AutocompleteAddressInput
															value={
																editPlaceAddress
															}
															onChange={
																setEditPlaceAddress
															}
															onSelect={(
																address,
																latLng,
															) => {
																setEditPlaceAddress(
																	address,
																);
																setEditPlaceCoordinates(
																	latLng,
																);
															}}
															placeholder={t(
																"placesPage.address_placeholder",
															)}
														/>
													</div>

													<div className="space-y-2">
														<Label>
															{t(
																"placesPage.categories",
															)}
														</Label>
														<MultiSelect
															options={
																travelCategoriesOptions
															}
															selected={
																editPlaceCategories
															}
															onChange={
																setEditPlaceCategories
															}
															placeholder={t(
																"placesPage.categories_placeholder",
															)}
														/>
													</div>

													<div className="space-y-2">
														<Label>
															{t(
																"placesPage.tags",
															)}
														</Label>
														<MultiSelect
															options={
																travelTagsOptions
															}
															selected={
																editPlaceTags
															}
															onChange={
																setEditPlaceTags
															}
															placeholder={t(
																"placesPage.tags_placeholder",
															)}
														/>
													</div>

													<div className="flex justify-end gap-2">
														<Button
															variant="outline"
															onClick={() =>
																setEditingPlace(
																	null,
																)
															}
														>
															<X className="w-4 h-4 mr-2" />
															{t(
																"placesPage.cancel",
															)}
														</Button>
														<Button
															onClick={
																saveEditPlace
															}
														>
															<Save className="w-4 h-4 mr-2" />
															{t(
																"placesPage.save",
															)}
														</Button>
													</div>
												</div>
											) : (
												<div className="flex items-center gap-4">
													<img
														src={place.image}
														alt={place.name}
														className="w-20 h-20 object-cover rounded-lg"
													/>
													<div className="flex-1">
														<h3 className="font-semibold text-lg">
															{place.name}
														</h3>
														<p className="text-muted-foreground text-sm flex items-center">
															<MapPin className="w-3 h-3 mr-1" />
															{place.address}
														</p>
														<div className="flex flex-wrap gap-1 mt-2">
															{place.travelCategories.map(
																(category) => (
																	<Badge
																		key={
																			category
																		}
																		variant="secondary"
																	>
																		{travelCategoriesOptions.find(
																			(
																				opt,
																			) =>
																				opt.value ===
																				category,
																		)
																			?.label ||
																			category}
																	</Badge>
																),
															)}
															{place.travelTags.map(
																(tag) => (
																	<Badge
																		key={
																			tag
																		}
																		variant="outline"
																	>
																		{travelTagsOptions.find(
																			(
																				opt,
																			) =>
																				opt.value ===
																				tag,
																		)
																			?.label ||
																			tag}
																	</Badge>
																),
															)}
														</div>
														{place.rating > 0 && (
															<div className="flex items-center text-sm text-muted-foreground mt-1">
																<Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
																<span>
																	{place.rating.toFixed(
																		1,
																	)}
																</span>
															</div>
														)}
													</div>
													<div className="flex gap-2">
														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																startEditPlace(
																	place,
																)
															}
														>
															<Edit className="w-4 h-4" />
														</Button>
														<Button
															variant="destructive"
															size="sm"
															onClick={() =>
																openDeleteModal(
																	place,
																)
															}
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</div>
											)}
										</div>
									))}
								</div>
								{placesHasMore && (
									<div className="text-center mt-4">
										<Button
											onClick={() => loadPlaces(false)}
											disabled={placesLoadingMore}
										>
											{placesLoadingMore ? (
												<>
													<Loader2 className="w-4 h-4 mr-2 animate-spin" />
													{t(
														"placesPage.loading_more",
													)}
												</>
											) : (
												t("placesPage.load_more")
											)}
										</Button>
									</div>
								)}
							</>
						)}
					</CardContent>
				</Card>
			</div>

			<ConfirmationModal
				isOpen={deleteModal.isOpen}
				onClose={closeDeleteModal}
				onConfirm={handleDeletePlace}
				title={t("placesPage.delete_title", {
					placeName: deleteModal.placeName,
				})}
				description={t("placesPage.delete_description")}
				isLoading={deleteModal.isLoading}
			/>
		</div>
	);
};

export default AdminPlacesPage;
