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
			"https://www.pca-stream.com/wp-content/uploads/2023/12/13-2560x1440.jpg",
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
				username: "johndoe",
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
		likes: 1800,
		dislikes: 1,
		isLiked: true,
		isDisliked: false,
		isOwn: false,
		replies: [],
	},
	{
		id: "3",
		userId: "currentUser",
		username: "johndoe",
		rating: 5,
		date: "2025-01-08",
		text: "One of my favorite places in the city! I come here every weekend for jogging and it never gets old. The atmosphere is always peaceful and relaxing.",
		images: ["/placeholder.svg?height=200&width=300"],
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

	useEffect(() => {
		const fetchPlace = async () => {
			setLoading(true);
			try {
				setTimeout(() => {
					const placeData = {
						id: "1",
						name: "Pinchuk Art Centre",
						address:
							"Velyka Vasylkivska St., Baseyna St., 1, 3-2, Kyiv, 01004",
						rating: 4.6,
						totalReviews: 89234,
						types: ["park", "tourist_attraction"],
						coordinates: {
							lat: 50.44177930000001,
							lng: 30.5211407,
						},
						picture:
							"https://wiki.kubg.edu.ua/images/c/c3/218-pinchuk-art-centre-75-1448354257.jpg",
					};
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
	};

	const handleOpenInGoogleMaps = () =>
		window.open(
			`https://www.google.com/maps/search/?api=1&query=$${place.coordinates.lat},${place.coordinates.lng}`,
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
				username: "johndoe",
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
		} catch (error) {
			console.error("Error submitting review:", error);
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
		setReviews((prev) =>
			prev.map((review) =>
				review.id === reviewId
					? { ...review, replies: [...review.replies, reply] }
					: review,
			),
		);
	};

	const handleEditReview = (
		editText: string,
		editRating: number,
		reviewId: string,
		editImages: string[],
	) => {
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

		setEditingReview(null);
	};

	const handleDeleteReview = (reviewId: string) => {
		setReviews((prev) => prev.filter((review) => review.id !== reviewId));
	};

	const handleEditReply = useCallback(
		(reviewId: string, replyId: string, editText: string) => {
			setReviews((prevReviews) =>
				prevReviews.map((review) =>
					review.id === reviewId
						? {
								...review,
								replies: review.replies.map((reply: Reply) =>
									reply.id === replyId
										? { ...reply, text: editText }
										: reply,
								),
						  }
						: review,
				),
			);
		},
		[],
	);

	const handleDeleteReply = useCallback(
		(reviewId: string, replyId: string) => {
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
							totalReviews={filteredAndSortedReviews.length}
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
