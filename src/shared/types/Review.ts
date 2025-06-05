import { Reply } from "./Reply";

export type Review = {
	id: string;
	userId: string;
	username: string;
	text: string;
	date: string;
	rating: number;
	isLiked: boolean;
	isDisliked: boolean;
	likes: number;
	dislikes: number;
	isOwn: boolean;
	images: any[];
	replies: Reply[];
};
