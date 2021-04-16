import React, { useRef } from "react";
import leaflet, { Icon, IconOptions, Marker, Map } from "leaflet";
import Autosuggest from "../autosuggest/Autosuggest";
import "leaflet/dist/leaflet.css";
import locationImg from "../../assets/location.png";
import { LocationPoint } from "../../types";

const MapComponent = () => {
	const currMap = useRef<Map>();

	const markerIcon = useRef<Icon<IconOptions>>();

	const marker = useRef<Marker<any>>();

	React.useEffect(() => {
		const currentMap = leaflet
			.map("map-container")
			.setView([37.65, -122.43], 13);

		currMap.current = currentMap;

		leaflet
			.tileLayer(
				"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
				{
					maxZoom: 18,
					attribution:
						'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
						'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
					id: "mapbox/streets-v11",
					tileSize: 512,
					zoomOffset: -1,
				}
			)
			.addTo(currentMap);

		markerIcon.current = leaflet.icon({
			iconUrl: locationImg,
			iconSize: [40, 60],
			iconAnchor: [22, 94],
			popupAnchor: [-3, -76],
		});

		return () => {
			currentMap.remove();
		};
	}, []);

	/**
	 * Locate selected address on the map
	 * @param {*} point
	 */
	const locateOnMap = ({ lat, lon, display_name }: LocationPoint) => {
		currMap?.current?.setView([lat, lon]);

		if (!marker || !marker.current) {
			marker.current = leaflet.marker([lat, lon], {
				icon: markerIcon.current,
			});
			marker.current
				.addTo(currMap.current as Map)
				.bindPopup(display_name)
				.openPopup();
		} else {
			marker.current
				.setLatLng([lat, lon])
				.bindPopup(display_name)
				.openPopup();
		}
	};

	return (
		<section>
			<div
				id="map-container"
				style={{
					width: "100%",
					height: "400px",
				}}
			/>

			<Autosuggest locateOnMap={locateOnMap} />
		</section>
	);
};

export default MapComponent;
