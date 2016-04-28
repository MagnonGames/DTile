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

	dTileJSON(map) {
		return JSON.stringify(map, function(key, value) {
			if (key.indexOf("_") == 0) {
				return undefined;
			}
			return value;
		});
	}
}

export default (new Exporter());
