import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ReviewSectionHeaderProps {
	totalReviews: number;
	reviewFilter: string;
	setReviewFilter: (value: string) => void;
	reviewSort: string;
	setReviewSort: (value: string) => void;
	onWriteReviewClick: () => void;
	showReviewForm: boolean;
}

const ReviewSectionHeader = ({
	totalReviews,
	reviewFilter,
	setReviewFilter,
	reviewSort,
	setReviewSort,
	onWriteReviewClick,
	showReviewForm,
}: ReviewSectionHeaderProps) => {
	const { t } = useTranslation(); 

	return (
		<>
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle>
						{t("placeView.reviewsSection.title", { totalReviews })}
					</CardTitle>
					<Button onClick={onWriteReviewClick}>
						<Plus className="w-4 h-4 mr-2" />
						{showReviewForm
							? t("placeView.reviewsSection.closeReviewForm")
							: t("placeView.reviewsSection.writeReview")}
					</Button>
				</div>
			</CardHeader>
			<div className="flex flex-col md:flex-row gap-4 mb-6 px-6">
				<Select value={reviewFilter} onValueChange={setReviewFilter}>
					<SelectTrigger className="w-full md:w-[180px]">
						<SelectValue
							placeholder={t(
								"placeView.reviewsSection.filterPlaceholder",
							)}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">
							{t("placeView.reviewsSection.allReviews")}
						</SelectItem>
						<SelectItem value="positive">
							{t("placeView.reviewsSection.positiveReviews")}
						</SelectItem>
						<SelectItem value="negative">
							{t("placeView.reviewsSection.negativeReviews")}
						</SelectItem>
					</SelectContent>
				</Select>

				<Select value={reviewSort} onValueChange={setReviewSort}>
					<SelectTrigger className="w-full md:w-[180px]">
						<SelectValue
							placeholder={t(
								"placeView.reviewsSection.sortPlaceholder",
							)}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="newest">
							{t("placeView.reviewsSection.newest")}
						</SelectItem>
						<SelectItem value="oldest">
							{t("placeView.reviewsSection.oldest")}
						</SelectItem>
						<SelectItem value="highest">
							{t("placeView.reviewsSection.highestRating")}
						</SelectItem>
						<SelectItem value="lowest">
							{t("placeView.reviewsSection.lowestRating")}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</>
	);
};

export default ReviewSectionHeader;
