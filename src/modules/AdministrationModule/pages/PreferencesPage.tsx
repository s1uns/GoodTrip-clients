import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Trash2,
	Plus,
	Loader2,
	Search,
	Settings,
	Tag,
	FolderOpen,
	Edit,
	Save,
	X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import useDebounce from "@/shared/utils/hooks/useDebounce";
import {
	showErrorToast,
	showSuccessToast,
} from "@/shared/utils/helpers/showToast";
import { TravelCategory } from "@/shared/types/TravelCategory";
import { TravelTag } from "@/shared/types/TravelTag";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

const mockCategories: TravelCategory[] = [
	{ categoryId: "1", name: "Tropical Beaches" },
	{ categoryId: "2", name: "Mountain Ranges" },
	{ categoryId: "3", name: "Metropolitan Cities" },
	{ categoryId: "4", name: "Rural Countryside" },
	{ categoryId: "5", name: "Ancient Ruins" },
	{ categoryId: "6", name: "National Parks" },
	{ categoryId: "7", name: "Private Islands" },
	{ categoryId: "8", name: "Desert Landscapes" },
	{ categoryId: "9", name: "Rainforests" },
	{ categoryId: "10", name: "Alpine Lakes" },
	{ categoryId: "11", name: "Coastal Towns" },
	{ categoryId: "12", name: "Wine Regions" },
	{ categoryId: "13", name: "Ski Resorts" },
	{ categoryId: "14", name: "Safari Destinations" },
	{ categoryId: "15", name: "Volcanic Areas" },
];

const mockTags: TravelTag[] = [
	{ tagId: "1", name: "Adventure Sports" },
	{ tagId: "2", name: "Cultural Immersion" },
	{ tagId: "3", name: "Food & Cuisine" },
	{ tagId: "4", name: "Photography" },
	{ tagId: "5", name: "Historical Sites" },
	{ tagId: "6", name: "Nature & Wildlife" },
	{ tagId: "7", name: "Relaxation & Wellness" },
	{ tagId: "8", name: "Nightlife & Entertainment" },
	{ tagId: "9", name: "Shopping & Markets" },
	{ tagId: "10", name: "Art & Museums" },
	{ tagId: "11", name: "Music & Festivals" },
	{ tagId: "12", name: "Architecture" },
	{ tagId: "13", name: "Local Transportation" },
	{ tagId: "14", name: "Street Food" },
	{ tagId: "15", name: "Luxury Travel" },
	{ tagId: "16", name: "Budget Travel" },
	{ tagId: "17", name: "Solo Travel" },
	{ tagId: "18", name: "Family Travel" },
	{ tagId: "19", name: "Eco Tourism" },
	{ tagId: "20", name: "Volunteer Travel" },
];

const ITEMS_PER_PAGE = 8;

const simulateApiCall = <T,>(
	items: T[],
	page: number,
	pageSize: number,
	searchQuery: string,
	searchFields: (keyof T)[],
	delay = 800,
): Promise<{
	items: T[];
	hasMore: boolean;
	total: number;
}> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			let filtered = items;
			if (searchQuery) {
				filtered = items.filter((item) =>
					searchFields.some((field) => {
						const value = item[field];
						return (
							typeof value === "string" &&
							value
								.toLowerCase()
								.includes(searchQuery.toLowerCase())
						);
					}),
				);
			}

			const startIndex = (page - 1) * pageSize;
			const endIndex = startIndex + pageSize;
			const paginatedItems = filtered.slice(startIndex, endIndex);
			const hasMore = endIndex < filtered.length;

			resolve({
				items: paginatedItems,
				hasMore,
				total: filtered.length,
			});
		}, delay);
	});
};

export default function AdminPreferencesPage() {
	const [categories, setCategories] = useState<TravelCategory[]>([]);
	const [categoriesLoading, setCategoriesLoading] = useState(true);
	const [categoriesLoadingMore, setCategoriesLoadingMore] = useState(false);
	const [categoriesPage, setCategoriesPage] = useState(1);
	const [categoriesHasMore, setCategoriesHasMore] = useState(true);
	const [categoriesTotalCount, setCategoriesTotalCount] = useState(0);
	const [categoriesSearch, setCategoriesSearch] = useState("");

	const [tags, setTags] = useState<TravelTag[]>([]);
	const [tagsLoading, setTagsLoading] = useState(true);
	const [tagsLoadingMore, setTagsLoadingMore] = useState(false);
	const [tagsPage, setTagsPage] = useState(1);
	const [tagsHasMore, setTagsHasMore] = useState(true);
	const [tagsTotalCount, setTagsTotalCount] = useState(0);
	const [tagsSearch, setTagsSearch] = useState("");
	const debouncedCategorySearch = useDebounce(categoriesSearch);
	const debouncedTagSearch = useDebounce(tagsSearch);

	const [categoryToDelete, setCategoryToDelete] =
		useState<TravelCategory | null>(null);
	const [tagToDelete, setTagToDelete] = useState<TravelTag | null>(null);
	const [deleting, setDeleting] = useState(false);

	const [newCategoryName, setNewCategoryName] = useState("");
	const [newTagName, setNewTagName] = useState("");
	const [addingCategory, setAddingCategory] = useState(false);
	const [addingTag, setAddingTag] = useState(false);

	const [editingCategory, setEditingCategory] = useState<string | null>(null);
	const [editingTag, setEditingTag] = useState<string | null>(null);
	const [editCategoryName, setEditCategoryName] = useState("");
	const [editTagName, setEditTagName] = useState("");
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState("categories");
	const [updatingCategory, setUpdatingCategory] = useState(false);
	const [updatingTag, setUpdatingTag] = useState(false);

	useEffect(() => {
		loadCategories(true);
		loadTags(true);
	}, []);

	useEffect(() => {
		setCategories([]);
		setCategoriesPage(1);
		setCategoriesHasMore(true);
		loadCategories(true);
	}, [debouncedCategorySearch]);

	useEffect(() => {
		setTags([]);
		setTagsPage(1);
		setTagsHasMore(true);
		loadTags(true);
	}, [debouncedTagSearch]);

	const handleOpenDeleteCategoryModal = (category: TravelCategory) =>
		setCategoryToDelete(category);
	const handleCloseDeleteCategoryModal = () => setCategoryToDelete(null);

	const handleOpenDeleteTagModal = (tag: TravelTag) => setTagToDelete(tag);
	const handleCloseDeleteTagModal = () => setTagToDelete(null);

	const loadCategories = async (isInitial = false) => {
		if (isInitial) {
			setCategoriesLoading(true);
		} else {
			setCategoriesLoadingMore(true);
		}

		try {
			const response = await simulateApiCall(
				mockCategories,
				isInitial ? 1 : categoriesPage,
				ITEMS_PER_PAGE,
				categoriesSearch,
				["name"],
			);

			if (isInitial) {
				setCategories(response.items);
				setCategoriesPage(2);
			} else {
				setCategories((prev) => [...prev, ...response.items]);
				setCategoriesPage((prev) => prev + 1);
			}

			setCategoriesHasMore(response.hasMore);
			setCategoriesTotalCount(response.total);
		} catch (error) {
			console.error("Error loading categories:", error);
		} finally {
			setCategoriesLoading(false);
			setCategoriesLoadingMore(false);
		}
	};

	const loadTags = async (isInitial = false) => {
		if (isInitial) {
			setTagsLoading(true);
		} else {
			setTagsLoadingMore(true);
		}

		try {
			const response = await simulateApiCall(
				mockTags,
				isInitial ? 1 : tagsPage,
				ITEMS_PER_PAGE,
				tagsSearch,
				["name"],
			);

			if (isInitial) {
				setTags(response.items);
				setTagsPage(2);
			} else {
				setTags((prev) => [...prev, ...response.items]);
				setTagsPage((prev) => prev + 1);
			}

			setTagsHasMore(response.hasMore);
			setTagsTotalCount(response.total);
		} catch (error) {
			console.error("Error loading tags:", error);
		} finally {
			setTagsLoading(false);
			setTagsLoadingMore(false);
		}
	};

	const handleAddCategory = async () => {
		if (!newCategoryName.trim()) return;

		setAddingCategory(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const newCategory: TravelCategory = {
				categoryId: Date.now().toString(),
				name: newCategoryName.trim(),
			};

			mockCategories.unshift(newCategory);

			if (
				!categoriesSearch ||
				newCategory.name
					.toLowerCase()
					.includes(categoriesSearch.toLowerCase())
			) {
				setCategories((prev) => [newCategory, ...prev]);
				setCategoriesTotalCount((prev) => prev + 1);
			}
			showSuccessToast(t("toasts.travelCategoryCreated"));
			setNewCategoryName("");
		} catch (error) {
			showErrorToast(t("toasts.somethingWentWrong"));
		} finally {
			setAddingCategory(false);
		}
	};

	const handleAddTag = async () => {
		if (!newTagName.trim()) return;

		setAddingTag(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const newTag: TravelTag = {
				tagId: Date.now().toString(),
				name: newTagName.trim(),
			};

			mockTags.unshift(newTag);

			if (
				!tagsSearch ||
				newTag.name.toLowerCase().includes(tagsSearch.toLowerCase())
			) {
				setTags((prev) => [newTag, ...prev]);
				setTagsTotalCount((prev) => prev + 1);
			}
			showSuccessToast(t("toasts.tagCreated"));
			setNewTagName("");
		} catch (error) {
			showErrorToast(t("toasts.somethingWentWrong"));
		} finally {
			setAddingTag(false);
		}
	};

	const handleDeleteCategory = async () => {
		try {
			setDeleting(true);

			await new Promise((resolve) => setTimeout(resolve, 500));

			const index = mockCategories.findIndex(
				(c) => c.categoryId === categoryToDelete?.categoryId,
			);
			if (index !== -1) {
				mockCategories.splice(index, 1);
			}

			setCategories((prev) =>
				prev.filter(
					(c) => c.categoryId !== categoryToDelete?.categoryId,
				),
			);
			setCategoriesTotalCount((prev) => prev - 1);
			handleCloseDeleteCategoryModal();
			showSuccessToast(t("toasts.categoryDeleted"));
		} catch (error) {
			showErrorToast(t("toasts.somethingWentWrong"));
		} finally {
			setDeleting(false);
		}
	};

	const handleDeleteTag = async () => {
		try {
			setDeleting(true);
			await new Promise((resolve) => setTimeout(resolve, 500));

			const index = mockTags.findIndex(
				(t) => t.tagId === tagToDelete?.tagId,
			);
			if (index !== -1) {
				mockTags.splice(index, 1);
			}

			setTags((prev) =>
				prev.filter((t) => t.tagId !== tagToDelete?.tagId),
			);
			setTagsTotalCount((prev) => prev - 1);
			handleCloseDeleteTagModal();
			showSuccessToast(t("toasts.tagDeleted"));
		} catch (error) {
			showErrorToast(t("toasts.somethingWentWrong"));
		} finally {
			setDeleting(false);
		}
	};

	const startEditCategory = (category: TravelCategory) => {
		setEditingCategory(category.categoryId);
		setEditCategoryName(category.name);
	};

	const saveEditCategory = async () => {
		if (!editCategoryName.trim()) return;

		try {
			setUpdatingCategory(true);
			await new Promise((resolve) => setTimeout(resolve, 500));

			const index = mockCategories.findIndex(
				(c) => c.categoryId === editingCategory,
			);
			if (index !== -1) {
				mockCategories[index] = {
					...mockCategories[index],
					name: editCategoryName.trim(),
				};
			}

			setCategories((prev) =>
				prev.map((c) =>
					c.categoryId === editingCategory
						? { ...c, name: editCategoryName.trim() }
						: c,
				),
			);

			showSuccessToast(t("toasts.travelCategoryUpdated"));
			setEditingCategory(null);
		} catch (error) {
			showErrorToast(t("toasts.somethingWentWrong"));
		} finally {
			setUpdatingCategory(false);
		}
	};

	const startEditTag = (tag: TravelTag) => {
		setEditingTag(tag.tagId);
		setEditTagName(tag.name);
	};

	const saveEditTag = async () => {
		if (!editTagName.trim()) return;

		try {
			setUpdatingTag(true);

			await new Promise((resolve) => setTimeout(resolve, 500));

			const index = mockTags.findIndex((t) => t.tagId === editingTag);
			if (index !== -1) {
				mockTags[index] = {
					...mockTags[index],
					name: editTagName.trim(),
				};
			}

			setTags((prev) =>
				prev.map((t) =>
					t.tagId === editingTag
						? { ...t, name: editTagName.trim() }
						: t,
				),
			);

			showSuccessToast(t("toasts.tagUpdated"));
			setEditingTag(null);
		} catch (error) {
			showErrorToast(t("toasts.somethingWentWrong"));
		} finally {
			setUpdatingTag(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<h1 className="text-3xl font-bold flex items-center gap-2">
					<Settings className="w-8 h-8" />
					{t("travelPreferences.title")}
				</h1>
				<p className="text-muted-foreground mt-1">
					{t("travelPreferences.description")}
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="mb-6">
					<TabsTrigger
						value="categories"
						className="flex items-center gap-2"
					>
						<FolderOpen className="w-4 h-4" />
						{t("travelPreferences.categoriesTab", {
							count: categoriesTotalCount,
						})}
					</TabsTrigger>
					<TabsTrigger
						value="tags"
						className="flex items-center gap-2"
					>
						<Tag className="w-4 h-4" />
						{t("travelPreferences.tagsTab", {
							count: tagsTotalCount,
						})}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="categories">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Plus className="w-5 h-5" />
									{t("categories.addNewCategoryTitle")}
								</CardTitle>
								<CardDescription>
									{t("categories.addNewCategoryDescription")}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="new-category-name">
										{t("categories.categoryNameLabel")}
									</Label>
									<Input
										id="new-category-name"
										placeholder={t(
											"categories.categoryNamePlaceholder",
										)}
										value={newCategoryName}
										onChange={(e) =>
											setNewCategoryName(e.target.value)
										}
									/>
								</div>
								<Button
									onClick={handleAddCategory}
									disabled={
										!newCategoryName.trim() ||
										addingCategory
									}
									className="w-full"
								>
									{addingCategory ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											{t("common.adding")}
										</>
									) : (
										<>
											<Plus className="w-4 h-4 mr-2" />
											{t("categories.addCategoryButton")}
										</>
									)}
								</Button>
							</CardContent>
						</Card>

						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle>
									{t("categories.categoriesListTitle")}
								</CardTitle>
								<CardDescription>
									{t("categories.categoriesListDescription")}
								</CardDescription>
								<div className="relative">
									<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder={t(
											"categories.searchCategoriesPlaceholder",
										)}
										value={categoriesSearch}
										onChange={(e) =>
											setCategoriesSearch(e.target.value)
										}
										className="pl-8"
									/>
								</div>
							</CardHeader>
							<CardContent>
								{categoriesLoading ? (
									<div className="flex items-center justify-center py-8">
										<Loader2 className="h-6 w-6 animate-spin mr-2" />
										<span>
											{t("categories.loadingCategories")}
										</span>
									</div>
								) : categories.length === 0 ? (
									<div className="text-center py-8">
										<FolderOpen className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
										<p className="text-muted-foreground">
											{t("categories.noCategoriesFound")}
										</p>
									</div>
								) : (
									<>
										<div className="space-y-3">
											{categories.map((category) => (
												<div
													key={category.categoryId}
													className="flex items-center justify-between p-3 border rounded-lg"
												>
													{editingCategory ===
													category.categoryId ? (
														<div className="flex-1 space-y-2 mr-4">
															<Input
																value={
																	editCategoryName
																}
																onChange={(e) =>
																	setEditCategoryName(
																		e.target
																			.value,
																	)
																}
																placeholder={t(
																	"categories.categoryNamePlaceholder",
																)}
															/>
															<div className="flex gap-2">
																<Button
																	size="sm"
																	onClick={
																		saveEditCategory
																	}
																	disabled={
																		updatingCategory
																	}
																>
																	{updatingCategory ? (
																		<>
																			<Loader2 className="w-4 h-4 mr-2 animate-spin" />
																			{t(
																				"common.saving",
																			)}
																		</>
																	) : (
																		<>
																			<Save className="w-4 h-4 mr-1" />
																			{t(
																				"common.save",
																			)}
																		</>
																	)}
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		setEditingCategory(
																			null,
																		)
																	}
																>
																	<X className="w-4 h-4 mr-1" />
																	{t(
																		"common.cancel",
																	)}
																</Button>
															</div>
														</div>
													) : (
														<>
															<div className="flex-1">
																<h3 className="font-semibold">
																	{
																		category.name
																	}
																</h3>
															</div>
															<div className="flex gap-2">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		startEditCategory(
																			category,
																		)
																	}
																>
																	<Edit className="w-4 h-4" />
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		handleOpenDeleteCategoryModal(
																			category,
																		)
																	}
																>
																	<Trash2 className="w-4 h-4" />
																</Button>
															</div>
														</>
													)}
												</div>
											))}
										</div>

										{categoriesHasMore && (
											<div className="flex justify-center mt-6">
												<Button
													onClick={() =>
														loadCategories(false)
													}
													disabled={
														categoriesLoadingMore
													}
													variant="outline"
												>
													{categoriesLoadingMore ? (
														<>
															<Loader2 className="w-4 h-4 mr-2 animate-spin" />
															{t(
																"common.loading",
															)}
														</>
													) : (
														t("common.loadMore", {
															current:
																categories.length,
														})
													)}
												</Button>
											</div>
										)}
									</>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="tags">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Plus className="w-5 h-5" />
									{t("tags.addNewTagTitle")}
								</CardTitle>
								<CardDescription>
									{t("tags.addNewTagDescription")}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="new-tag-name">
										{t("tags.tagNameLabel")}
									</Label>
									<Input
										id="new-tag-name"
										placeholder={t(
											"tags.tagNamePlaceholder",
										)}
										value={newTagName}
										onChange={(e) =>
											setNewTagName(e.target.value)
										}
									/>
								</div>
								<Button
									onClick={handleAddTag}
									disabled={!newTagName.trim() || addingTag}
									className="w-full"
								>
									{addingTag ? (
										<>
											<Loader2 className="w-4 h-4 mr-2 animate-spin" />
											{t("common.adding")}
										</>
									) : (
										<>
											<Plus className="w-4 h-4 mr-2" />
											{t("tags.addTagButton")}
										</>
									)}
								</Button>
							</CardContent>
						</Card>

						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle>{t("tags.tagsListTitle")}</CardTitle>
								<CardDescription>
									{t("tags.tagsListDescription")}
								</CardDescription>
								<div className="relative">
									<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder={t(
											"tags.searchTagsPlaceholder",
										)}
										value={tagsSearch}
										onChange={(e) =>
											setTagsSearch(e.target.value)
										}
										className="pl-8"
									/>
								</div>
							</CardHeader>
							<CardContent>
								{tagsLoading ? (
									<div className="flex items-center justify-center py-8">
										<Loader2 className="h-6 w-6 animate-spin mr-2" />
										<span>{t("tags.loadingTags")}</span>
									</div>
								) : tags.length === 0 ? (
									<div className="text-center py-8">
										<Tag className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
										<p className="text-muted-foreground">
											{t("tags.noTagsFound")}
										</p>
									</div>
								) : (
									<>
										<div className="space-y-3">
											{tags.map((tag) => (
												<div
													key={tag.tagId}
													className="flex items-center justify-between p-3 border rounded-lg"
												>
													{editingTag ===
													tag.tagId ? (
														<div className="flex-1 space-y-2 mr-4">
															<Input
																value={
																	editTagName
																}
																onChange={(e) =>
																	setEditTagName(
																		e.target
																			.value,
																	)
																}
																placeholder={t(
																	"tags.tagNamePlaceholder",
																)}
															/>
															<div className="flex gap-2">
																<Button
																	size="sm"
																	onClick={
																		saveEditTag
																	}
																	disabled={
																		updatingTag
																	}
																>
																	{updatingTag ? (
																		<>
																			<Loader2 className="w-4 h-4 mr-2 animate-spin" />
																			{t(
																				"common.saving",
																			)}
																		</>
																	) : (
																		<>
																			<Save className="w-4 h-4 mr-1" />
																			{t(
																				"common.save",
																			)}
																		</>
																	)}
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		setEditingTag(
																			null,
																		)
																	}
																>
																	<X className="w-4 h-4 mr-1" />
																	{t(
																		"common.cancel",
																	)}
																</Button>
															</div>
														</div>
													) : (
														<>
															<div className="flex-1">
																<h3 className="font-semibold">
																	{tag.name}
																</h3>
															</div>
															<div className="flex gap-2">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		startEditTag(
																			tag,
																		)
																	}
																>
																	<Edit className="w-4 h-4" />
																</Button>
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() =>
																		handleOpenDeleteTagModal(
																			tag,
																		)
																	}
																>
																	<Trash2 className="w-4 h-4" />
																</Button>
															</div>
														</>
													)}
												</div>
											))}
										</div>

										{tagsHasMore && (
											<div className="flex justify-center mt-6">
												<Button
													onClick={() =>
														loadTags(false)
													}
													disabled={tagsLoadingMore}
													variant="outline"
												>
													{tagsLoadingMore ? (
														<>
															<Loader2 className="w-4 h-4 mr-2 animate-spin" />
															{t(
																"common.loading",
															)}
														</>
													) : (
														t("common.loadMore", {
															current:
																tags.length,
														})
													)}
												</Button>
											</div>
										)}
									</>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{categoryToDelete || tagToDelete ? (
				<ConfirmationModal
					isOpen={Boolean(categoryToDelete || tagToDelete)}
					onClose={
						categoryToDelete
							? handleCloseDeleteCategoryModal
							: handleCloseDeleteTagModal
					}
					onConfirm={
						categoryToDelete
							? handleDeleteCategory
							: handleDeleteTag
					}
					title={
						categoryToDelete
							? t("categories.delete_title")
							: t("tags.delete_title")
					}
					description={
						categoryToDelete
							? t("categories.delete_description")
							: t("tags.delete_description")
					}
					itemName={
						categoryToDelete
							? categoryToDelete.name
							: tagToDelete?.name
					}
					itemType={
						categoryToDelete ? t("categoryType") : t("tagType")
					}
					isLoading={deleting}
					variant="destructive"
				/>
			) : null}
		</div>
	);
}
