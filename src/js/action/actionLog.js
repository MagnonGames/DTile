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

	undoPrevious() {
		this._getLastAction().undo(this.map);
		this.currentIndex--;
	}

	restoreForward() {
		this._getNextAction().apply(this.map);
		this.currentIndex++;
	}

	_getLastAction() {
		return this.log[this.currentIndex];
	}

	_getNextAction() {
		return this.log[this.currentIndex + 1];
	}
}
