import React, { memo, useCallback, Dispatch, SetStateAction, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";
import Stars from "../Stars";
import emptyPic from "@/assets/emptyPic.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import { useTranslation } from "react-i18next";

interface ReviewContentProps {
	text: string;
	images: string[];
	isEditing: boolean;
	editText: string;
	setEditText: (text: string) => void;
	editRating: number;
	setEditRating: (rating: number) => void;
	editImages: string[];
	setEditImages: Dispatch<SetStateAction<string[]>>;
	handleEditReview: () => void;
	setEditingReview: Dispatch<SetStateAction<string | null>>;
	openImageModal: (imageSrc: string) => void;
}

const ReviewContent = memo<ReviewContentProps>(
	({
		text,
		images,
		isEditing,
		editText,
		setEditText,
		editRating,
		setEditRating,
		editImages,
		setEditImages,
		handleEditReview,
		setEditingReview,
		openImageModal,
	}) => {
		const { t } = useTranslation();

		const handleAddImageToReview = useCallback(
			(e: ChangeEvent<HTMLInputElement>) => {
				const files = e.target.files;
				if (files) {
					const newImages: string[] = [];
					Array.from(files).forEach((file) => {
						const reader = new FileReader();
						reader.onloadend = () => {
							newImages.push(reader.result as string);
							if (newImages.length === files.length) {
								setEditImages((prev) => [
									...prev,
									...newImages,
								]);
							}
						};
						reader.readAsDataURL(file);
					});
				}
			},
			[setEditImages],
		);

		const handleRemoveImageFromReview = useCallback(
			(imageToRemove: string) => {
				setEditImages((prev) =>
					prev.filter((image) => image !== imageToRemove),
				);
			},
			[setEditImages],
		);

		return isEditing ? (
			<div className="space-y-4">
				<div>
					<Label htmlFor="edit-rating">
						{t("reviewContent.ratingLabel")}
					</Label>
					<Stars
						rating={editRating}
						interactive
						onRatingChange={setEditRating}
					/>
				</div>
				<Textarea
					id="edit-text"
					value={editText}
					onChange={(e) => setEditText(e.target.value)}
					rows={3}
					placeholder={t("reviewContent.editReviewPlaceholder")}
				/>
				<div>
					<Label>{t("reviewContent.imagesLabel")}</Label>
					<div className="flex flex-wrap gap-2 mt-2">
						{editImages.map((image, index) => (
							<div key={index} className="relative">
								<img
									src={image || emptyPic}
									alt={t("reviewContent.reviewImageAlt", {
										number: index + 1,
									})}
									className="w-20 h-20 object-cover rounded"
								/>
								<Button
									variant="outline"
									size="icon"
									className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex justify-center items-center border-gray-900"
									onClick={() =>
										handleRemoveImageFromReview(image)
									}
								>
									<Minus className="h-3 w-3 text-black" />
								</Button>
							</div>
						))}
						<Label
							htmlFor="add-image-review"
							className="cursor-pointer"
						>
							<Input
								id="add-image-review"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleAddImageToReview}
								multiple
							/>
							<div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
								<Plus className="w-8 h-8" />
							</div>
						</Label>
					</div>
				</div>
				<div className="flex gap-2">
					<Button size="sm" onClick={handleEditReview}>
						{t("reviewContent.saveButton")}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setEditingReview(null)}
					>
						{t("reviewContent.cancelButton")}
					</Button>
				</div>
			</div>
		) : (
			<>
				<p className="mb-3">{text}</p>
				{images.length > 0 && (
					<div className="relative w-full h-64 mb-3 rounded-lg overflow-hidden">
						<Swiper
							modules={[Navigation, Pagination, Zoom]}
							slidesPerView={2}
							navigation={true}
							pagination={{ clickable: true }}
							zoom={true}
							className="w-full h-full "
						>
							{images.map((image, index) => (
								<SwiperSlide key={index}>
									<div className="swiper-zoom-container">
										<img
											src={image || emptyPic}
											alt={t(
												"reviewContent.reviewImageAlt",
												{
													number: index + 1,
												},
											)}
											className="w-full h-full object-cover cursor-pointer"
											onClick={() =>
												openImageModal(image)
											}
										/>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				)}
			</>
		);
	},
	(prevProps, nextProps) =>
		prevProps.text === nextProps.text &&
		prevProps.images.length === nextProps.images.length &&
		prevProps.images.every((img, i) => img === nextProps.images[i]) &&
		prevProps.isEditing === nextProps.isEditing &&
		prevProps.editText === nextProps.editText &&
		prevProps.editRating === nextProps.editRating &&
		prevProps.editImages.length === nextProps.editImages.length &&
		prevProps.editImages.every((img, i) => img === nextProps.editImages[i]),
);

export default ReviewContent;
