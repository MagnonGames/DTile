export default class Selection extends PIXI.Graphics {
	constructor(tileWidth, tileHeight, color, alpha) {
		super();

		this.tileWidth = tileWidth;
		this.tileHeight = tileHeight;
		this.color = color;
		this.alpha = alpha ? alpha : 1;

		this.reset();
	}

	reset() {
		this.selected = [];
	}

	static get SELECTION() { return 0; }
	static get ADD_SELECTION() { return 1; }
	static get REMOVE_SELECTION() { return 2; }

	// WARNING: add and remove selection UNTESTED!
	// TODO: Test and implement add and remove selection.
	select(x, y, width, height, operation) {
		switch(operation) {
			case 0:
				this.reset();
				this.setSelected(x, y, width, height, true);
				break;
			case 1:
				this.setSelected(x, y, width, height, true);
				break;
			case 2:
				this.setSelected(x, y, width, height, false);
				break;
		}
	}

	setSelected(x, y, width, height, selected) {
		if (width < 0) {
			width *= -1;
			x -= width;
		}
		if (height < 0) {
			height *= -1;
			y -= height;
		}
		let changed = [];
		for (let tile of this.selected) {
			if (tile.x >= x && tile.x <= x + width) {
				if (tile.y >= y && tile.y <= y + height) {
					tile.selected = false;
					changed.push(tile.x + "," + tile.y);
				}
			}
		}
		if (selected) {
			for (let xs = x; xs < x + width; xs++) {
				for (let ys = y; ys < y + height; ys++) {
					if (changed.indexOf(xs + "," + ys) == -1) {
						this.selected.push({
							x: xs,
							y: ys,
							selected: true
						});
					}
				}
			}
		}
	}

	update() {
		super.clear();
		for (let tile of this.selected) {
			super.beginFill(this.color, this.alpha);
			super.drawRect(
				tile.x * this.tileWidth,
				tile.y * this.tileHeight,
				this.tileWidth,
				this.tileHeight
			);
			super.endFill();
		}
	}
}
