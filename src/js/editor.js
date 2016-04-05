import filesaver from "filesaver.js";

import Map from "./map/map.js";
import InputManager from "./input.js";
import { PositionedTile, TileSelection } from "./selectionUtils.js";
import MapRenderer from "./render/mapRenderer.js";

import ActionLog from "./action/actionLog.js";
import PaintAction from "./action/paintAction.js";

import PubSub from "./event/pubSub.js";
import Events from "./event/events.js";

import GUI from "./gui/dTileGUI.jsx";

export default class Editor {
	constructor(width, height, tilesets, gui) {
		this.tilesets = tilesets;

		this.maps = [];
		this.maps.push(new Map(50, 50, 16, 16, this.tilesets));
		this.setCurrentMap(0);

		this.actionLogs = [];
		this.actionLogs.push(new ActionLog(this.maps[this.currentMapId]));

		this.layerListManager = gui.sidebarCard.layerListSelector;
		PubSub.subscribe(Events.LAYER_SELECTED, value => {
			this.setCurrentLayer(value);
		});

		this.renderer = new MapRenderer(this.getCurrentMap(), width, height, 16, 16, true); // TODO: Make modular

		this.addLayerToCurrentMap("Layer 1");

		PubSub.subscribe(Events.ADD_LAYER, this.addLayerToCurrentMap.bind(this));

		PubSub.subscribe(Events.TILESET_TILES_SELECTED, function(e) {
			this.selectedTiles = e;
		}.bind(this));

		this.inputManager = new InputManager(this.renderer.getRenderer(), true);
		this.inputManager.on("click", e => this._clickAction(e));
		this.inputManager.on("drag", e => this._clickAction(e));
		this.inputManager.on("scroll", function(e) {
			if (!e.alt) { // Scroll
				this.renderer.offset.x += e.x / this.renderer.zoom;
				this.renderer.offset.y += e.y / this.renderer.zoom;
			} else { // Zoom
				this.renderer.zoom += -e.y / (500 / this.renderer.zoom);
			}

			this.renderer.update();
			this.renderer.render();
		}.bind(this));
		this.inputManager.on("move", function(e) {

		}.bind(this));
	}

	_clickAction(e) {
		this._getFocus();

		let tilePos = this.renderer.unprojectToTile({ x: e.x, y: e.y });
		if (tilePos.x > 0 && tilePos.x < this.getCurrentMap().width &&
			tilePos.y > 0 && tilePos.y < this.getCurrentMap().height) {
			if (e.button == 1 || (e.button == 0 && e.ctrl)) {
				this.selectedTiles = new TileSelection(1, 1, [
					new PositionedTile(0, 0, this.getCurrentLayer()
						.getTile(tilePos.x, tilePos.y).tileId)
				]);
			} else if (e.button == 0) {
				this.paintAtPosition(tilePos.x, tilePos.y);
			} else if (e.button == 2) {
				this.getCurrentLayer().getTile(tilePos.x, tilePos.y)
					.setTileID(-1);
			}

			this.renderer.update();
			this.renderer.render();
		}
	}

	paintAtPosition(x, y) {
		this.getCurrentActionLog().add(new PaintAction(
			this.getCurrentLayer().getTilesFromArea(
				x, y,
				this.selectedTiles.width,
				this.selectedTiles.height
			),
			this.selectedTiles,
			this.currentLayerId,
			x, y
		));
	}

	updateLayerList() {
		this.layerListManager.clear();
		for (let i = this.getCurrentMap().tileLayers.length - 1; i >= 0; i--) {
			this.layerListManager.addItem(
				this.getCurrentMap().tileLayers[i].name
			);
		}
	}

	getCurrentActionLog() {
		return this.actionLogs[this.currentMapId];
	}

	setCurrentMap(id) {
		this.currentMapId = id;
	}

	getCurrentMap() {
		return this.maps[this.currentMapId];
	}

	setCurrentLayer(id) {
		this.currentLayerId = id;
	}

	getCurrentLayer() {
		return this.getCurrentMap().tileLayers[this.currentLayerId];
	}

	addLayerToCurrentMap(name) {
		this.getCurrentMap().createLayer(name);
		this.layerListManager.addItem(name, true);
		this.renderer.applyTiles();
	}

	saveMap() {
		let mapJson = JSON.stringify(this.getCurrentMap(), function(key, value) {
			if (key.indexOf("_") == 0) {
				return undefined;
			}
			return value;
		});

		let mapBlob = new Blob([mapJson], {type: "text/plain;charset=utf-8"});
		filesaver.saveAs(mapBlob, "DTile Map.json");
	}

	_getFocus() {
		// For now, focus doesn't seem to work on canvas for some reason
		// (chrome 47 ubuntu gnome), so the temporary fix until we get that
		// working properly is to hack focus away from everything else.
		let element = document.createElement("input");
		document.body.appendChild(element);
		element.focus();
		document.body.removeChild(element);
	}

	getElement() {
		return this.renderer.getRenderer();
	}

	resize(width, height) {
		this.renderer.updateSize(width, height);
	}
}
