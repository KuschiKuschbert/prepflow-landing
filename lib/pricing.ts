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

function addMonths(date: Date, months: number): Date {
	const d = new Date(date);
	d.setMonth(d.getMonth() + months);
	return d;
}

export function getDefaultSchedule(now: Date = new Date()): PricePhase[] {
	// Base 29 now, 39 in +3 months, 49 in +6 months
	const base = new Date(now);
	return [
		{ start: base.toISOString(), price: 29 },
		{ start: addMonths(base, 3).toISOString(), price: 39 },
		{ start: addMonths(base, 6).toISOString(), price: 49 }
	];
}

function getSchedule(now: Date = new Date()): PricePhase[] {
	const envSched = parseScheduleFromEnv();
	const schedule = (envSched.length ? envSched : getDefaultSchedule(now))
		.filter(p => !!p.start && (p.price === 29 || p.price === 39 || p.price === 49))
		.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
	return schedule;
}

function getGumroadUrlForPrice(price: PriceAmount): string {
	if (price === 49) return 'https://7495573591101.gumroad.com/l/prepflow2';
	if (price === 39) return 'https://7495573591101.gumroad.com/l/prepflow1';
	return 'https://7495573591101.gumroad.com/l/prepflow';
}

export function getCurrentPrice(now: Date = new Date()): { price: PriceAmount; url: string } {
	const schedule = getSchedule(now);
	let current: PriceAmount = 29;
	for (const phase of schedule) {
		if (new Date(phase.start).getTime() <= now.getTime()) {
			current = phase.price;
		}
	}
	return { price: current, url: getGumroadUrlForPrice(current) };
}

export function getUpcomingChanges(now: Date = new Date()): Array<{ date: Date; price: PriceAmount }> {
	const schedule = getSchedule(now);
	return schedule
		.map(p => ({ date: new Date(p.start), price: p.price }))
		.filter(p => p.date.getTime() > now.getTime())
		.slice(0, 3);
}

export function daysUntil(date: Date, now: Date = new Date()): number {
	const ms = date.getTime() - now.getTime();
	return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function formatAud(amount: PriceAmount): string {
	return `AUD $${amount}`;
}
