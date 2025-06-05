import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import { Edit, Save, Star } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { convertDateToDDMonYYYY } from "@/shared/utils/helpers/convertDateToDDMonYYYY";

const travelPreferencesOptions = [
	{ label: "Adventure", value: "adventure" },
	{ label: "Culture", value: "culture" },
	{ label: "Food & Cuisine", value: "food" },
	{ label: "Nature", value: "nature" },
	{ label: "Photography", value: "photography" },
	{ label: "History", value: "history" },
	{ label: "Relaxation", value: "relaxation" },
	{ label: "Nightlife", value: "nightlife" },
	{ label: "Shopping", value: "shopping" },
	{ label: "Sports", value: "sports" },
];

const travelCategoriesOptions = [
	{ label: "Beach", value: "beach" },
	{ label: "Mountain", value: "mountain" },
	{ label: "City", value: "city" },
	{ label: "Countryside", value: "countryside" },
	{ label: "Historical Sites", value: "historical" },
	{ label: "National Parks", value: "parks" },
	{ label: "Islands", value: "islands" },
	{ label: "Desert", value: "desert" },
	{ label: "Forest", value: "forest" },
	{ label: "Lakes", value: "lakes" },
];

export default function UserInfoTab() {
	const [isEditing, setIsEditing] = useState(false);
	const user = useUserStore((state: any) => state.user);
	const [firstName, setFirstName] = useState(user?.firstName || "");
	const [lastName, setLastName] = useState(user?.lastName || "");
	const [email, setEmail] = useState(user?.email || "");
	const [bio, setBio] = useState(user?.bio || "");
	const [selectedTravelPreferences, setSelectedTravelPreferences] = useState<
		string[]
	>([]);
	const [selectedTravelCategories, setSelectedTravelCategories] = useState<
		string[]
	>([]);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = () => {
		setIsEditing(false);
		console.log("Saving profile data:", {
			firstName,
			lastName,
			email,
			bio,
			travelPreferences: selectedTravelPreferences,
			travelCategories: selectedTravelCategories,
		});
	};
	return (
		<Card>
			<CardHeader>
				<div className="flex justify-between items-center">
					<CardTitle>Profile Information</CardTitle>
					<Button
						onClick={isEditing ? handleSave : handleEdit}
						variant="outline"
					>
						{isEditing ? (
							<Save className="mr-2 h-4 w-4" />
						) : (
							<Edit className="mr-2 h-4 w-4" />
						)}
						{isEditing ? "Save" : "Edit"}
					</Button>
				</div>
				<CardDescription>
					Manage your profile information
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="firstName">First Name</Label>
						<Input
							id="firstName"
							name="firstName"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							disabled={!isEditing}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="lastName">Last Name</Label>
						<Input
							id="lastName"
							name="lastName"
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							disabled={!isEditing}
						/>
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={!isEditing}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="bio">Bio</Label>
					<Textarea
						id="bio"
						name="bio"
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						disabled={!isEditing}
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="travelPreferences">
						Travel Preferences
					</Label>
					<MultiSelect
						options={travelPreferencesOptions}
						selected={selectedTravelPreferences}
						onChange={setSelectedTravelPreferences}
						placeholder="Select your travel preferences..."
						disabled={!isEditing}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="travelCategories">Travel Categories</Label>
					<MultiSelect
						options={travelCategoriesOptions}
						selected={selectedTravelCategories}
						onChange={setSelectedTravelCategories}
						placeholder="Select your preferred travel categories..."
						disabled={!isEditing}
					/>
				</div>
			</CardContent>
			<CardFooter className="flex flex-row justify-between">
				<div className="flex space-x-4">
					<div className="flex items-center">
						<Star className="mr-2 h-5 w-5 text-muted-foreground" />
						<span>{user.rating} User Rating</span>
					</div>
					<div className="flex items-center">
						<Edit className="mr-2 h-5 w-5 text-muted-foreground" />
						<span>{user.reviewsCount} Reviews Written</span>
					</div>
				</div>
				<div className="text-muted-foreground self-end">
					Joined on {convertDateToDDMonYYYY(user.joinDate)}
				</div>
			</CardFooter>
		</Card>
	);
}
