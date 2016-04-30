import { PositionedTile } from "../selectionUtils.js";

export default class TilingAction {
	constructor(startX, startY, layerId, tileArea, tileByTile) {
		this.startX = startX;
		this.startY = startY;
		this.layerId = layerId;
		this.tileArea = tileArea;

		this._appliedTilePositions = [];
		this._oldTiles = [];
		this._tileByTile = tileByTile;
		this._applyWidth = this._tileByTile ? 1 : this.tileArea.width;
		this._applyHeight = this._tileByTile ? 1 : this.tileArea.height;

		this.needsUpdate = false;
	}

	// Applies the action to a tile, skipping the call if the position
	// already is registered.
	applyTile(x, y, map) {
		for (let location of this._appliedTilePositions) {
			if (location.x == x && location.y == y) {
				return;
			}
		}

		for (let lx = x; lx < x + this._applyWidth; lx++) {
			for (let ly = y; ly < y + this._applyHeight; ly++) {
				let oldAlreadyRegistered = false;

				for (let old of this._oldTiles) {
					if (old.x == lx && old.y == ly) {
						oldAlreadyRegistered = true;
					}
				}

				if (!oldAlreadyRegistered) {
					this._oldTiles.push(new PositionedTile(
						lx, ly,
						map.tileLayers[this.layerId].getTile(lx, ly).id
					));
				}
			}
		}

		this._appliedTilePositions.push({ x, y });
		this.needsUpdate = true;
	}

	apply(map) {
		let areaWidth = this.tileArea.width,
			areaHeight = this.tileArea.height,
			tileOffsetX = ((this.startX - areaWidth) % areaWidth) - areaWidth,
			tileOffsetY = ((this.startY - areaHeight) % areaHeight) - areaHeight;

		for (let location of this._appliedTilePositions) {
			for (let x = location.x; x < location.x + this._applyWidth; x++) {
				for (let y = location.y; y < location.y + this._applyHeight; y++) {
					let tileX = (x - tileOffsetX) % areaWidth,
						tileY = (y - tileOffsetY) % areaHeight;

					let tileId = this.tileArea.getTile(tileX, tileY).tileId,
						tile = map.tileLayers[this.layerId].getTile(x, y);

					tile.setTileID(tileId);
					tile.setTilesetName("tileset"); // TODO: SHOULD CHANGE ACCORDING TO TILESET NAME.
				}
			}
		}
		this.needsUpdate = false;
	}

	undo(map) {
		for (let old of this._oldTiles) {
			map.tileLayers[this.layerId]
				.getTile(old.x, old.y).setTileID(old.tileId);
		}
	}
}
