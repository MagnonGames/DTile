import Tileset from "./render/tileset.js";
import Editor from "./editor.js";
import TilesetSelector from "./render/tilesetSelector.js";

import PubSub from "./event/pubSub.js";
import Events from "./event/events.js";

import GUI from "./gui/dTileGUI.jsx";

const DTILE_VERSION = require("../../package.json").version;

export default class DTile {
	constructor() {
		PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

		this.gui = new GUI(this);
		this.gui.render();

		this.tilesets = [];

		PubSub.subscribe(Events.TILESET_LOADED, function(tileset) {
			this.editor.renderer.update();
			this.editor.renderer.render();
			this.tilesetSelector.changeTileset(tileset);
		}.bind(this));

		this.tilesets.push(new Tileset("tileset", "./images/hello.png", 16, 16, 0, 0));

		this.editor = new Editor(
			window.innerWidth, window.innerHeight, this.tilesets, this.gui
		);

		this.gui.mainRenderContainer.appendChild(this.editor.getElement());

		this.tilesetSelector = new TilesetSelector(350, 300);
		this.gui.sidebarCard.tilesetRenderContainer.appendChild(
			this.tilesetSelector.getRenderer()
		);
		PubSub.subscribe(Events.TILESET_TILES_SELECTED, function(e) {
			this.editor.selectedTiles = e;
		}.bind(this));

		// GUI.listenTo("fileUploader", "change", function() {
		// 	let reader = new FileReader();
		// 	reader.onload = function(e) {
		// 		console.log(reader.result);
		// 		this.editor.maps.push(JSON.parse(reader.result));
		// 		this.editor.setCurrentMap(1);
		// 	}.bind(this);
		// 	reader.readAsText(this.files[0]);
		// }.bind(this));

		console.log("Started DTile version " + DTILE_VERSION);
	}

	resize(width, height) {
		this.editor.resize(width, height);
		this.editor.renderer.render();
	}
}
