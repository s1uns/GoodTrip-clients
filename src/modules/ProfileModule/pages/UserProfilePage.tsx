import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import UserInfoTab from "../components/UserInfoTab";
import SubscriptionsTab from "../components/SubscriptionsTab";
import SecurityTab from "../components/SecurityTab";

export default function ProfilePage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<Tabs defaultValue="profile" className="space-y-4">
				<TabsList>
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="subscriptions">
						Subscriptions
					</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<UserInfoTab />
				</TabsContent>

				<TabsContent value="subscriptions">
					<SubscriptionsTab />
				</TabsContent>

				<TabsContent value="security">
					<SecurityTab />
				</TabsContent>
			</Tabs>
		</div>
	);
}
