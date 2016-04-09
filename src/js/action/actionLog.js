export default class ActionLog {
	constructor(map) {
		this.map = map;
		this.log = [];
		this.currentIndex = -1;
	}

	add(action) {
		this.log[this.currentIndex + 1] = action;
		this.restoreForward();
	}

	// Can also be refered to as previous action. Basically, the current action
	// and the last action are essentially the same depending on how you treat
	// them.
	getCurrentAction() {
		return this.log[this.currentIndex];
	}

	undoPrevious() {
		this.getCurrentAction().undo(this.map);
		this.currentIndex--;
	}

	restoreForward() {
		this._getNextAction().apply(this.map);
		this.currentIndex++;
	}

	_getNextAction() {
		return this.log[this.currentIndex + 1];
	}
}
