window.Tool = class {
	constructor() {
		this.map = null;
		this.tileArea = null;
		this.layerId = null;
	}

	tap() {
		console.warn("No implementation for tap on tool!");
	}

	track() {
		console.warn("No implementation for track on tool!");
	}

	get propertiesValid() {
		return this.map !== null && this.tileArea !== null && this.layerId !== null;
	}
};
