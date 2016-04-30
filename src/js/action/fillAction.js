import TilingAction from "./tilingAction.js";

export default class FillAction extends TilingAction {
	constructor(x, y, layerId, tileArea) {
		super(x, y, layerId, tileArea, true);

		this.x = x;
		this.y = y;
		this.layerId = layerId;
	}

	apply(map) {
		let getTile = map.tileLayers[this.layerId].getTile
				.bind(map.tileLayers[this.layerId]),
			fillId = getTile(this.x, this.y).id,
			seeds = [{ x: this.x, y: this.y }];

		let testSeed = (x, y, verticalModifier) => {
			if (y + verticalModifier >= 0 &&
				getTile(x, y + verticalModifier).id == fillId) {
				if (x <= 0
					|| getTile(x - 1, y + verticalModifier).id != fillId
					|| getTile(x - 1, y).id != fillId) {
					seeds.push({
						x: x, y: y + verticalModifier
					});
				}
			}
		}

		do {
			let seed = seeds[0],
				x = seed.x,
				y = seed.y;

			if (getTile(x, y).id != fillId) {
				seeds.splice(0, 1);
				continue;
			}

			do {
				this.applyTile(x, y, map);
				testSeed(x, y, 1);
				testSeed(x, y, -1);
				x++;
			} while (x < map.width && getTile(x, y).id == fillId);

			x = seed.x;
			y = seed.y;
			while (x > 0 && getTile(x - 1, y).id == fillId) {
				x--;
				this.applyTile(x, y, map);
				testSeed(x, y, 1);
				testSeed(x, y, -1);
			}

			seeds.splice(0, 1);
			super.apply(map);
		} while (seeds.length > 0);
	}
}
