import { memo, useCallback, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Flag } from "lucide-react";
import Stars from "../Stars";
import { ENTITY_REVIEW } from "@/shared/constants/place";
import { convertDateToDDMonYYYY } from "@/shared/utils/helpers/convertDateToDDMonYYYY";

interface ReviewHeaderProps {
	id: string;
	username: string;
	rating: number;
	date: string;
	isOwn: boolean;
	setEditingReview: Dispatch<SetStateAction<string | null>>;
	deleteReview: (reviewId: string) => void;
	openReportDialog: (entityId: string, entityType: number) => void;
	text: string;
	images: string[];
}

const ReviewHeader = memo<ReviewHeaderProps>(
	({
		id,
		username,
		rating,
		date,
		isOwn,
		setEditingReview,
		deleteReview,
		openReportDialog,
	}) => {
		const handleDeleteReview = useCallback(
			() => deleteReview(id),
			[id, deleteReview],
		);

		return (
			<div className="flex items-start justify-between mb-3">
				<div className="flex items-center gap-3">
					<div>
						<p className="font-semibold">{username}</p>
						<div className="flex items-center gap-2">
							<Stars rating={rating} />
							<span className="text-sm text-muted-foreground">
								{convertDateToDDMonYYYY(date)}
							</span>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					{isOwn && (
						<>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setEditingReview(id);
								}}
							>
								<Edit className="w-4 h-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={handleDeleteReview}
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</>
					)}
					{!isOwn && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => openReportDialog(id, ENTITY_REVIEW)}
						>
							<Flag className="w-4 h-4" />
						</Button>
					)}
				</div>
			</div>
		);
	},
	(prevProps, nextProps) =>
		prevProps.id === nextProps.id &&
		prevProps.username === nextProps.username &&
		prevProps.rating === nextProps.rating &&
		prevProps.date === nextProps.date &&
		prevProps.isOwn === nextProps.isOwn &&
		prevProps.text === nextProps.text &&
		prevProps.images.length === nextProps.images.length &&
		prevProps.images.every((img, i) => img === nextProps.images[i]),
);

export default ReviewHeader;
