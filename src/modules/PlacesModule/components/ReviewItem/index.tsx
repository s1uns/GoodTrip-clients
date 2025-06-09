import React, {
	Dispatch,
	memo,
	SetStateAction,
	useCallback,
	useState,
} from "react";
import { Reply } from "@/shared/types/Reply";
import ReportModal from "../ReportModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ENTITY_REPLY, ENTITY_REVIEW } from "@/shared/constants/place";

import emptyPic from "@/assets/emptyPic.png";
import ReplySection from "../ReplySection";
import ReviewActions from "../ReviewActions";
import ReviewContent from "../ReviewContent";
import ReviewHeader from "../ReviewHeader";

interface ReviewProps {
	id: string;
	rating: number;
	date: string;
	isOwn: boolean;
	text: string;
	username: string;
	isEditing: boolean;
	isLiked: boolean;
	isDisliked: boolean;
	likes: number;
	dislikes: number;
	handleAddReply: (reply: Reply, reviewId: string) => void;
	deleteReview: (reviewId: string) => void;
	editReview: (
		editText: string,
		editRating: number,
		reviewId: string,
		editImages: string[],
	) => void;
	setEditingReview: Dispatch<SetStateAction<string | null>>;
	likeReview: (reviewId: string) => void;
	dislikeReview: (reviewId: string) => void;
	replies: Reply[];
	images: string[];
	editReply: (reviewId: string, replyId: string, editText: string) => void;
	deleteReply: (reviewId: string, replyId: string) => void;
}

const ReviewItem = memo<ReviewProps>(
	({
		id,
		rating,
		date,
		isOwn,
		text,
		username,
		isEditing,
		isLiked,
		isDisliked,
		likes,
		dislikes,
		handleAddReply,
		editReview,
		setEditingReview,
		likeReview,
		dislikeReview,
		deleteReview,
		replies,
		editReply,
		deleteReply,
		images,
	}: ReviewProps) => {
		const [editText, setEditText] = useState(text);
		const [editRating, setEditRating] = useState(rating);
		const [editImages, setEditImages] = useState<string[]>(images);
		const [replyText, setReplyText] = useState("");
		const [replyingTo, setReplyingTo] = useState<string | null>(null);
		const [editingReplyId, setEditingReplyId] = useState<string | null>(
			null,
		);
		const [editReplyText, setEditReplyText] = useState("");
		const [showReportDialog, setShowReportDialog] = useState(false);
		const [reportingEntityId, setReportingEntityId] = useState<string>("");
		const [reportingEntityType, setReportingEntityType] =
			useState<number>(ENTITY_REVIEW);

		const [isImageModalOpen, setIsImageModalOpen] = useState(false);
		const [selectedImage, setSelectedImage] = useState<string | null>(null);

		const handleReply = useCallback(
			(targetUsername: string, isReplyToReply: boolean) => {
				setReplyingTo(id);
				if (isReplyToReply) {
					setReplyText(`@${targetUsername}, `);
				} else {
					setReplyText("");
				}
			},
			[id],
		);

		const handleSendReply = useCallback(() => {
			if (!replyText.trim()) return;

			const newReply: Reply = {
				id: Math.random().toString(36).substr(2, 9),
				userId: "currentUser",
				username: "johndoe",
				date: new Date().toISOString().split("T")[0],
				text: replyText,
				isOwn: true,
				images: [],
			};

			handleAddReply(newReply, id);

			setReplyText("");
			setReplyingTo(null);
		}, [replyText, id, handleAddReply]);

		const handleEditReview = useCallback(() => {
			editReview(editText, editRating, id, editImages);
			setEditingReview(null);
		}, [
			editText,
			editRating,
			id,
			editReview,
			setEditingReview,
			editImages,
		]);

		const handleLikeReview = useCallback(
			() => likeReview(id),
			[id, likeReview],
		);
		const handleDislikeReview = useCallback(
			() => dislikeReview(id),
			[id, dislikeReview],
		);

		const handleEditReply = useCallback(
			(replyId: string, currentText: string) => {
				setEditingReplyId(replyId);
				setEditReplyText(currentText);
			},
			[],
		);

		const handleSaveEditedReply = useCallback(() => {
			if (editingReplyId && editReplyText.trim()) {
				editReply(id, editingReplyId, editReplyText);
				setEditingReplyId(null);
				setEditReplyText("");
			}
		}, [editingReplyId, editReplyText, id, editReply]);

		const handleDeleteReply = useCallback(
			(replyId: string) => {
				deleteReply(id, replyId);
			},
			[id, deleteReply],
		);

		const openReportDialog = useCallback(
			(entityId: string, entityType: number) => {
				setReportingEntityId(entityId);
				setReportingEntityType(entityType);
				setShowReportDialog(true);
			},
			[],
		);

		const openImageModal = (imageSrc: string) => {
			setSelectedImage(imageSrc);
			setIsImageModalOpen(true);
		};

		return (
			<div key={id} className="border rounded-lg p-4">
				<ReviewHeader
					id={id}
					username={username}
					rating={rating}
					date={date}
					isOwn={isOwn}
					setEditingReview={setEditingReview}
					deleteReview={deleteReview}
					openReportDialog={openReportDialog}
					text={text}
					images={images}
				/>

				<ReviewContent
					text={text}
					images={images}
					isEditing={isEditing}
					editText={editText}
					setEditText={setEditText}
					editRating={editRating}
					setEditRating={setEditRating}
					editImages={editImages}
					setEditImages={setEditImages}
					handleEditReview={handleEditReview}
					setEditingReview={setEditingReview}
					openImageModal={openImageModal}
				/>

				{!isEditing && (
					<>
						<ReviewActions
							isLiked={isLiked}
							isDisliked={isDisliked}
							likes={likes}
							dislikes={dislikes}
							handleLikeReview={handleLikeReview}
							handleDislikeReview={handleDislikeReview}
							handleReply={handleReply}
							username={username}
						/>

						<ReplySection
							reviewId={id}
							replies={replies}
							replyingTo={replyingTo}
							setReplyingTo={setReplyingTo}
							replyText={replyText}
							setReplyText={setReplyText}
							handleSendReply={handleSendReply}
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
					</>
				)}

				{showReportDialog ? (
					<ReportModal
						open={showReportDialog}
						entityId={reportingEntityId}
						entityType={reportingEntityType}
						setShowReportDialog={setShowReportDialog}
					/>
				) : null}

				{isImageModalOpen ? (
					<Dialog
						open={isImageModalOpen}
						onOpenChange={setIsImageModalOpen}
					>
						<DialogContent className="max-w-3xl h-[80vh] flex items-center justify-center">
							{selectedImage && (
								<img
									src={selectedImage || emptyPic}
									alt="Full size review image"
									className="max-w-full max-h-full object-contain"
								/>
							)}
						</DialogContent>
					</Dialog>
				) : null}
			</div>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.id === nextProps.id &&
			prevProps.rating === nextProps.rating &&
			prevProps.text === nextProps.text &&
			prevProps.isEditing === nextProps.isEditing &&
			prevProps.isLiked === nextProps.isLiked &&
			prevProps.isDisliked === nextProps.isDisliked &&
			prevProps.likes === nextProps.likes &&
			prevProps.dislikes === nextProps.dislikes &&
			prevProps.images.length === nextProps.images.length &&
			prevProps.images.every((img, i) => img === nextProps.images[i]) &&
			prevProps.replies.length === nextProps.replies.length &&
			prevProps.replies.every((prevReply, index) => {
				const nextReply = nextProps.replies[index];
				return (
					prevReply.id === nextReply.id &&
					prevReply.text === nextReply.text &&
					prevReply.date === nextReply.date &&
					prevReply.isOwn === nextReply.isOwn &&
					prevReply.images.length === nextReply.images.length &&
					prevReply.images.every(
						(img, i) => img === nextReply.images[i],
					)
				);
			})
		);
	},
);

export default ReviewItem;
