const localeMapper: Record<string, string> = {
	en: "en-US",
	ua: "uk-UA",
	de: "de-DE",
};

export const convertDateToDDMonYYYY = (dateString: string, locale: string) => {
	const date = new Date(dateString);

	const selectedLocale = localeMapper[locale] || "en-US";

	const formatter = new Intl.DateTimeFormat(selectedLocale, {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

	return formatter.format(date);
};
