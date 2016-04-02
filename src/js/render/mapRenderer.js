import PIXI from "pixi.js";

export default class MapRenderer {
	constructor(map, width, height, transparent) {
		this.map = map;
		this.width = width;
		this.height = height;
		this.tileWidth = this.map.tileWidth;
		this.tileHeight = this.map.tileHeight;
		this._renderer = new PIXI.WebGLRenderer(this.width, this.height,
			{ transparent: transparent || false });
		this._container = new PIXI.Container();
		this.zoom = 3.0;
		this.offset = {
			x: 0.0,
			y: 0.0
		}

		this.applyTiles();
		this.update();
		this.render();
	}

	getRenderer() {
		return this._renderer.view;
	}

	updateSize(width, height) {
		this.width = width;
		this.height = height;
		this._renderer.view.style.width = this.width + "px";
		this._renderer.view.style.height = this.height + "px";
		this._renderer.resize(this.width, this.height);
	}

	applyTiles() {
		this._forEachTile(function(tile) {
			this._container.addChild(tile.getSprite());
		}.bind(this));
	}

	update() {
		this._forEachTile(function(tile, x, y) {
			if (!tile.spriteUpToDate()) {
				for (let i = 0; i < this.map.tilesets.length; i++) {
					if (this.map.tilesets[i].name == tile.tilesetName) {
						tile.updateSprite(this.map.tilesets[i]);
					}
				}
			}

			let sprite = tile.getSprite();
			sprite.width = this.map.tileWidth * this.zoom;
			sprite.height = this.map.tileHeight * this.zoom;
			sprite.position.set(
				x * sprite.width - this.offset.x,
				y * sprite.height - this.offset.y
			);
		}.bind(this));
	}

	_forEachTile(callback) {
		for (let l = 0; l < this.map.tileLayers.length; l++) {
			let tiles = this.map.tileLayers[l].tiles;
			for (let x = 0; x < this.map.width; x++) {
				for (let y = 0; y < this.map.height; y++) {
					callback(tiles[x][y], x, y);
				}
			}
		}
	}

	unprojectToTile(pos) {
		return {
			x: Math.floor(
				pos.x / (this.tileWidth * this.zoom)
				+ this.offset.x / (this.tileWidth * this.zoom)
			),
			y: Math.floor(
				pos.y / (this.tileHeight * this.zoom)
				+ this.offset.y / (this.tileHeight * this.zoom)
			)
		}
	}

	render() {
		this._renderer.render(this._container);
	}
}
