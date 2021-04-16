import { ExtractedAddress } from "../types";

const isZipCode = (code: string, country: string) => {
	let pattern;

	const caPattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

	const usPattern = /(^\d{5}$)|(^\d{5}-\d{4}$)/;

	pattern = country === "United States" ? usPattern : caPattern;

	return pattern.test(code);
};

const isCounty = (area: string) => {
	return area.includes("County");
};

/**
 * street and location, city, county, state, zip code, country
 * Extract address based on format above
 */
export const extractAddressLocation = (address: string): ExtractedAddress => {
	const output = {
		country: "-",
		zip: "-",
		state: "-",
		county: "-",
		city: "-",
		other: "-",
	};

	const addressArr = address.split(", ");

	const country = addressArr.pop();

	if (!country) return output;

	output.country = country;

	const zipOrState = addressArr.pop();

	if (!zipOrState) return output;

	const isZip = isZipCode(zipOrState, country);

	const zip = isZip ? zipOrState : "-";

	output.zip = zip;

	const state = isZip ? addressArr.pop() : zipOrState;

	if (isZip && !state) return output;

	output.state = state as string;

	const countyOrCity = addressArr.pop();

	if (!countyOrCity) return output;

	const isCount = isCounty(countyOrCity);

	const county = isCount ? countyOrCity : "-";

	output.county = county;

	const city = isCount ? addressArr.pop() : countyOrCity;

	if (isCount && !city) return output;

	output.city = city as string;

	const len = addressArr.length;

	if (!len) return output;

	const other = len > 1 ? addressArr.join(", ") : addressArr[0];

	output.other = other;

	return output;
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export const debounce = (func: Function, wait: number, immediate?: boolean) => {
	let timeout: NodeJS.Timeout | null;
	return function (this: any) {
		const context = this;

		const args = arguments;

		const later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};

		const callNow = immediate && !timeout;

		if (timeout) clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) func.apply(context, args);
	};
};
