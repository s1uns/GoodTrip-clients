export const convertDateToDDMonYYYY = (dateString: string) => {
	const date = new Date(dateString);

	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear(); 

	const formattedDay = day < 10 ? "0" + day : day;

	return `${formattedDay} ${month} ${year}`;
};
