export type Place = {
	id: number;
	name: string;
	city: string;
	image: string;
	travelTags: string[];
	travelCategories: string[];
	rating: number;
	coordinates: {
		lat: number;
		lng: number;
	};
};
