import Tile from "./tile.js";
import { PositionedTile, TileSelection } from "../selectionUtils.js";

export default class TileLayer {
	constructor(name, width, height) {
		this.setName(name);
		this.resize(width, height);
	}

	setName(name) {
		this.name = name;
	}

	resize(width, height) {
		this._width = width;
		this._height = height;

		// Create 2D array
		this.tiles = new Array(this._width);
		for (let x = 0; x < this._width; x++) {
			this.tiles[x] = new Array(this._height);
			for (let y = 0; y < this._height; y++) {
				this.tiles[x][y] = new Tile(-1);
			}
		}
	}

	getTile(x, y) {
		return this.tiles[x][y];
	}

	getTilesFromArea(x, y, width, height) {
		let positionedTiles = [];
		for (let mapX = x; mapX < x + width; mapX++) {
			for (let mapY = y; mapY < y + height; mapY++) {
				positionedTiles.push(new PositionedTile(
					mapX - x,
					mapY - y,
					this.getTile(mapX, mapY).id
				));
			}
		}

		return new TileSelection(
			width,
			height,
			positionedTiles
		);
	}
}
