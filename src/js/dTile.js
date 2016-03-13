import Tileset from "./render/tileset.js";
import Editor from "./editor.js";
import TilesetSelector from "./render/tilesetSelector.js";

import GUI from "./gui.js";

const DTILE_VERSION = require("../../package.json").version;

export default class DTile {
	constructor(mainRenderContainer, tilesetRenderContainer) {
		PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

		this.tilesets = [];

		this.tilesets.push(new Tileset("tileset", "./images/hello.png", 16, 16, 0, 0));
		this.tilesets[0].once("loaded", function() {
			this.editor.renderer.update();
			this.editor.renderer.render();
			this.tilesetSelector.changeTileset(this.tilesets[0]);
		}.bind(this));

		this.editor = new Editor(
			window.innerWidth, window.innerHeight, this.tilesets
		);

		mainRenderContainer.appendChild(this.editor.getElement());

		this.tilesetSelector = new TilesetSelector(350, 300);
		tilesetRenderContainer.appendChild(this.tilesetSelector.getRenderer());
		this.tilesetSelector.on("selected", function(e) {
			this.editor.selectedTiles = e;
		}.bind(this));

		GUI.listenTo("fileUploader", "change", function() {
			let reader = new FileReader();
			reader.onload = function(e) {
				console.log(reader.result);
				this.editor.maps.push(JSON.parse(reader.result));
				this.editor.setCurrentMap(1);
			}.bind(this);
			reader.readAsText(this.files[0]);
		}.bind(this));

		console.log("Started DTile version " + DTILE_VERSION);
	}

	resize(width, height) {
		this.editor.resize(width, height);
		this.editor.renderer.render();
	}
}
