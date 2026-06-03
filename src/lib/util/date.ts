export const formatDate = (date: Date | string): string => {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).format(new Date(date));
};

export function formatIfDate(value: any): string {
	if (typeof value !== 'string' || value.trim() === '' || !isNaN(Number(value))) {
		return String(value);
	}

	const dateRegex = /^(\d{4}[-/]\d{2}[-/]\d{2})|(\d{2}[-/]\d{2}[-/]\d{4})/;
	const isIsoString = value.endsWith('Z') || value.includes('T');

	if (!dateRegex.test(value) && !isIsoString) {
		return value;
	}

	const date = new Date(value);

	if (isNaN(date.getTime())) {
		return value;
	}

	return new Intl.DateTimeFormat('en-UK', {
		dateStyle: 'medium',
		timeStyle: value.includes(':') ? 'short' : undefined,
	}).format(date);
}
