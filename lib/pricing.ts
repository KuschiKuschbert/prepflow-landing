export type PriceAmount = 29 | 39 | 49;

export interface PricePhase {
	start: string; // ISO date string
	price: PriceAmount;
}

function parseScheduleFromEnv(): PricePhase[] {
	const raw = process.env.NEXT_PUBLIC_PRICE_SCHEDULE;
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw) as PricePhase[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function getGumroadUrlForPrice(price: PriceAmount): string {
	if (price === 49) return 'https://7495573591101.gumroad.com/l/prepflow2';
	if (price === 39) return 'https://7495573591101.gumroad.com/l/prepflow1';
	return 'https://7495573591101.gumroad.com/l/prepflow';
}

export function getCurrentPrice(now: Date = new Date()): { price: PriceAmount; url: string } {
	const schedule = parseScheduleFromEnv()
		.filter(p => !!p.start && (p.price === 29 || p.price === 39 || p.price === 49))
		.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

	let current: PriceAmount = 29;
	for (const phase of schedule) {
		if (new Date(phase.start).getTime() <= now.getTime()) {
			current = phase.price;
		}
	}
	return { price: current, url: getGumroadUrlForPrice(current) };
}

export function formatAud(amount: PriceAmount): string {
	return `AUD $${amount}`;
}
