/* Eventlist:
 *
 * click - Called on a click action
 * down - Called when a mouse button is pressed. (note: don't use to replace
 *        the click event)
 * up - Called when a mouse button is released.
 * move - Called when the mouse is moved. Can pass through
 *        overlaying elements if so desired.
 * drag - Called when the mouse is dragged. (Does not interfer with move)
 * scroll - Called when a scroll action occured.
 */

export default class InputManager {
	constructor(target, ignoreTopWhenMoving) {
		this._isMouseDown = false;
		this._mouseStart = { x: 0, y: 0 };

		this.target = target;

		let listeningElement;
		if (ignoreTopWhenMoving) {
			listeningElement = window;
			this._windowCapture = true;
		} else {
			listeningElement = this.target;
			this._windowCapture = false;
		}

		// Disable context menu to catch right-click
		this.target.addEventListener("contextmenu", function(e) {
			e.preventDefault();
			return false;
		}.bind(this));

		this.target.addEventListener("mousedown", this._mousedown.bind(this));
		listeningElement.addEventListener("mouseup", this._mouseup.bind(this));
		listeningElement.addEventListener("mousemove", this._move.bind(this));
		this.target.addEventListener("wheel", this._scroll.bind(this));
	}

	_mousedown(e) {
		this._mouseStart = this._unprojectCoords({ x: e.pageX, y: e.pageY });
		this._isMouseDown = true;
		this._fireMouseEvent("down", e);
	}

	_mouseup(e) {
		let pos = this._unprojectCoords({ x: e.pageX, y: e.pageY });
		if (this._isMouseDown) {
			// If mouse didn't move, fire click event.
			if (this._mouseStart.x == pos.x
				&& this._mouseStart.y == pos.y) {
				this._fireMouseEvent("click", e);
			}
			this._isMouseDown = false;
		}
		this._fireMouseEvent("up", e);
	}

	_drag(e) {
		this._fireMouseEvent("drag", e);
	}

	_move(e) {
		let params = this._unprojectCoords({
			x: e.pageX,
			y: e.pageY
		});
		if (this._isMouseDown) {
			params.button = e.button;
			this._fire("drag", params)
		} else {
			this._fire("move", params);
		}
	}

	_scroll(e) {
		this._fire("scroll", {
			x: e.deltaX,
			y: e.deltaY,
			alt: e.altKey || false,
			shift: e.shifyKey || false
		});
	}

	_unprojectCoords(pos) {
		if (!this._windowCapture) {
			let bounds = this.target.getBoundingClientRect();
			return {
				x: pos.x - bounds.left,
				y: pos.y - bounds.top
			};
		}
		return pos;
	}

	_fireMouseEvent(name, e) {
		let pos = this._unprojectCoords({ x: e.pageX, y: e.pageY });
		this._fire(name, {
			x: pos.x,
			y: pos.y,
			button: e.button,
			ctrl: e.ctrlKey || false,
			alt: e.altKey || false,
			shift: e.shiftKey || false
		});
	}

	_fire(event, params) {
		if (this._listeners) {
			for (let i = 0; i < this._listeners.length; i++) {
				if (this._listeners[i].event == event) {
					this._listeners[i].callback(params);
				}
			}
		}
	}

	on(event, callback) {
		if (!this._listeners) this._listeners = [];
		this._listeners.push({
			event: event,
			callback: callback
		});
	}
}
