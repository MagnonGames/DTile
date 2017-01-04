/* globals Tool */
window.FillTool = class extends Tool {
	tap({ tilePosition, button }) {
		if (!this.propertiesValid || button) return false;

		this.fill(tilePosition);
		return true;
	}

	track({ tilePosition, state, button }) {
		if (!this.propertiesValid || button) return false;

		if (state === "end") {
			this.fill(tilePosition);
			return true;
		}
		return false;
	}

	fill(tilePosition) {
		this.map.layers[this.layerId]
			.fillAt(tilePosition.x, tilePosition.y, this.tileArea);
	}
};
