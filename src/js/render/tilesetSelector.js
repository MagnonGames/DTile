import InputManager from "../input.js";
import Selection from "./tileSelection.js";
import { TileSelection, PositionedTile } from "../selectionUtils.js";

import PubSub from "../event/pubSub.js";
import Events from "../event/events.js";

let PIXI = require("pixi.js");

export default class TilesetSelector {
	constructor(width, height, tileset) {
		this.offset = {
			x: 0.0,
			y: 0.0
		};
		this.zoom = 2.0;
		this._renderer = new PIXI.WebGLRenderer(
			width, height, { transparent: true }
		);
		this._container = new PIXI.Container();

		if (tileset) {
			this.changeTileset(tileset);
		}

		this.inputManager = new InputManager(this.getRenderer(), false);
		this.inputManager.on("down", function(e) {
			let tilePos = this.unprojectToTile({ x: e.x, y: e.y });
			this.selectStartPos = tilePos;
			this._selectFromStart(tilePos.x, tilePos.y);

			this.update();
			this.render();
		}.bind(this));
		this.inputManager.on("drag", function(e) {
			let tilePos = this.unprojectToTile({ x: e.x, y: e.y });
			this._selectFromStart(tilePos.x, tilePos.y);

			this.update();
			this.render();
		}.bind(this));
		this.inputManager.on("up", function(e) {
			let bounds = {
				x: NaN,
				y: NaN,
				width: 0,
				height: 0
			};
			let selectedTiles = [];
			for (let tile of this.selection.selected) {
				if (isNaN(bounds.x) || tile.x < bounds.x) {
					bounds.x = tile.x;
				}
				if (isNaN(bounds.y) || tile.y < bounds.y) {
					bounds.y = tile.y;
				}
				if (tile.selected) {
					selectedTiles.push(new PositionedTile(
						tile.x,
						tile.y,
						this.tileset.getTileId(tile.x, tile.y)
					));
				}
			}
			for (let tile of selectedTiles) {
				tile.x -= bounds.x;
				tile.y -= bounds.y;
				if (tile.x > bounds.width) {
					bounds.width = tile.x;
				}
				if (tile.y > bounds.height) {
					bounds.height = tile.y;
				}
			}
			PubSub.publish(Events.TILESET_TILES_SELECTED,
				new TileSelection(bounds.width, bounds.height, selectedTiles));
		}.bind(this));
		this.inputManager.on("scroll", function(e) {
			if (!e.alt) { // Scroll
				this.offset.x += e.x / this.zoom;
				this.offset.y += e.y / this.zoom;
			} else { // Zoom
				this.zoom += -e.y / (500 / this.zoom);
			}

			this.update();
			this.render();
		}.bind(this));
	}

	_selectFromStart(x, y) {
		let distance = {
			x: x - this.selectStartPos.x,
			y: y - this.selectStartPos.y
		}
		this.selection.select(
			distance.x < 0 ? this.selectStartPos.x + 1 : this.selectStartPos.x,
			distance.y < 0 ? this.selectStartPos.y + 1 : this.selectStartPos.y,
			distance.x < 0 ? distance.x - 1 : distance.x + 1,
			distance.y < 0 ? distance.y - 1 : distance.y + 1,
			Selection.SELECTION
		);
	}

	changeTileset(tileset) {
		this.tileset = tileset;
		this.selection = new Selection(
			this.tileset.tileWidth,
			this.tileset.tileHeight,
			0x00ccff, 0.7
		);
		this._tilesetSprite = new PIXI.Sprite(this.tileset.getTexture());
		this._container.children = [];
		this._container.addChild(this._tilesetSprite);
		this._container.addChild(this.selection);

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

	unprojectToTile(pos) {
		return {
			x: Math.floor(
				pos.x / (this.tileset.tileWidth * this.zoom)
				+ this.offset.x / (this.tileset.tileWidth * this.zoom)
			),
			y: Math.floor(
				pos.y / (this.tileset.tileHeight * this.zoom)
				+ this.offset.y / (this.tileset.tileHeight * this.zoom)
			)
		}
	}

	update() {
		this._tilesetSprite.width = this.tileset.getTexture().width * this.zoom;
		this._tilesetSprite.height = this.tileset.getTexture().height * this.zoom;
		this._tilesetSprite.position.set(
			-this.offset.x,
			-this.offset.y
		);
		this.selection.update();
		this.selection.position.set(-this.offset.x, -this.offset.y);
		this.selection.scale = new PIXI.Point(this.zoom, this.zoom);
	}

	render() {
		this._renderer.render(this._container);
	}
}
