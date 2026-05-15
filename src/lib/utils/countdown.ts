// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
//              LIB:UTILS:COUNTDOWN.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type CountdownTimeLeft = {
	totalMs: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	isComplete: boolean;
};

export type CountDownOptions = {
	targetDate: Date | string;
	nowMs?: number;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export const getCountdownTimeLeft = ({
	targetDate,
	nowMs = Date.now(),
}: CountDownOptions): CountdownTimeLeft => {
	const targetMs = new Date(targetDate).getTime();

	const totalMs = Number.isNaN(targetMs)
		? 0
		: Math.max(targetMs - nowMs, 0);

	let result = {
		totalMs,
		days: Math.floor(totalMs / MS_PER_DAY),
		hours: Math.floor((totalMs / MS_PER_HOUR) % 24),
		minutes: Math.floor((totalMs / MS_PER_MINUTE) % 60),
		seconds: Math.floor((totalMs / MS_PER_SECOND) % 60),
		isComplete: totalMs === 0,
	};

	return result;
};

export const formatCountdownUnit = (value: number): string => {
	return String(value).padStart(2, '0');
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
