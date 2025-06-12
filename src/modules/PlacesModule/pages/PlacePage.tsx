import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useParams } from "react-router-dom";
import {
	LocationInfoCard,
	LocationMap,
	PlaceImageBanner,
	ReviewForm,
	ReviewItem,
	ReviewSectionHeader,
} from "../components";
import { Review } from "@/shared/types/Review";
import { Reply } from "@/shared/types/Reply";
import { useTranslation } from "react-i18next";
import {
	showErrorToast,
	showSuccessToast,
} from "@/shared/utils/helpers/showToast";

const placeTypesMapping: Record<string, string> = {
	amusement_park: "Amusement Park",
	aquarium: "Aquarium",
	art_gallery: "Art Gallery",
	atm: "ATM",
	bakery: "Bakery",
	bank: "Bank",
	bar: "Bar",
	beauty_salon: "Beauty Salon",
	book_store: "Book Store",
	bowling_alley: "Bowling Alley",
	bus_station: "Bus Station",
	cafe: "Cafe",
	campground: "Campground",
	car_rental: "Car Rental",
	casino: "Casino",
	cemetery: "Cemetery",
	church: "Church",
	city_hall: "City Hall",
	clothing_store: "Clothing Store",
	convenience_store: "Convenience Store",
	department_store: "Department Store",
	doctor: "Doctor",
	drugstore: "Drugstore",
	embassy: "Embassy",
	florist: "Florist",
	gas_station: "Gas Station",
	hair_care: "Hair Care",
	hindu_temple: "Hindu Temple",
	home_goods_store: "Home Goods Store",
	hospital: "Hospital",
	library: "Library",
	light_rail_station: "Light Rail Station",
	liquor_store: "Liquor Store",
	lodging: "Lodging",
	meal_delivery: "Meal Delivery",
	meal_takeaway: "Meal Takeaway",
	mosque: "Mosque",
	movie_theater: "Movie Theater",
	museum: "Museum",
	night_club: "Night Club",
	painter: "Painter",
	park: "Park",
	parking: "Parking",
	pharmacy: "Pharmacy",
	police: "Police",
	post_office: "Post Office",
	restaurant: "Restaurant",
	shopping_mall: "Shopping Mall",
	spa: "Spa",
	stadium: "Stadium",
	store: "Store",
	subway_station: "Subway Station",
	supermarket: "Supermarket",
	synagogue: "Synagogue",
	taxi_stand: "Taxi Stand",
	tourist_attraction: "Tourist Attraction",
	train_station: "Train Station",
	transit_station: "Transit Station",
	travel_agency: "Travel Agency",
	university: "University",
	zoo: "Zoo",
};

const mockReviews: Review[] = [
	{
		id: "1",
		userId: "user1",
		username: "emmajohnson",
		rating: 5,
		date: "2025-01-15",
		text: "Absolutely stunning place! The scenery is breathtaking and there's so much to explore. Perfect for families and couples alike. Highly recommend visiting during sunset for the best views.",
		images: [
			"https://comers.com.ua/wp-content/uploads/2014/09/OD-AU297_RUSMUS_P_20121115132702.jpg",
			"https://lh3.googleusercontent.com/p/AF1QipNzsukYDRhMxtGMmI0YQFIMWYFdKgEVRu0ozQvi=s1360-w1360-h1020-rw",
		],
		likes: 24,
		dislikes: 2,
		isLiked: false,
		isDisliked: false,
		isOwn: false,
		replies: [
			{
				id: "101",
				userId: "user2",
				username: "mikechen",
				date: "2025-01-16",
				text: "I totally agree! The place is incredible.",
				isOwn: false,
				images: [],
			},
			{
				id: "103",
				userId: "currentUser",
				username: "illiateliuk",
				date: "2025-01-17",
				text: "@Mike Chen, Glad you liked it too!",
				isOwn: true,
				images: [],
			},
		],
	},
	{
		id: "2",
		userId: "user3",
		username: "sarahwilliams",
		rating: 4,
		date: "2025-01-10",
		text: "Great place to visit, but it can get quite crowded during peak hours. The facilities are well-maintained and the staff is friendly.",
		images: [],
		likes: 18,
		dislikes: 1,
		isLiked: true,
		isDisliked: false,
		isOwn: false,
		replies: [],
	},
	{
		id: "3",
		userId: "somebody",
		username: "peterparker",
		rating: 5,
		date: "2025-01-08",
		text: "One of my favorite places in the city! I come here every weekend for jogging and it never gets old. The atmosphere is always peaceful and relaxing.",
		images: [
			"https://pinchukartcentre.org/imglib/_newimage/photo_and_video/photo/25549/25574/ill_2188_1.jpg",
		],
		likes: 12,
		dislikes: 0,
		isLiked: false,
		isDisliked: false,
		isOwn: true,
		replies: [],
	},
	{
		id: "4",
		userId: "user4",
		username: "davybrown",
		rating: 2,
		date: "2025-01-05",
		text: "Not what I expected. The place was overcrowded and dirty. The maintenance could be much better. Wouldn't recommend visiting during weekends.",
		images: [],
		likes: 3,
		dislikes: 15,
		isLiked: false,
		isDisliked: false,
		isOwn: false,
		replies: [
			{
				id: "102",
				userId: "user5",
				username: "lisagarcia",
				date: "2025-01-06",
				text: "I had a different experience. Maybe try visiting on weekdays?",
				isOwn: false,
				images: [],
			},
		],
	},
];

const PlaceView = () => {
	const { placeId } = useParams();
	const { t } = useTranslation();
	const [place, setPlace] = useState<any>(null);
	const [reviews, setReviews] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [isFavorite, setIsFavorite] = useState(false);

	const [isSubmittingReview, setIsSubmittingReview] = useState(false);

	const [reviewFilter, setReviewFilter] = useState("all");
	const [reviewSort, setReviewSort] = useState("newest");
	const [showReviewForm, setShowReviewForm] = useState(false);

	const [editingReview, setEditingReview] = useState<string | null>(null);
	const [updatingReview, setUpdatingReview] = useState(false);
	const [updatingReply, setUpdatingReply] = useState(false);

	useEffect(() => {
		const fetchPlace = async () => {
			setLoading(true);
			try {
				setTimeout(() => {
					const placeData = mockedPlaces.find(
						(place) => `${place.id}` === `${placeId}`,
					);
					setPlace(placeData);
					setReviews(mockReviews);
					setLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Error fetching place:", error);
				setLoading(false);
			}
		};

		fetchPlace();
	}, [placeId]);

	const filteredAndSortedReviews: Review[] = reviews
		.filter((review) => {
			if (reviewFilter === "positive") return review.rating >= 4;
			if (reviewFilter === "negative") return review.rating <= 2;
			return true;
		})
		.sort((a, b) => {
			switch (reviewSort) {
				case "newest":
					return (
						new Date(b.date).getTime() - new Date(a.date).getTime()
					);
				case "oldest":
					return (
						new Date(a.date).getTime() - new Date(b.date).getTime()
					);
				case "highest":
					return b.rating - a.rating;
				case "lowest":
					return a.rating - b.rating;
				default:
					return 0;
			}
		});

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
		showSuccessToast(t("placeView.placeLinkCopied"));
	};

	const handleOpenInGoogleMaps = () =>
		window.open(
			`https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`,
			"_blank",
		);

	const handleSubmitReview = async (
		rating: number,
		text: string,
		images: string[],
	) => {
		setIsSubmittingReview(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const review = {
				id: Date.now().toString(),
				userId: "currentUser",
				username: "illiateliuk",
				rating: rating,
				date: new Date().toISOString().split("T")[0],
				text: text,
				images: images,
				likes: 0,
				dislikes: 0,
				isLiked: false,
				isDisliked: false,
				isOwn: true,
				replies: [],
			};

			setReviews([review, ...reviews]);
			setShowReviewForm(false);
			showSuccessToast(t("toasts.reviewAdded"));
		} catch (error) {
			showErrorToast(t("toasts.somethingWentWrong"));
		} finally {
			setIsSubmittingReview(false);
		}
	};

	const handleLikeReview = (reviewId: string) => {
		setReviews((prev) =>
			prev.map((review) =>
				review.id === reviewId
					? {
							...review,
							likes: review.isLiked
								? review.likes - 1
								: review.likes + 1,
							dislikes: review.isDisliked
								? review.dislikes - 1
								: review.dislikes,
							isLiked: !review.isLiked,
							isDisliked: false,
					  }
					: review,
			),
		);
	};

	const handleDislikeReview = (reviewId: string) => {
		setReviews((prev) =>
			prev.map((review) =>
				review.id === reviewId
					? {
							...review,
							dislikes: review.isDisliked
								? review.dislikes - 1
								: review.dislikes + 1,
							likes: review.isLiked
								? review.likes - 1
								: review.likes,
							isDisliked: !review.isDisliked,
							isLiked: false,
					  }
					: review,
			),
		);
	};

	const handleAddReply = (reply: Reply, reviewId: string) => {
		try {
			setReviews((prev) =>
				prev.map((review) =>
					review.id === reviewId
						? { ...review, replies: [...review.replies, reply] }
						: review,
				),
			);
			showSuccessToast(t("toasts.replyAdded"));
		} catch (error) {
			showErrorToast(t("toasts.somethingWentWrong"));
		}
	};

	const handleEditReview = (
		editText: string,
		editRating: number,
		reviewId: string,
		editImages: string[],
	) => {
		try {
			setUpdatingReview(true);
			setReviews((prev) =>
				prev.map((review) =>
					review.id === reviewId
						? {
								...review,
								text: editText,
								rating: editRating,
								images: editImages,
						  }
						: review,
				),
			);
			showSuccessToast(t("toasts.reviewUpdated"));

			setEditingReview(null);
		} catch {
			showErrorToast(t("toasts.somethingWentWrong"));
		} finally {
			setUpdatingReview(false);
		}
	};

	const handleDeleteReview = async (reviewId: string) => {
		try {
			setReviews((prev) =>
				prev.filter((review) => review.id !== reviewId),
			);
			showSuccessToast(t("toasts.reviewDeleted"));
		} catch {
			showErrorToast(t("toasts.somethingWentWrong"));
		}
	};

	const handleEditReply = useCallback(
		(reviewId: string, replyId: string, editText: string) => {
			try {
				setUpdatingReply(true);

				setReviews((prevReviews) =>
					prevReviews.map((review) =>
						review.id === reviewId
							? {
									...review,
									replies: review.replies.map(
										(reply: Reply) =>
											reply.id === replyId
												? { ...reply, text: editText }
												: reply,
									),
							  }
							: review,
					),
				);
				showSuccessToast(t("toasts.replyUpdated"));
			} catch {
				showErrorToast(t("toasts.somethingWentWrong"));
			} finally {
				setUpdatingReply(false);
			}
		},
		[],
	);

	const handleDeleteReply = useCallback(
		async (reviewId: string, replyId: string) => {
			try {
				setReviews((prevReviews) =>
					prevReviews.map((review) =>
						review.id === reviewId
							? {
									...review,
									replies: review.replies.filter(
										(reply: Reply) => reply.id !== replyId,
									),
							  }
							: review,
					),
				);
				showSuccessToast(t("toasts.replyDeleted"));
			} catch {
				showErrorToast(t("toasts.somethingWentWrong"));
			}
		},
		[],
	);

	if (loading) {
		return (
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
		);
	}

	if (!place) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">
						{t("placeView.placeNotFoundTitle")}
					</h1>
					<p className="text-muted-foreground">
						{t("placeView.placeNotFoundDescription")}
					</p>
					<Button
						variant="outline"
						className="mt-4"
						onClick={() => window.history.back()}
					>
						{t("placeView.goBack")}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<PlaceImageBanner
				picture={place.picture}
				name={place.name}
				isFavorite={isFavorite}
				onToggleFavorite={() => setIsFavorite(!isFavorite)}
				onShare={handleShare}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<LocationInfoCard
						name={place.name}
						address={place.address}
						rating={place.rating}
						totalReviews={place.totalReviews}
						types={place.types}
						placeTypesMapping={placeTypesMapping}
					/>

					<Card>
						<ReviewSectionHeader
							totalReviews={place.totalReviews}
							reviewFilter={reviewFilter}
							setReviewFilter={setReviewFilter}
							reviewSort={reviewSort}
							setReviewSort={setReviewSort}
							onWriteReviewClick={() =>
								setShowReviewForm(!showReviewForm)
							}
							showReviewForm={showReviewForm}
						/>
						<div className="px-6 pb-6">
							{showReviewForm && (
								<ReviewForm
									onSubmit={handleSubmitReview}
									onCancel={() => setShowReviewForm(false)}
									isSubmitting={isSubmittingReview}
								/>
							)}

							<div className="space-y-6">
								{filteredAndSortedReviews.map((review) => (
									<ReviewItem
										key={review.id}
										id={review.id}
										rating={review.rating}
										date={review.date}
										isOwn={review.isOwn}
										text={review.text}
										username={review.username}
										isEditing={editingReview === review.id}
										isLiked={review.isLiked}
										isDisliked={review.isDisliked}
										likes={review.likes}
										dislikes={review.dislikes}
										handleAddReply={handleAddReply}
										deleteReview={handleDeleteReview}
										editReview={handleEditReview}
										setEditingReview={setEditingReview}
										likeReview={handleLikeReview}
										dislikeReview={handleDislikeReview}
										replies={review.replies}
										images={review.images}
										editReply={handleEditReply}
										deleteReply={handleDeleteReply}
									/>
								))}
							</div>
						</div>
					</Card>
				</div>

				<div className="space-y-6">
					<Card className="h-90">
						<CardHeader className="flex flex-row justify-between items-center">
							<CardTitle>{t("placeView.location")}</CardTitle>
							<Button onClick={handleOpenInGoogleMaps}>
								{t("placeView.openInGoogleMaps")}
							</Button>
						</CardHeader>
						<CardContent>
							<div className="h-64 bg-muted rounded-lg flex items-center justify-center">
								<LocationMap
									latitude={place.coordinates.lat}
									longitude={place.coordinates.lng}
									locationName={place.name}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default PlaceView;

const mockedPlaces = [
	{
		id: "1",
		name: "Pinchuk Art Centre",
		address: "Velyka Vasylkivska St., Baseyna St., 1, 3-2, Kyiv, 01004",
		rating: 4,
		totalReviews: 4,
		types: ["art_gallery", "museum"],
		coordinates: {
			lat: 50.44177930000001,
			lng: 30.5211407,
		},
		picture:
			"https://wiki.kubg.edu.ua/images/c/c3/218-pinchuk-art-centre-75-1448354257.jpg",
	},
	{
		id: "2231",
		name: "VDNH (Expocenter of Ukraine)",
		address: "1 Akademika Hlushkova Ave, Kyiv, 03680",
		rating: 4.6,
		totalReviews: 12000,
		types: ["exhibition_center", "park"],
		coordinates: { lat: 50.3817, lng: 30.4772 },
		picture:
			"https://upload.wikimedia.org/wikipedia/commons/0/07/%D0%9A%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%D0%95%D0%BA%D1%81%D0%BF%D0%BE%D1%86%D0%B5%D0%BD%D1%82%D1%80_%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B8.jpg",
	},
	{
		id: 2,
		name: "Andriyivskyy Descent",
		address: "Andriyivskyy Descent, Kyiv, 04053",
		rating: 4.8,
		totalReviews: 15000,
		types: ["historical_street", "attraction"],
		coordinates: { lat: 50.4594, lng: 30.5171 },
		picture:
			"https://destinations.ua/storage/crop/articles/slider_173_max.jpg",
	},
	{
		id: 3,
		name: "Pyrohiv Museum",
		address: "1 Pyrohivska St, Kyiv, 03026",
		rating: 4.7,
		totalReviews: 8000,
		types: ["open_air_museum", "park"],
		coordinates: { lat: 50.3599, lng: 30.5152 },
		picture:
			"https://lh3.googleusercontent.com/gps-cs-s/AC9h4npCBjllcM0LKQtHuCNKm_sMgoj5mjqktWV_mhIExEDDJhCSmxOf_CxyyzhHLWRwAv-kLJkwgeLyqOftkGqva27MdDwfAG4EsHYUGD88Hf5WhURjr1tHxOH5HUwj5DFojvp4EiFx=s1360-w1360-h1020-rw",
	},
	{
		id: 4,
		name: "Natalka Park",
		address: "Obolonska Embankment, Kyiv, 04211",
		rating: 4.9,
		totalReviews: 9500,
		types: ["park", "recreational_area"],
		coordinates: { lat: 50.4907, lng: 30.5401 },
		picture:
			"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/f8/e0/46/caption.jpg?w=900&h=500&s=1",
	},
	{
		id: 5,
		name: "Lviv Old Town",
		address: "Rynok Square, Lviv, 79000",
		rating: 4.9,
		totalReviews: 20000,
		types: ["historical_center", "attraction"],
		coordinates: { lat: 49.8419, lng: 24.0315 },
		picture:
			"https://whc.unesco.org/uploads/thumbs/site_0865_0002-750-750-20151104125432.jpg",
	},
	{
		id: 6,
		name: "Carpathian Mountains",
		address: "Zakarpattia Oblast, Ukraine",
		rating: 4.7,
		totalReviews: 18000,
		types: ["mountain_range", "natural_landmark"],
		coordinates: { lat: 48.2917, lng: 24.5967 },
		picture:
			"https://lp-cms-production.imgix.net/2023-10/iStock-1657465139-RFC.jpg",
	},
	{
		id: 7,
		name: "Odesa Opera and Ballet Theater",
		address: "48 Lanzheronivska St, Odesa, 65026",
		rating: 4.8,
		totalReviews: 11000,
		types: ["opera_house", "theater"],
		coordinates: { lat: 46.4851, lng: 30.7408 },
		picture:
			"https://lh3.googleusercontent.com/gps-cs-s/AC9h4npqBXvoPIb4BMqyXt56LOZiEL1XGqHC6bJr_ySHXMNgdDgB81EdEfO253D2kGwyQzMR4smmZewf6W9g5JaL9ccnCfJuYaJjmy8fDZZ7hM-i3KP0Go0lszeabhstG1xWSFyi3uRIMw=s1360-w1360-h1020-rw",
	},
	{
		id: 8,
		name: "Kamianets-Podilskyi Castle",
		address:
			"Old Fortress, Kamianets-Podilskyi, Khmelnytskyi Oblast, 32300",
		rating: 4.9,
		totalReviews: 9000,
		types: ["castle", "historical_site"],
		coordinates: { lat: 48.675, lng: 26.585 },
		picture:
			"https://lh3.googleusercontent.com/gps-cs-s/AC9h4npwahLQkdaWj4XrQ3PFKIVyGGJXnp0jOr3YFKH_KWKA5TKbXB4CMWHkX-dd9sK7HbqjPR-myFK_L2L1DHx6iVFPPy00dbPyEjit2ez8yOTLVE1mpp8o9s3IwhzMqq_zsZBoduW2=s1360-w1360-h1020-rw",
	},
	{
		id: 9,
		name: "Chernivtsi National University",
		address: "2 Kotsyubynskoho St, Chernivtsi, 58012",
		rating: 4.7,
		totalReviews: 7000,
		types: ["university", "architectural_landmark"],
		coordinates: { lat: 48.2979, lng: 25.9366 },
		picture:
			"https://www.shutterstock.com/search/chernivtsi-national-university",
	},
	{
		id: 10,
		name: "Sofiyivsky Park",
		address: "12 Sadova St, Uman, Cherkasy Oblast, 20300",
		rating: 4.8,
		totalReviews: 8500,
		types: ["park", "botanical_garden"],
		coordinates: { lat: 48.7844, lng: 30.2227 },
		picture:
			"https://cdn.tsunamipanel.com/100594/media/galleries/1920/sofievka-park-01.jpg",
	},
	{
		id: "110",
		name: "Truskavets Wellness Center",
		address: "2 Sukhomlynov St, Truskavets, Lviv Oblast, 82200",
		rating: 4.8,
		totalReviews: 5000,
		types: ["spa", "wellness_center"],
		coordinates: { lat: 49.278, lng: 23.51 },
		picture: "https://cdn.tsn.ua/files/2021/09/28/05a5d01dcb0df1.jpg",
	},
	{
		id: "111",
		name: "Bukovel Ski Resort",
		address: "Polianytsia, Ivano-Frankivsk Oblast, 78593",
		rating: 4.9,
		totalReviews: 10000,
		types: ["ski_resort", "recreational_area"],
		coordinates: { lat: 48.348, lng: 24.406 },
		picture:
			"https://www.ukrinform.ua/rubric-tourism/2964873-bukovel-krasivo-vzhe-ale-sezon-na-prirodi-rozpocavsa.html",
	},
	{
		id: "112",
		name: "Khortytsia Island",
		address: "Khortytsia Island, Zaporizhzhia, 69017",
		rating: 4.7,
		totalReviews: 9000,
		types: ["island", "historical_site"],
		coordinates: { lat: 47.867, lng: 35.086 },
		picture:
			"https://upload.wikimedia.org/wikipedia/commons/3/3d/Khyrtytsia_Island.jpg",
	},
	{
		id: "113",
		name: "Apollo Shopping Mall",
		address: "36 Nezalezhnosti (Titova) St, Dnipro, 49055",
		rating: 4.2,
		totalReviews: 6000,
		types: ["shopping_mall", "entertainment_center"],
		coordinates: { lat: 48.4357, lng: 34.9754 },
		picture: "https://cdn.otzyv.ua/data/images/otzyv_41416.jpeg",
	},
	{
		id: "114",
		name: "Zelenyi Hai Park",
		address: "31 Nezalezhnosti (Titova) St, Dnipro, 49055",
		rating: 4.6,
		totalReviews: 5500,
		types: ["park"],
		coordinates: { lat: 48.4363, lng: 34.9782 },
		picture:
			"https://upload.wikimedia.org/wikipedia/commons/e/ec/%D0%9F%D0%B0%D1%80%D0%BA_%22%D0%97%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9_%D0%93%D0%B0%D0%B9%22.jpg",
	},
	{
		id: "101",
		name: "Taras Shevchenko Park",
		address: "Shevchenko Park, Dnipro, 49000",
		rating: 4.5,
		totalReviews: 7000,
		types: ["park"],
		coordinates: { lat: 48.4705, lng: 35.0502 },
		picture: "https://dnipro-foto.com.ua/images/shevchenko-park.jpg",
	},
];
