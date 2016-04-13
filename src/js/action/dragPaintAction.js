import { PositionedTile } from "../selectionUtils.js";

export default class DragPaintAction {
	constructor(x, y, layerId, tileArea) {
		this.locations = [];
		this.oldTiles = [];
		this.startX = x;
		this.startY = y;
		this.layerId = layerId
		this.tileArea = tileArea;
		this.needsUpdate = false;
	}

	paint(x, y, map) {
		for (let location of this.locations) {
			if (location.x == x && location.y == y) {
				return;
			}
		}

		for (let lx = x; lx < x + this.tileArea.width; lx++) {
			for (let ly = y; ly < y + this.tileArea.height; ly++) {
				let oldAlreadyRegistered = false;

				for (let old of this.oldTiles) {
					if (old.x == lx && old.y == ly) {
						oldAlreadyRegistered = true;
					}
				}

				if (!oldAlreadyRegistered) {
					this.oldTiles.push(new PositionedTile(
						lx, ly,
						map.tileLayers[this.layerId].getTile(lx, ly).id
					));
				}
			}
		}

		this.locations.push({ x, y });
		this.needsUpdate = true;
	}

	apply(map) {
		let areaWidth = this.tileArea.width,
			areaHeight = this.tileArea.height,
			tileOffsetX = ((this.startX - areaWidth) % areaWidth) - areaWidth,
			tileOffsetY = ((this.startY - areaHeight) % areaHeight) - areaHeight;

		for (let location of this.locations) {
			for (let x = location.x; x < location.x + this.tileArea.width; x++) {
				for (let y = location.y; y < location.y + this.tileArea.height; y++) {
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
		for (let old of this.oldTiles) {
			map.tileLayers[this.layerId]
				.getTile(old.x, old.y).setTileID(old.tileId);
		}
	}
}
