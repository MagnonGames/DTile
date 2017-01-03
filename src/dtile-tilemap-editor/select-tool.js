/* globals Tool */
window.SelectTool = class extends Tool {
	constructor(tapSelect) {
		super();

		this.tapSelect = tapSelect;
	}

	tap({ tilePosition, deselectTiles, selectTiles }) {
		if (!this.map) return false;

		deselectTiles();
		if (this.tapSelect) {
			selectTiles([tilePosition]);
		}

		return false;
	}

	track({ localPosition, state, shiftKey, startSelect, updateSelect, endSelect,
		deselectTiles, selectTiles, getTilePositionFromLocal }) {
		if (!this.map) return false;

		if (state === "start") {
			startSelect(localPosition.x, localPosition.y);
		} else if (state === "track") {
			updateSelect(localPosition.x, localPosition.y);
		} else if (state === "end") {
			const selection = endSelect(localPosition.x, localPosition.y);

			if (!shiftKey) deselectTiles();

			const tilePos1 = getTilePositionFromLocal(selection.min.x, selection.min.y);
			const tilePos2 = getTilePositionFromLocal(selection.max.x, selection.max.y);

			const width = this.map.width - 1, height = this.map.width - 1;

			const clamp = (val, max) => Math.min(Math.max(val, 0), max);
			tilePos1.x = clamp(tilePos1.x, width);
			tilePos1.y = clamp(tilePos1.y, height);
			tilePos2.x = clamp(tilePos2.x, width);
			tilePos2.y = clamp(tilePos2.y, height);

			const selectionArray = [];
			for (let x = tilePos1.x; x <= tilePos2.x; x++) {
				for (let y = tilePos1.y; y <= tilePos2.y; y++) {
					selectionArray.push({ x, y });
				}
			}
			selectTiles(selectionArray);
		}

		return false;
	}
};
