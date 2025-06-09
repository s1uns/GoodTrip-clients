import { memo } from "react";
import { Reply } from "@/shared/types/Reply";
import ReplyItem from "../ReplyItem";

interface ReplyListProps {
	replies: Reply[];
	editingReplyId: string | null;
	setEditingReplyId: (id: string | null) => void;
	editReplyText: string;
	setEditReplyText: (text: string) => void;
	handleSaveEditedReply: () => void;
	handleDeleteReply: (replyId: string) => void;
	handleEditReply: (replyId: string, currentText: string) => void;
	openReportDialog: (entityId: string, entityType: number) => void;
	handleReply: (targetUsername: string, isReplyToReply: boolean) => void;
}

const ReplyList = memo<ReplyListProps>(
	({
		replies,
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
		<div className="ml-6 space-y-3 border-l-2 border-muted pl-4">
			{replies.map((reply) => (
				<ReplyItem
					key={reply.id}
					reply={reply}
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
			))}
		</div>
	),
);

export default ReplyList;
