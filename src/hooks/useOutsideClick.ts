/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React, { useEffect } from "react";

const useOutsideClick = (
	ref: React.RefObject<HTMLElement>,
	callback: (event: EventTarget) => void
) => {
	/**
	 * call callback if clicked on outside of element
	 */
	function handleClickOutside(event: MouseEvent) {
		if (ref.current && !ref.current.contains(<Node>event!.target)) {
			callback(<Node>event!.target);
		}
	}

	useEffect(() => {
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	});
};

export default useOutsideClick;
