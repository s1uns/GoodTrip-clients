import { memo } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp, MessageCircle } from "lucide-react";

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
	}) => (
		<div className="flex items-center gap-4 mb-3">
			<Button
				variant="ghost"
				size="sm"
				onClick={handleLikeReview}
				className={isLiked ? "text-gray-900" : "text-gray-500"}
			>
				<ThumbsUp className="w-4 h-4 mr-1" />
				{likes}
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={handleDislikeReview}
				className={isDisliked ? "text-gray-900" : "text-gray-500"}
			>
				<ThumbsDown className="w-4 h-4 mr-1" />
				{dislikes}
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => handleReply(username, false)}
			>
				<MessageCircle className="w-4 h-4 mr-1" />
				Reply
			</Button>
		</div>
	),
	(prevProps, nextProps) =>
		prevProps.isLiked === nextProps.isLiked &&
		prevProps.isDisliked === nextProps.isDisliked &&
		prevProps.likes === nextProps.likes &&
		prevProps.dislikes === nextProps.dislikes &&
		prevProps.username === nextProps.username,
);

export default ReviewActions;
