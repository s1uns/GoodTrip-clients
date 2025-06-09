import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Stars } from "..";
import { formatNumber } from "@/shared/utils/helpers/formatNumber";
import { useTranslation } from "react-i18next";

interface LocationInfoCardProps {
	name: string;
	address: string;
	rating: number;
	totalReviews: number;
	types: string[];
	placeTypesMapping: Record<string, string>;
}

const LocationInfoCard = ({
	name,
	address,
	rating,
	totalReviews,
	types,
	placeTypesMapping,
}: LocationInfoCardProps) => {
	const { t } = useTranslation();

	const getReviewsText = (count: number) => {
		if (count === 1) {
			return t("locationInfoCard.oneReview");
		}
		return `${formatNumber(totalReviews)} ${t(
			"locationInfoCard.reviewsCount",
		)}`;
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-2xl">{name}</CardTitle>
						<CardDescription className="flex items-center mt-2">
							<MapPin className="w-4 h-4 mr-1" />
							{address}
						</CardDescription>
					</div>
					<div className="text-right">
						<div className="flex items-center">
							<Stars rating={rating} />
							<span className="ml-2 font-semibold">{rating}</span>
						</div>
						<p className="text-sm text-muted-foreground">
							{getReviewsText(totalReviews)}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div>
						<h3 className="font-semibold mb-2">
							{t("locationInfoCard.categoriesTitle")}
						</h3>
						<div className="flex flex-wrap gap-2">
							{types.map((type: string) => (
								<Badge key={type} variant="secondary">
									{placeTypesMapping[type] || type}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default LocationInfoCard;
