/* globals Tool */
const DOUBLE_CLICK_DELAY = 300;

window.ObjectTool = class extends Tool {
	constructor() {
		super();

		this.dragging = false;
		this.currentObject = null;
		this.pointerOffset = null;
		this.startPosition = null;

		this.lastPressTimestamp = null;
	}

	move({ localPosition, getObjectInfoAt, setCursor }) {
		if (this.dragging) return;

		const info = getObjectInfoAt(localPosition.x, localPosition.y);
		if (info) {
			setCursor("move");
			this.currentObject = info.object;
		} else {
			setCursor("auto");
			this.currentObject = null;
		}
	}

	tap({ localPosition, openPropertiesFor, getObjectInfoAt }) {
		const currentTimestamp = performance.now();
		if (this.lastPressTimestamp) {
			if (currentTimestamp - this.lastPressTimestamp < DOUBLE_CLICK_DELAY) {
				const info = getObjectInfoAt(localPosition.x, localPosition.y);
				if (info) {
					openPropertiesFor([info.object]);
				}
			}
		}
		this.lastPressTimestamp = currentTimestamp;
	}

	track({ localPosition, tilePosition, preciseTilePosition, getObjectInfoAt, state, ctrlKey, shiftKey }) {
		if (state === "start") {
			if (this.currentObject) {
				this.dragging = true;
				this.pointerOffset = {
					x: preciseTilePosition.x - this.currentObject.x,
					y: preciseTilePosition.y - this.currentObject.y
				};
				this.startPosition = {
					x: this.currentObject.x, y: this.currentObject.y
				};
			}
		} else if (state === "track") {
			if (!this.dragging) return;

			// Snap to grid if shift is pressed
			const position = shiftKey ? tilePosition : preciseTilePosition;

			const offset = shiftKey ? { x: 0, y: 0 } : this.pointerOffset;
			const setX = () => (this.currentObject.x = position.x - offset.x);
			const setY = () => (this.currentObject.y = position.y - offset.y);

			if (ctrlKey) {
				// Move along a single axis
				if (Math.abs(this.startPosition.x - position.x) >
					Math.abs(this.startPosition.y - position.y)) {
					setX();
					this.currentObject.y = this.startPosition.y;
				} else {
					setY();
					this.currentObject.x = this.startPosition.x;
				}
			} else {
				// Move freely
				setX();
				setY();
			}

			return ["objects"];
		} else if (state === "end") {
			this.dragging = false;

			return ["map", "objects"];
		}
	}
};
