import PubSub from "./event/pubSub.js";
import Events from "./event/events.js";

class Exporter {
	constructor() {
		PubSub.subscribe(Events.SAVE_REQUESTED, type => {
			let parser = this[type];

			if (typeof(parser) != "undefined") {
				PubSub.publish(Events.PARSE_AND_SAVE, parser);
			} else {
				console.error("Parser " + type + " was not found!");
			}
		});
	}

	/*
	 * Currently, this doesn't support multiple tilesets although that is planned
	 * for the future.
	 *
	 * You can view the file spec here:
	 * https://docs.google.com/document/d/1Ir7rhUxNcbRCfkdZw7rNOJyFTcdWUOmjvnYylzpN8O0
	 */
	dTileJSON(map) {
		let image = (() => {
			let image = map.tilesets[0].getTexture().baseTexture.source;
			console.log(image);

			let canvas = document.createElement('canvas');
	        canvas.width = image.naturalWidth;
			canvas.height = image.naturalHeight;

	        canvas.getContext('2d').drawImage(image, 0, 0);

	        return canvas.toDataURL('image/png').substring(22);
		})();

		let width = map.width,
			height = map.height,
			tileWidth = map.tileWidth,
			tileHeight = map.tileHeight,
			name = map.name;

		let tileLayers = [];
		for (let layer of map.tileLayers) {
			let tiles = [];
			for (let x = 0; x < layer.tiles.length; x++) {
				for (let y = 0; y < layer.tiles.length; y++) {
					tiles[y * width + x] = {
						id: layer.tiles[x][y].id
					};
				}
			}

			tileLayers.push({
				name: layer.name,
				tiles
			});
		}

		return JSON.stringify({
			image,
			width,
			height,
			tileWidth,
			tileHeight,
			tileLayers,
			name
		});
	}
}

export default (new Exporter());
