"use client";

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

interface Category {
	id: string;
	name: string;
}

interface TravelTag {
	id: string;
	name: string;
}

const mockCategories: Category[] = [
	{ id: "1", name: "Tropical Beaches" },
	{ id: "2", name: "Mountain Ranges" },
	{ id: "3", name: "Metropolitan Cities" },
	{ id: "4", name: "Rural Countryside" },
	{ id: "5", name: "Ancient Ruins" },
	{ id: "6", name: "National Parks" },
	{ id: "7", name: "Private Islands" },
	{ id: "8", name: "Desert Landscapes" },
	{ id: "9", name: "Rainforests" },
	{ id: "10", name: "Alpine Lakes" },
	{ id: "11", name: "Coastal Towns" },
	{ id: "12", name: "Wine Regions" },
	{ id: "13", name: "Ski Resorts" },
	{ id: "14", name: "Safari Destinations" },
	{ id: "15", name: "Volcanic Areas" },
];

const mockTags: TravelTag[] = [
	{ id: "1", name: "Adventure Sports" },
	{ id: "2", name: "Cultural Immersion" },
	{ id: "3", name: "Food & Cuisine" },
	{ id: "4", name: "Photography" },
	{ id: "5", name: "Historical Sites" },
	{ id: "6", name: "Nature & Wildlife" },
	{ id: "7", name: "Relaxation & Wellness" },
	{ id: "8", name: "Nightlife & Entertainment" },
	{ id: "9", name: "Shopping & Markets" },
	{ id: "10", name: "Art & Museums" },
	{ id: "11", name: "Music & Festivals" },
	{ id: "12", name: "Architecture" },
	{ id: "13", name: "Local Transportation" },
	{ id: "14", name: "Street Food" },
	{ id: "15", name: "Luxury Travel" },
	{ id: "16", name: "Budget Travel" },
	{ id: "17", name: "Solo Travel" },
	{ id: "18", name: "Family Travel" },
	{ id: "19", name: "Eco Tourism" },
	{ id: "20", name: "Volunteer Travel" },
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
	const [categories, setCategories] = useState<Category[]>([]);
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

	useEffect(() => {
		loadCategories(true);
		loadTags(true);
	}, []);

	useEffect(() => {
		setCategories([]);
		setCategoriesPage(1);
		setCategoriesHasMore(true);
		loadCategories(true);
	}, [categoriesSearch]);

	useEffect(() => {
		setTags([]);
		setTagsPage(1);
		setTagsHasMore(true);
		loadTags(true);
	}, [tagsSearch]);

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

			const newCategory: Category = {
				id: Date.now().toString(),
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

			setNewCategoryName("");
		} catch (error) {
			console.error("Error adding category:", error);
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
				id: Date.now().toString(),
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

			setNewTagName("");
		} catch (error) {
			console.error("Error adding tag:", error);
		} finally {
			setAddingTag(false);
		}
	};

	const handleDeleteCategory = async (categoryId: string) => {
		if (!confirm("Are you sure you want to delete this category?")) return;

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			const index = mockCategories.findIndex((c) => c.id === categoryId);
			if (index !== -1) {
				mockCategories.splice(index, 1);
			}

			setCategories((prev) => prev.filter((c) => c.id !== categoryId));
			setCategoriesTotalCount((prev) => prev - 1);
		} catch (error) {
			console.error("Error deleting category:", error);
		}
	};

	const handleDeleteTag = async (tagId: string) => {
		if (!confirm("Are you sure you want to delete this tag?")) return;

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			const index = mockTags.findIndex((t) => t.id === tagId);
			if (index !== -1) {
				mockTags.splice(index, 1);
			}

			setTags((prev) => prev.filter((t) => t.id !== tagId));
			setTagsTotalCount((prev) => prev - 1);
		} catch (error) {
			console.error("Error deleting tag:", error);
		}
	};

	const startEditCategory = (category: Category) => {
		setEditingCategory(category.id);
		setEditCategoryName(category.name);
	};

	const saveEditCategory = async () => {
		if (!editCategoryName.trim()) return;

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			const index = mockCategories.findIndex(
				(c) => c.id === editingCategory,
			);
			if (index !== -1) {
				mockCategories[index] = {
					...mockCategories[index],
					name: editCategoryName.trim(),
				};
			}

			setCategories((prev) =>
				prev.map((c) =>
					c.id === editingCategory
						? { ...c, name: editCategoryName.trim() }
						: c,
				),
			);

			setEditingCategory(null);
		} catch (error) {
			console.error("Error updating category:", error);
		}
	};

	const startEditTag = (tag: TravelTag) => {
		setEditingTag(tag.id);
		setEditTagName(tag.name);
	};

	const saveEditTag = async () => {
		if (!editTagName.trim()) return;

		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			const index = mockTags.findIndex((t) => t.id === editingTag);
			if (index !== -1) {
				mockTags[index] = {
					...mockTags[index],
					name: editTagName.trim(),
				};
			}

			setTags((prev) =>
				prev.map((t) =>
					t.id === editingTag
						? { ...t, name: editTagName.trim() }
						: t,
				),
			);

			setEditingTag(null);
		} catch (error) {
			console.error("Error updating tag:", error);
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
													key={category.id}
													className="flex items-center justify-between p-3 border rounded-lg"
												>
													{editingCategory ===
													category.id ? (
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
																>
																	<Save className="w-4 h-4 mr-1" />
																	{t(
																		"common.save",
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
																		handleDeleteCategory(
																			category.id,
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
															total: categoriesTotalCount,
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
													key={tag.id}
													className="flex items-center justify-between p-3 border rounded-lg"
												>
													{editingTag === tag.id ? (
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
																>
																	<Save className="w-4 h-4 mr-1" />
																	{t(
																		"common.save",
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
																		handleDeleteTag(
																			tag.id,
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
															total: tagsTotalCount,
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
		</div>
	);
}
