export const dbUrlRaw = 'postgres://postgres@localhost/lego';
export const dbUrl = `?db=${encodeURIComponent(dbUrlRaw)}`;

export const headers = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
} satisfies HeadersInit;

export const logRes = async (res: Response) => {
	if (!res.ok) console.error(await res.text());
	else console.log(await res.json());
};
