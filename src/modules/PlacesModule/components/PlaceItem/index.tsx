import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/shared/constants/routes";

interface Place {
	id: number;
	name: string;
	city: string;
	image: string;
	travelTags: string[];
	travelCategories: string[];
	rating: number;
	coordinates: {
		lat: number;
		lng: number;
	};
}

interface PlaceItemProps {
	place: Place;
	distanceEnabled: boolean;
	userCoordinates: { lat: number; lng: number } | null;
	travelTagsOptions: { label: string; value: string }[];
	travelCategoriesOptions: { label: string; value: string }[];
	isFavorite: boolean;
	onToggleFavorite: (placeId: number) => void;
}

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

const PlaceItem: FC<PlaceItemProps> = ({
	place,
	distanceEnabled,
	userCoordinates,
	travelTagsOptions,
	travelCategoriesOptions,
	isFavorite,
	onToggleFavorite,
}) => {
	const handleFavoriteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		onToggleFavorite(place.id);
	};

	return (
		<Link to={`${ROUTES.PLACES}/${place.id}`}>
			<Card className="hover:shadow-lg transition-all cursor-pointer">
				<CardHeader className="p-0 relative">
					<img
						src={place.image || "/placeholder.svg"}
						alt={place.name}
						className="w-full h-48 object-cover rounded-t-lg"
					/>
					<div
						className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md cursor-pointer"
						onClick={handleFavoriteClick}
					>
						<Heart
							className={`w-4 h-4 ${
								isFavorite ? "text-red-500 fill-current" : ""
							}`}
						/>
					</div>
				</CardHeader>
				<CardContent className="p-4">
					<CardTitle className="text-xl mb-2">{place.name}</CardTitle>
					<div className="flex items-center mb-2 text-muted-foreground">
						<MapPin className="w-4 h-4 mr-1" />
						<span className="text-sm">{place.city}</span>
					</div>
					<div className="flex items-center mb-3">
						<Star className="w-5 h-5 fill-current" />
						<span className="ml-1 font-semibold">
							{place.rating.toFixed(1)}
						</span>
						{distanceEnabled && userCoordinates && (
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
						{place.travelCategories.slice(0, 2).map((category) => (
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
								+{place.travelCategories.length - 2} more
							</span>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default PlaceItem;
