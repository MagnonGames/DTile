import PubSub from "../event/pubSub.js";
import Events from "../event/events.js";

let PIXI = require("pixi.js");

export default class Tileset {
	// TODO: Implement spacing. variables are available, but they aren't implemented yet.
	constructor(name, tilesetPath, tileWidth, tileHeight, spacingX, spacingY) {
		this.setName(name);
		this._texture = PIXI.Texture.fromImage(tilesetPath);
		this._tiles = [];
		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.spacingX = spacingX || 0;
		this.spacingY = spacingY || 0;

		let textureLoaded = function() {
			this.width = Math.floor(this._texture.width / this.tileWidth);
			this.height = Math.floor(this._texture.height / this.tileHeight);

			this._generateTiles();
			PubSub.publish(Events.TILESET_LOADED, this);
		}
		if (this._texture.baseTexture.hasLoaded) {
			textureLoaded();
		} else {
			this._texture.on("update", textureLoaded.bind(this));
		}
	}

	setName(name) {
		this.name = name;
	}

	_generateTiles() {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let id = this.getTileId(x, y);
				this._tiles[id] = new PIXI.Texture(
					this._texture,
					this.getTileBounds(id)
				);
			}
		}
	}

	getTileId(x, y) {
		return x * this.height + y;
	}

	getTileBounds(Id) {
		let x = parseInt(Id / this.height),
			y = parseInt(Id - x * this.height);
		return new PIXI.Rectangle(
			x * this.tileWidth,
			y * this.tileHeight,
			this.tileWidth,
			this.tileHeight
		);
	}

	getTileTexture(Id) {
		return this._tiles[Id];
	}

	getTexture() {
		return this._texture;
	}
}
