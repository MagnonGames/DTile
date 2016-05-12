import filesaver from "filesaver.js";

import Map from "./map/map.js";
import InputManager from "./input.js";
import { PositionedTile, TileSelection } from "./selectionUtils.js";
import MapRenderer from "./render/mapRenderer.js";

import tools, { ToolManager } from "./tool/tools.js";

import ActionLog from "./action/actionLog.js";

import { PubSub, Events } from "./event/pubSub.js";

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

		this.toolManager = new ToolManager("pen", this);

		PubSub.subscribe(Events.ADD_LAYER, this.addLayerToCurrentMap.bind(this));

		PubSub.subscribe(Events.UNDO_REQUESTED, () => {
			this.getCurrentActionLog().undoPrevious();
			this.renderer.update();
			this.renderer.render();
		});
		PubSub.subscribe(Events.REDO_REQUESTED, () => {
			this.getCurrentActionLog().restoreForward();
			this.renderer.update();
			this.renderer.render();
		});

		PubSub.subscribe(Events.TILESET_TILES_SELECTED, function(e) {
			this.selectedTiles = e;
		}.bind(this));

		this.tool = "pen";
		PubSub.subscribe(Events.TOOL_SELECTED, tool => {
			this.tool = tool
		});

		this.inputManager = new InputManager(this.renderer.getRenderer(), true);
		this.inputManager.on("click", e => {
			this.toolManager.fireClick(e);
			this._getFocus();
		});
		this.inputManager.on("drag", e => {
			this.toolManager.fireDrag(e);
			this._getFocus();
		});
		this.inputManager.on("up", e => {
			this.toolManager.fireUp(e);
		});
		this.inputManager.on("scroll", function(e) {
			if (!e.alt) { // Scroll
				this.renderer.offset.x += e.x / this.renderer.zoom;
				this.renderer.offset.y += e.y / this.renderer.zoom;
			} else { // Zoom
				this.renderer.zoom += -e.y / (500 / this.renderer.zoom);
			}

			this.renderer.update();
			this.renderer.render();
			this._getFocus();
		}.bind(this));
		this.inputManager.on("move", function(e) {

		}.bind(this));
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
		let occurrences = 0, foundSame = false, stripNumberRegExp = / \(\d+\)/,
			testMatchingLayerRegExp = new RegExp(
			   name.replace(stripNumberRegExp, "") + "( \(\d+\))?"
		   );

		for (let layer of this.getCurrentMap().tileLayers) {
			if (testMatchingLayerRegExp.test(layer.name)) {
				occurrences++
			}

			// To not allow manually naming a layer to a numbered layer that
			// already exist.
			if (layer.name == name) {
				foundSame = true;
			}
		}
		if (foundSame) {
			name = name.replace(stripNumberRegExp, "");
		}
		name += (occurrences > 0 ? " (" + occurrences + ")" : "");

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
		console.log("blur");
		document.activeElement.blur();
	}

	getElement() {
		return this.renderer.getRenderer();
	}

	resize(width, height) {
		this.renderer.updateSize(width, height);
	}
}
