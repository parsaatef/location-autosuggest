export interface LocationPoint {
	display_name: string;
	lat: number;
	lon: number;
	place_id: number;
}

export interface ExtractedAddress {
	country: string;
	zip: string;
	state: string;
	county: string;
	city: string;
	other: string;
}
