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
	return (
		<>
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle>Reviews ({totalReviews})</CardTitle>
					<Button onClick={onWriteReviewClick}>
						<Plus className="w-4 h-4 mr-2" />
						{showReviewForm ? "Close Review Form" : "Write Review"}
					</Button>
				</div>
			</CardHeader>
			<div className="flex flex-col md:flex-row gap-4 mb-6 px-6">
				<Select value={reviewFilter} onValueChange={setReviewFilter}>
					<SelectTrigger className="w-full md:w-[180px]">
						<SelectValue placeholder="Filter reviews" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Reviews</SelectItem>
						<SelectItem value="positive">Positive Only</SelectItem>
						<SelectItem value="negative">Negative Only</SelectItem>
					</SelectContent>
				</Select>

				<Select value={reviewSort} onValueChange={setReviewSort}>
					<SelectTrigger className="w-full md:w-[180px]">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="newest">Newest First</SelectItem>
						<SelectItem value="oldest">Oldest First</SelectItem>
						<SelectItem value="highest">Highest Rating</SelectItem>
						<SelectItem value="lowest">Lowest Rating</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</>
	);
};

export default ReviewSectionHeader;
