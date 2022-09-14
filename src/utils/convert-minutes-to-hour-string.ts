export default function convertMinutesToHourString(minutesAmount: number) {
	const hours = Math.floor(minutesAmount / 60);

	const minutes = minutesAmount % 60;

	return `${hours}:${minutes}`;
}
