import PaintAction from "../action/paintAction.js";
import DragPaintAction from "../action/dragPaintAction.js";

export default class Pen {
	constructor(editor) {
		this.name = "pen";

		this._editor = editor;
		this._dragging = false;
	}

	click(e) {
		let { x, y } = this._editor.renderer.unprojectToTile({
			x: e.x, y: e.y
		});

		this._editor.getCurrentActionLog().add(new PaintAction(
			this._editor.getCurrentLayer().getTilesFromArea(
				x, y,
				this._editor.selectedTiles.width,
				this._editor.selectedTiles.height
			),
			this._editor.selectedTiles,
			this._editor.currentLayerId,
			x, y
		));
		
		this._editor.renderer.update();
		this._editor.renderer.render();
	}

	drag(e) {
		let { x, y } = this._editor.renderer.unprojectToTile({
			x: e.x, y: e.y
		});

		if (!this._dragging) {
			this._editor.getCurrentActionLog().add(new DragPaintAction(
				x, y,
				this._editor.currentLayerId,
				this._editor.selectedTiles
			));

			this._dragging = true;
		}

		this._editor.getCurrentActionLog().getCurrentAction().applyTile(
			x, y, this._editor.getCurrentMap()
		);

		if (this._editor.getCurrentActionLog().getCurrentAction().needsUpdate) {
			this._editor.getCurrentActionLog().applyCurrent();
			this._editor.renderer.update();
			this._editor.renderer.render();
		}
	}

	up(e) {
		if (this._dragging) {
			this._dragging = false;
			this._editor.renderer.update();
			this._editor.renderer.render();
		}
	}
}
