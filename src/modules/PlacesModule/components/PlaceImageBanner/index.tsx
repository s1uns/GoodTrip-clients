import { Button } from "@/components/ui/button";
import { Share2, Heart } from "lucide-react";
import emptyPic from "../../../../assets/emptyPic.png";

interface PlaceImageBannerProps {
	picture: string | undefined;
	name: string;
	isFavorite: boolean;
	onToggleFavorite: () => void;
	onShare: () => void;
}

const PlaceImageBanner = ({
	picture,
	name,
	isFavorite,
	onToggleFavorite,
	onShare,
}: PlaceImageBannerProps) => {
	return (
		<div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
			<img
				src={picture || emptyPic}
				alt={name}
				className="w-full h-full object-cover"
			/>
			<div className="absolute inset-0 bg-black/20" />
			<div className="absolute top-4 right-4 flex gap-2">
				<Button
					variant="secondary"
					size="icon"
					onClick={onToggleFavorite}
					className="bg-white/90 hover:bg-white"
				>
					<Heart
						className={`w-4 h-4 ${
							isFavorite ? "text-red-500 fill-current" : ""
						}`}
					/>
				</Button>
				<Button
					variant="secondary"
					size="icon"
					className="bg-white/90 hover:bg-white"
					onClick={onShare}
				>
					<Share2 className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
};

export default PlaceImageBanner;
