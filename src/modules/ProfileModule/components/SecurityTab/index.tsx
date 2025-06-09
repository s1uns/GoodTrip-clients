"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Lock,
	Eye,
	EyeOff,
	Loader2,
	CheckCircle,
	XCircle,
	Check,
	X,
} from "lucide-react";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ValidationErrors {
	currentPassword?: string;
	password?: string;
	passwordConfirmation?: string;
}

export default function SecurityTab() {
	const { t } = useTranslation();

	const [currentPassword, setCurrentPassword] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");

	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirmation, setShowPasswordConfirmation] =
		useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<ValidationErrors>({});

	const validatePassword = (pwd: string): string[] => {
		const errors: string[] = [];

		if (pwd.length < 8) {
			errors.push(t("passwordValidation.length"));
		}

		if (!/[a-z]/.test(pwd)) {
			errors.push(t("passwordValidation.lowerCase"));
		}

		if (!/[A-Z]/.test(pwd)) {
			errors.push(t("passwordValidation.upperCase"));
		}

		if (!/\d/.test(pwd)) {
			errors.push(t("passwordValidation.number"));
		}

		return errors;
	};

	const passwordRules = [
		{
			text: t("passwordRules.minChars"),
			isValid: (pwd: string) => pwd.length >= 8,
		},
		{
			text: t("passwordRules.lowerCase"),
			isValid: (pwd: string) => /[a-z]/.test(pwd),
		},
		{
			text: t("passwordRules.upperCase"),
			isValid: (pwd: string) => /[A-Z]/.test(pwd),
		},
		{
			text: t("passwordRules.number"),
			isValid: (pwd: string) => /\d/.test(pwd),
		},
	];

	const validateForm = (): boolean => {
		const newErrors: ValidationErrors = {};

		if (!currentPassword.trim()) {
			newErrors.currentPassword = t("errors.currentPasswordRequired");
		}

		if (!password.trim()) {
			newErrors.password = t("errors.passwordRequired");
		} else {
			const passwordErrors = validatePassword(password);
			if (passwordErrors.length > 0) {
				newErrors.password = passwordErrors[0];
			}
		}

		if (!passwordConfirmation.trim()) {
			newErrors.passwordConfirmation = t(
				"errors.confirmPasswordRequired",
			);
		} else if (password !== passwordConfirmation) {
			newErrors.passwordConfirmation = t("errors.passwordsMismatch");
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));

			setCurrentPassword("");
			setPassword("");
			setPasswordConfirmation("");
			setErrors({});

			toast.success(t("toast.passwordChangedSuccess"));
		} catch (error) {
			toast.error(t("toast.passwordChangeFailed"));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handlePasswordChange = (value: string) => {
		setPassword(value);
		if (errors.password && value) {
			const passwordErrors = validatePassword(value);
			if (passwordErrors.length === 0) {
				setErrors((prev) => ({ ...prev, password: undefined }));
			}
		}
	};

	const handlePasswordConfirmationChange = (value: string) => {
		setPasswordConfirmation(value);
		if (errors.passwordConfirmation && value) {
			if (value === password) {
				setErrors((prev) => ({
					...prev,
					passwordConfirmation: undefined,
				}));
			}
		}
	};

	const getPasswordStrengthText = () => {
		if (!password) return "";
		const passwordErrors = validatePassword(password);
		if (passwordErrors.length === 0) return t("passwordStrength.strong");
		if (passwordErrors.length <= 2) return t("passwordStrength.medium");
		return t("passwordStrength.weak");
	};

	const getPasswordStrengthColor = () => {
		if (!password) return "#808080";
		const passwordErrors = validatePassword(password);
		if (passwordErrors.length === 0) return "#10b981";
		if (passwordErrors.length <= 2) return "#f59e0b";
		return "#ef4444";
	};

	const getPasswordStrengthWidth = () => {
		if (!password) return "0%";
		const passwordErrors = validatePassword(password);

		const strength = 4 - passwordErrors.length;
		return `${strength ? (strength / 4) * 100 : 10}%`;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center">
					<Lock className="w-5 h-5 mr-2" />
					{t("securitySettings.title")}
				</CardTitle>
				<CardDescription>
					{t("securitySettings.description")}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="currentPassword">
							{t("fields.currentPassword")}
						</Label>
						<div className="relative">
							<Input
								id="currentPassword"
								type={showCurrentPassword ? "text" : "password"}
								value={currentPassword}
								onChange={(e) =>
									setCurrentPassword(e.target.value)
								}
								placeholder={t(
									"placeholders.enterCurrentPassword",
								)}
								className={cn(
									"pr-12",
									errors.currentPassword
										? "border-red-500"
										: "",
								)}
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								style={{
									position: "absolute",
									top: "50%",
									right: "10px",
									transform: "translateY(-50%)",
									background: "transparent",
									border: "none",
									cursor: "pointer",
									padding: 0,
									margin: 0,
								}}
								onClick={() =>
									setShowCurrentPassword(!showCurrentPassword)
								}
							>
								{showCurrentPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>
						{errors.currentPassword && (
							<p className="text-sm text-red-500 flex items-center gap-1">
								<XCircle className="w-4 h-4" />
								{errors.currentPassword}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">
							{t("fields.newPassword")}
						</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) =>
									handlePasswordChange(e.target.value)
								}
								placeholder={t("placeholders.enterNewPassword")}
								className={cn(
									"pr-12",
									errors.password ? "border-red-500" : "",
								)}
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								style={{
									position: "absolute",
									top: "50%",
									right: "10px",
									transform: "translateY(-50%)",
									background: "transparent",
									border: "none",
									cursor: "pointer",
									padding: 0,
									margin: 0,
								}}
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>

						{password && (
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
										<div
											className="h-full rounded-full transition-all duration-300"
											style={{
												width: getPasswordStrengthWidth(),
												backgroundColor:
													getPasswordStrengthColor(),
												height: 5,
											}}
										/>
									</div>
									<span className="text-sm font-medium min-w-[60px]">
										{getPasswordStrengthText()}
									</span>
								</div>
							</div>
						)}

						{errors.password && (
							<p className="text-sm text-red-500 flex items-center gap-1">
								<XCircle className="w-4 h-4" />
								{errors.password}
							</p>
						)}
					</div>

					<div className="bg-muted/50 rounded-md p-3 space-y-2 pt-0">
						<p className="text-sm font-medium text-muted-foreground">
							{t("passwordRules.header")}
						</p>
						<div className="space-y-1">
							{passwordRules.map((rule, index) => {
								const isValid = password
									? rule.isValid(password)
									: false;
								return (
									<div
										key={index}
										className="flex items-center gap-2 text-sm"
									>
										{isValid ? (
											<Check className="h-4 w-4 text-green-500" />
										) : (
											<X className="h-4 w-4 text-muted-foreground" />
										)}
										<span
											className={cn(
												"transition-colors",
												isValid
													? "text-green-600"
													: "text-muted-foreground",
											)}
										>
											{rule.text}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="passwordConfirmation">
							{t("fields.confirmNewPassword")}
						</Label>
						<div className="relative">
							<Input
								id="passwordConfirmation"
								type={
									showPasswordConfirmation
										? "text"
										: "password"
								}
								value={passwordConfirmation}
								onChange={(e) =>
									handlePasswordConfirmationChange(
										e.target.value,
									)
								}
								placeholder={t(
									"placeholders.confirmNewPassword",
								)}
								className={cn(
									"pr-12",
									errors.passwordConfirmation
										? "border-red-500"
										: "",
								)}
							/>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								style={{
									position: "absolute",
									top: "50%",
									right: "10px",
									transform: "translateY(-50%)",
									background: "transparent",
									border: "none",
									cursor: "pointer",
									padding: 0,
									margin: 0,
								}}
								onClick={() =>
									setShowPasswordConfirmation(
										!showPasswordConfirmation,
									)
								}
							>
								{showPasswordConfirmation ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</Button>
						</div>

						{passwordConfirmation &&
							!errors.passwordConfirmation && (
								<p className="text-sm text-green-500 flex items-center gap-1">
									<CheckCircle className="w-4 h-4" />
									{t("validationStatus.passwordsMatch")}
								</p>
							)}

						{errors.passwordConfirmation && (
							<p className="text-sm text-red-500 flex items-center gap-1">
								<XCircle className="w-4 h-4" />
								{errors.passwordConfirmation}
							</p>
						)}
					</div>

					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								{t("buttons.changingPassword")}
							</>
						) : (
							<>
								<Lock className="w-4 h-4 mr-2" />
								{t("buttons.changePassword")}
							</>
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
