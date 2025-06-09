import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import UserInfoTab from "../components/UserInfoTab";
import SubscriptionsTab from "../components/SubscriptionsTab";
import SecurityTab from "../components/SecurityTab";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
	const { t } = useTranslation();

	return (
		<div className="container mx-auto px-4 py-8">
			<Tabs defaultValue="profile" className="space-y-4">
				<TabsList>
					<TabsTrigger value="profile">{t("profile")}</TabsTrigger>
					<TabsTrigger value="subscriptions">
						{t("subscriptions")}
					</TabsTrigger>
					<TabsTrigger value="security">{t("security")}</TabsTrigger>
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
