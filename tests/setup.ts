import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

/** Mock hasPointerCapture for Radix UI Select component */
if (typeof Element !== "undefined") {
	Element.prototype.hasPointerCapture =
		Element.prototype.hasPointerCapture ||
		function () {
			return false;
		};
	Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || function () {};
}

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});
