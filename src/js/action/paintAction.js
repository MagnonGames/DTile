export default class PaintAction {
	constructor(oldTileSelection, newTileSelection, layer, x, y) {
		this.oldTileSelection = oldTileSelection;
		this.newTileSelection = newTileSelection;
		this.layer = layer;
		this.x = x;
		this.y = y;
	}

	apply(map) {
		this._paintSelection(map, this.newTileSelection);
	}

	undo(map) {
		this._paintSelection(map, this.oldTileSelection);
	}

	_paintSelection(map, selection) {
		for (let toPaint of selection.tiles) {
			let tile = map.tileLayers[this.layer]
				.getTile(this.x + toPaint.x, this.y + toPaint.y);
			tile.setTileID(toPaint.tileId);
			tile.setTilesetName("tileset"); // TODO: SHOULD CHANGE ACCORDING TO TILESET NAME.
		}
	}
}
