import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Flag, MessageCircle } from "lucide-react";
import { Reply } from "@/shared/types/Reply";
import { ENTITY_REPLY } from "@/shared/constants/place";
import emptyPic from "@/assets/emptyPic.png";
import { convertDateToDDMonYYYY } from "@/shared/utils/helpers/convertDateToDDMonYYYY";
import { useTranslation } from "react-i18next";

interface ReplyItemProps {
	reply: Reply;
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

const ReplyItem = memo<ReplyItemProps>(
	({
		reply,
		editingReplyId,
		setEditingReplyId,
		editReplyText,
		setEditReplyText,
		handleSaveEditedReply,
		handleDeleteReply,
		handleEditReply,
		openReportDialog,
		handleReply,
	}) => {
		const { t, i18n } = useTranslation();
		return (
			<div className="flex items-start gap-3">
				<div className="flex-1">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<p className="font-medium text-sm">
								{reply.username}
							</p>
							<span className="text-xs text-muted-foreground">
								{convertDateToDDMonYYYY(
									reply.date,
									i18n.language,
								)}
							</span>
						</div>
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="w-8 h-8 p-0"
								>
									<MoreVertical className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{reply.isOwn && (
									<>
										<DropdownMenuItem
											onClick={() =>
												handleEditReply(
													reply.id,
													reply.text,
												)
											}
										>
											<Edit className="w-4 h-4 mr-2" />
											{t("reviewItem.edit")}
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												handleDeleteReply(reply.id)
											}
										>
											<Trash2 className="w-4 h-4 mr-2" />
											{t("reviewItem.delete")}
										</DropdownMenuItem>
									</>
								)}
								{!reply.isOwn && (
									<DropdownMenuItem
										onClick={() =>
											openReportDialog(
												reply.id,
												ENTITY_REPLY,
											)
										}
									>
										<Flag className="w-4 h-4 mr-2" />
										{t("reviewItem.report")}
									</DropdownMenuItem>
								)}
								<DropdownMenuItem
									onClick={() =>
										handleReply(reply.username, true)
									}
								>
									<MessageCircle className="w-4 h-4 mr-2" />
									{t("reviewItem.reply")}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					{editingReplyId === reply.id ? (
						<div className="space-y-2 mt-2">
							<Textarea
								value={editReplyText}
								onChange={(e) =>
									setEditReplyText(e.target.value)
								}
								rows={3}
								placeholder={t(
									"replyItem.editReplyPlaceholder",
								)}
							/>
							<div className="flex gap-2">
								<Button
									size="sm"
									onClick={handleSaveEditedReply}
								>
									{t("replyItem.saveButton")}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setEditingReplyId(null)}
								>
									{t("replyItem.cancelButton")}
								</Button>
							</div>
						</div>
					) : (
						<p className="text-sm">{reply.text}</p>
					)}
					{reply.images && reply.images.length > 0 && (
						<div className="flex gap-2 mt-2">
							{reply.images.map(
								(image: string, index: number) => (
									<img
										key={index}
										src={image || emptyPic}
										alt={t("replyItem.replyImageAlt", {
											number: index + 1,
										})}
										className="w-16 h-16 object-cover rounded"
									/>
								),
							)}
						</div>
					)}
				</div>
			</div>
		);
	},
);

export default ReplyItem;
