export class PositionedTile {
	constructor(x, y, id) {
		this.x = x;
		this.y = y;
		this.tileId = id;
	}
}

export class TileSelection {
	constructor(width, height, tiles) {
		this.width = width;
		this.height = height;
		this.tiles = tiles;
	}
}
