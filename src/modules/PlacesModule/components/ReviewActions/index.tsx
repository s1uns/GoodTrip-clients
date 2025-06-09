import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatNumber } from "@/shared/utils/helpers/formatNumber";

interface ReviewActionsProps {
	isLiked: boolean;
	isDisliked: boolean;
	likes: number;
	dislikes: number;
	handleLikeReview: () => void;
	handleDislikeReview: () => void;
	handleReply: (targetUsername: string, isReplyToReply: boolean) => void;
	username: string;
}

const ReviewActions = memo<ReviewActionsProps>(
	({
		isLiked,
		isDisliked,
		likes,
		dislikes,
		handleLikeReview,
		handleDislikeReview,
		handleReply,
		username,
	}) => {
		const { t } = useTranslation();
		return (
			<div className="flex items-center gap-4 mb-3">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleLikeReview}
					className={isLiked ? "text-gray-900" : "text-gray-500"}
				>
					<ThumbsUp className="w-4 h-4 mr-1" />
					{formatNumber(likes)}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={handleDislikeReview}
					className={isDisliked ? "text-gray-900" : "text-gray-500"}
				>
					<ThumbsDown className="w-4 h-4 mr-1" />
					{formatNumber(dislikes)}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleReply(username, false)}
				>
					<MessageCircle className="w-4 h-4 mr-1" />
					{t("reply")}
				</Button>
			</div>
		);
	},
	(prevProps, nextProps) =>
		prevProps.isLiked === nextProps.isLiked &&
		prevProps.isDisliked === nextProps.isDisliked &&
		prevProps.likes === nextProps.likes &&
		prevProps.dislikes === nextProps.dislikes &&
		prevProps.username === nextProps.username,
);

export default ReviewActions;
