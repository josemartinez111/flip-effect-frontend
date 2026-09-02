// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
// COMPONENTS: SHARED > SEAT-GRID-CARD > SEAT_GRID_CARD_TYPES.TS
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞

export type SeatGridCardLayout = 'dense' | 'standard' | 'spacious';

export type SeatGridCardAvatarSize = 'small' | 'medium' | 'large';

export type SeatGridCardBar = {
	key: string;
	label: string;
	count: number;
	percentage: number;
	styleClasses: string;
};

export type SeatGridCardMetadata = {
	key: string;
	label: string;
};

export type SeatGridCardSeatStyleClasses = {
	iconStyleClasses?: string;
	rootStyleClasses?: string;
	seatBackStyleClasses?: string;
	seatHeadStyleClasses?: string;
	seatBaseStyleClasses?: string;
	hideIcon?: boolean;
};

export type SeatGridCardSeat = {
	id: string;
	ariaLabel: string;
	styleClasses: SeatGridCardSeatStyleClasses;
};

export type SeatGridCardModel = {
	key: string;
	title: string;
	statusLabel: string;
	summary: string;
	highlight: string;
	layout: SeatGridCardLayout;
	seatAvatarSize: SeatGridCardAvatarSize;
	seatGridAriaLabel: string;
	bars: Array<SeatGridCardBar>;
	metadata: Array<SeatGridCardMetadata>;
	seats: Array<SeatGridCardSeat>;
};
// ∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞∞
