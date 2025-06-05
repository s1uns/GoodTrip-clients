import { Star } from "lucide-react";
import { useState } from "react";

interface StarsProps {
	rating: number;
	interactive?: boolean;
	onRatingChange?: (rating: number) => void;
}

export default function Stars({
	rating,
	interactive = false,
	onRatingChange,
}: StarsProps) {
	const [hoveredRating, setHoveredRating] = useState(0);

	const handleChangeRating = (star: number) =>
		interactive && onRatingChange && onRatingChange(star);

	const handleHoverStar = (star: number) =>
		interactive && setHoveredRating(star);

	const handleUnhoverStar = () => interactive && setHoveredRating(0);

	return (
		<div className="flex">
			{[1, 2, 3, 4, 5].map((star) => (
				<Star
					key={star}
					className={`w-5 h-5 ${
						star <= (hoveredRating || rating)
							? "text-gray-900 fill-current"
							: ""
					} ${interactive ? "cursor-pointer duration-100" : ""}`}
					onClick={() => handleChangeRating(star)}
					onMouseEnter={() => handleHoverStar(star)}
					onMouseLeave={handleUnhoverStar}
				/>
			))}
		</div>
	);
}
