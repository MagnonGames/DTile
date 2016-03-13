let PIXI = require("pixi.js");

export default class Tile {
	constructor(tileId) {
		this.setTileID(tileId);
		this._container = new PIXI.Container();
	}

	updateSprite(tileset) {
		this._previousId = this.id;
		this._container.children = [];
		if (this.id >= 0 && this.tilesetName) {
			this._texture = tileset.getTileTexture(this.id);
			this._container.addChild(new PIXI.Sprite(this._texture));
		} else {
			this._texture = PIXI.Texture.EMPTY;
		}
	}

	spriteUpToDate() {
		return this.id == this._previousId && this._texture && this._texture.valid;
	}

	getSprite() {
		return this._container;
	}

	setTileID(tileId) {
		this._previousId = this.id;
		this.id = tileId;
		if (this.id == -1) {
			delete this.tilesetName;
		}
	}

	setTilesetName(tilesetName) {
		this.tilesetName = tilesetName;
	}
}
