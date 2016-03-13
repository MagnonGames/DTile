import TileLayer from "./tileLayer.js";

export default class Map {
	constructor(width, height, tileWidth, tileHeight, tilesets) {
		this.tilesets = tilesets;
		this.tileLayers = [];
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.resize(width, height);
	}

	resize(width, height) {
		this.width = width;
		this.height = height;
	}

	createLayer(name) {
		this.tileLayers.push(new TileLayer(name, this.width, this.height));
	}

	removeLayer(name) {
		this.tileLayers.splice(this.tileLayers.indexOf(this.getLayer(name), 1));
	}

	getLayer(name) {
		for (let i = 0; i < this.tileLayers.length; i++) {
			if (this.tileLayers[i].name == name) {
				return this.tileLayers[i];
			}
		}
	}

	addTileset(tileset) {
		this.tilesets.push(tileset);
	}

	removeTileset(tileset) {
		this.tilesets.splice(this.tilesets.indexOf(tileset), 1);
	}
}
