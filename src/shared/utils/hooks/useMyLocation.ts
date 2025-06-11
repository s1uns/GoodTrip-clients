import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
	showErrorToast,
	showInfoToast,
	showSuccessToast,
	showWarningToast,
} from "../helpers/showToast";

export const useMyLocation = () => {
	const { t } = useTranslation();

	const getMyLocation = useCallback((): Promise<GeolocationPosition> => {
		return new Promise((resolve, reject) => {
			if (!navigator.geolocation) {
				showErrorToast(t("errors.geolocationNotSupported"));
				return reject(new Error("Geolocation not supported"));
			}

			showInfoToast(t("notifications.requestingLocation"));

			navigator.geolocation.getCurrentPosition(
				(position) => {
					showSuccessToast(t("notifications.locationReceived"));
					resolve(position);
				},
				(error) => {
					switch (error.code) {
						case error.PERMISSION_DENIED:
							showWarningToast(
								t("errors.locationPermissionDenied"),
							);
							break;
						case error.POSITION_UNAVAILABLE:
							showErrorToast(t("errors.positionUnavailable"));
							break;
						case error.TIMEOUT:
							showErrorToast(t("errors.locationRequestTimeout"));
							break;
						default:
							showErrorToast(t("errors.unknownLocationError"));
							break;
					}
					reject(error);
				},
			);
		});
	}, [t]);

	return { getMyLocation };
};
