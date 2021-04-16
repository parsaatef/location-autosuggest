import React, { useRef } from "react";
import styles from "./Autosuggest.module.css";
import marker from "../../assets/location-marker.svg";
import useOutsideClick from "../../hooks/useOutsideClick";
import { extractAddressLocation, debounce } from "../../helper/utility";
import { ExtractedAddress, LocationPoint } from "../../types";

interface Props {
	locateOnMap: (item: LocationPoint) => void;
}

const Autosuggest: React.FC<Props> = (props) => {
	const { locateOnMap } = props;

	const inputEl = useRef<HTMLInputElement>(null);

	const [value, setValue] = React.useState("");

	const [suggestedAddresses, setSuggestedAddresses] = React.useState<
		LocationPoint[]
	>([]);

	/**
	 * fetch locations
	 * @param {string} q
	 */
	const fetchLocations = (q: string) => {
		fetch(
			`https://nominatim.openstreetmap.org/search.php?q=${q}&polygon_geojson=1&countrycodes=ca,us&limit=100&format=jsonv2`
		)
			.then((response) => response.json())
			.then((data) => {
				//setSuggestBoxStatus("open");
				setSuggestedAddresses(data);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const debouncedFetch = useRef<(q: string) => void>();

	React.useEffect(() => {
		/**
		 * Prevent for fetching data per each key pressing
		 * for performance optimization
		 */
		debouncedFetch.current = debounce((q: string) => {
			fetchLocations(q);
		}, 300);
	}, []);

	const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const q = e.target.value;
		setValue(q);
		if (debouncedFetch && debouncedFetch.current) {
			debouncedFetch.current(q);
		}
	};

	const [
		selectedLocation,
		setSelectedLocation,
	] = React.useState<ExtractedAddress>();

	const handleLocateOnMap = (item: LocationPoint) => {
		//show selected location on the map
		locateOnMap(item);
		const q = item.display_name;
		//update input value
		setValue(q);
		//fetch locations from API
		fetchLocations(q);
		//extract selected location and show below the input
		setSelectedLocation(q ? extractAddressLocation(q) : undefined);
		//close the suggestion's box
		setSuggestBoxStatus("close");
	};

	const [suggestBoxStatus, setSuggestBoxStatus] = React.useState("close");

	const suggestBoxEl = useRef<HTMLDivElement>(null);

	useOutsideClick(suggestBoxEl, (eventTarget: EventTarget) => {
		if (inputEl && !inputEl?.current?.contains(eventTarget as Node)) {
			setSuggestBoxStatus("close");
		}
	});

	const handleFocus = () => {
		setSuggestBoxStatus("open");
	};

	return (
		<section className={styles.container}>
			<input
				className={styles.input}
				value={value}
				type="text"
				onChange={handleChangeInput}
				onClick={handleFocus}
				placeholder="Complete Listing Address"
				ref={inputEl}
			/>

			{suggestedAddresses.length > 0 && suggestBoxStatus === "open" && (
				<div ref={suggestBoxEl} className={styles.suggestBox}>
					<ul className={styles.list}>
						{suggestedAddresses.map((item) => (
							<li
								onClick={handleLocateOnMap.bind(null, item)}
								key={item.place_id}
								className={styles.listItem}
							>
								<div>
									<img
										className={styles.marker}
										src={marker}
										alt={item.display_name}
									/>
								</div>
								<div>{item.display_name}</div>
							</li>
						))}
					</ul>
				</div>
			)}

			{selectedLocation && (
				<div className={styles.selectedLocation}>
					<div className={styles.selectedLocationItem}>
						<b>Country: </b>
						<span>{selectedLocation.country}</span>
					</div>
					<div className={styles.selectedLocationItem}>
						<b>State: </b>
						<span>{selectedLocation.state}</span>
					</div>
					<div className={styles.selectedLocationItem}>
						<b>County: </b>
						<span>{selectedLocation.county}</span>
					</div>
					<div className={styles.selectedLocationItem}>
						<b>City: </b>
						<span>{selectedLocation.city}</span>
					</div>
					<div className={styles.selectedLocationItem}>
						<b>Address or Street: </b>
						<span>{selectedLocation.other}</span>
					</div>
					<div className={styles.selectedLocationItem}>
						<b>Zip Code: </b>
						<span>{selectedLocation.zip}</span>
					</div>
				</div>
			)}
		</section>
	);
};

export default Autosuggest;
