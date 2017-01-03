/* globals Tool */
window.PenTool = class extends Tool {
	constructor() {
		super();

		this._paintOrigin = null;
		this._lastPaintPosition = null;
	}

	tap({ tilePosition, shiftKey }) {
		if (!this.propertiesValid) return false;

		this._paintOrigin = tilePosition;
		if (!shiftKey || !this._lastPaintPosition) {
			this._lastPaintPosition = tilePosition;
		}
		this._paintTo(tilePosition.x, tilePosition.y);
		this._lastPaintPosition = tilePosition;

		return true;
	}

	track({ tilePosition, state }) {
		if (!this.propertiesValid) return false;

		if (state === "start") {
			this._paintOrigin = this._lastPaintPosition = tilePosition;
			this._paintTo(tilePosition.x, tilePosition.y);
		} else if (state === "track") {
			this._paintTo(tilePosition.x, tilePosition.y);
			this._lastPaintPosition = tilePosition;
		} else if (state === "end") {
			return true;
		}
		return false;
	}

	paintAt(tileX, tileY) {
		for (let lx = 0; lx < this.tileArea.width; lx++) {
			for (let ly = 0; ly < this.tileArea.height; ly++) {
				const x = tileX + lx;
				const y = tileY + ly;
				const tile = this.tileArea.getTilingTileData(
					this._paintOrigin.x, this._paintOrigin.y,
					x, y
				);

				if (x < 0 || y < 0 ||
					x >= this.map.width ||
					y >= this.map.height) continue;

				this.map.layers[this.layerId].getTile(x, y)
					.setData(tile.tileId, tile.tilesetId);
			}
		}
	}

	_paintTo(tileX, tileY) {
		let x0 = this._lastPaintPosition.x,
			y0 = this._lastPaintPosition.y,
			x1 = tileX, y1 = tileY;
		const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
		const sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1;

		let err = dx - dy;

		while (true) {
			this.paintAt(x0, y0);

			if ((x0 === x1) && (y0 === y1)) break;
			const e2 = err * 2;
			if (e2 > -dy) {
				err -= dy;
				x0 += sx;
			}
			if (e2 < dx) {
				err += dx;
				y0 += sy;
			}
		}
	}
};
