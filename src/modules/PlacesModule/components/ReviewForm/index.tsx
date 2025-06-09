import { useState, useCallback, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus } from "lucide-react";
import emptyPic from "../../../../assets/emptyPic.png";
import { Stars } from "..";

interface ReviewFormProps {
	onSubmit: (rating: number, text: string, images: string[]) => Promise<void>;
	onCancel: () => void;
	isSubmitting: boolean;
	initialRating?: number;
	initialText?: string;
	initialImages?: string[];
}

const ReviewForm = ({
	onSubmit,
	onCancel,
	isSubmitting,
	initialRating = 5,
	initialText = "",
	initialImages = [],
}: ReviewFormProps) => {
	const { t } = useTranslation();
	const [rating, setRating] = useState(initialRating);
	const [text, setText] = useState(initialText);
	const [images, setImages] = useState<string[]>(initialImages);

	const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newImages: string[] = [];
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					newImages.push(reader.result as string);
					if (newImages.length === files.length) {
						setImages((prev) => [...prev, ...newImages]);
					}
				};
				reader.readAsDataURL(file);
			});
		}
	};

	const handleRemoveImage = (imageToRemove: string) => {
		setImages((prev) => prev.filter((image) => image !== imageToRemove));
	};

	const handleSubmit = async () => {
		await onSubmit(rating, text, images);
		if (!initialText && !initialImages.length) {
			setRating(5);
			setText("");
			setImages([]);
		}
	};

	const handleChangeText = useCallback(
		(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value),
		[],
	);

	const handleRatingChange = useCallback(
		(newRating: number) => setRating(newRating),
		[],
	);

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="text-lg">
					{t("reviewForm.title")}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<Label>{t("reviewForm.rating")}</Label>
					<Stars
						rating={rating}
						interactive
						onRatingChange={handleRatingChange}
					/>
				</div>
				<div>
					<Label htmlFor="review-text">
						{t("reviewForm.yourReview")}
					</Label>
					<Textarea
						style={{ marginTop: "10px" }}
						id="review-text"
						placeholder={t("reviewForm.placeholder")}
						value={text}
						onChange={handleChangeText}
						rows={4}
					/>
				</div>
				<div>
					<Label>{t("reviewForm.addPhotos")}</Label>
					<div className="flex flex-wrap gap-2 mt-2">
						{images.map((image, index) => (
							<div key={index} className="relative">
								<img
									src={image || emptyPic}
									alt={t("reviewForm.reviewImageAlt", {
										number: index + 1,
									})}
									className="w-20 h-20 object-cover rounded"
								/>
								<Button
									variant="outline"
									size="icon"
									className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex justify-center items-center border-gray-900"
									onClick={() => handleRemoveImage(image)}
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
								onChange={handleAddImage}
								multiple
							/>
							<div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
								<Plus className="w-8 h-8" />
							</div>
						</Label>
					</div>
				</div>
				<div className="flex gap-2">
					<Button onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting
							? t("reviewForm.submitting")
							: t("reviewForm.submitReview")}
					</Button>
					<Button variant="outline" onClick={onCancel}>
						{t("common.cancel")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default ReviewForm;
