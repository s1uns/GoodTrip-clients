import { memo, Dispatch, SetStateAction } from "react";
import { Reply } from "@/shared/types/Reply";
import { ReplyInput, ReplyList } from "..";

interface ReplySectionProps {
	reviewId: string;
	replies: Reply[];
	replyingTo: string | null;
	setReplyingTo: Dispatch<SetStateAction<string | null>>;
	replyText: string;
	setReplyText: (text: string) => void;
	handleSendReply: () => void;
	editingReplyId: string | null;
	setEditingReplyId: Dispatch<SetStateAction<string | null>>;
	editReplyText: string;
	setEditReplyText: (text: string) => void;
	handleSaveEditedReply: () => void;
	handleDeleteReply: (replyId: string) => void;
	handleEditReply: (replyId: string, currentText: string) => void;
	openReportDialog: (entityId: string, entityType: number) => void;
	handleReply: (targetUsername: string, isReplyToReply: boolean) => void;
}

const ReplySection = memo<ReplySectionProps>(
	({
		reviewId,
		replies,
		replyingTo,
		setReplyingTo,
		replyText,
		setReplyText,
		handleSendReply,
		editingReplyId,
		setEditingReplyId,
		editReplyText,
		setEditReplyText,
		handleSaveEditedReply,
		handleDeleteReply,
		handleEditReply,
		openReportDialog,
		handleReply,
	}) => (
		<>
			{replyingTo === reviewId && (
				<ReplyInput
					replyText={replyText}
					setReplyText={setReplyText}
					handleSendReply={handleSendReply}
					setReplyingTo={setReplyingTo}
				/>
			)}

			{replies.length > 0 && (
				<ReplyList
					replies={replies}
					editingReplyId={editingReplyId}
					setEditingReplyId={setEditingReplyId}
					editReplyText={editReplyText}
					setEditReplyText={setEditReplyText}
					handleSaveEditedReply={handleSaveEditedReply}
					handleDeleteReply={handleDeleteReply}
					handleEditReply={handleEditReply}
					openReportDialog={openReportDialog}
					handleReply={handleReply}
				/>
			)}
		</>
	),
	(prevProps, nextProps) =>
		prevProps.reviewId === nextProps.reviewId &&
		prevProps.replyingTo === nextProps.replyingTo &&
		prevProps.replyText === nextProps.replyText &&
		prevProps.editingReplyId === nextProps.editingReplyId &&
		prevProps.editReplyText === nextProps.editReplyText &&
		prevProps.replies.length === nextProps.replies.length &&
		prevProps.replies.every((prevReply, index) => {
			const nextReply = nextProps.replies[index];
			return (
				prevReply.id === nextReply.id &&
				prevReply.text === nextReply.text &&
				prevReply.date === nextReply.date &&
				prevReply.isOwn === nextReply.isOwn &&
				prevReply.images.length === nextReply.images.length &&
				prevReply.images.every((img, i) => img === nextReply.images[i])
			);
		}),
);

export default ReplySection;
