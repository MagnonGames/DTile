import FillAction from "../action/fillAction.js";

export default class Fill {
	constructor(editor) {
		this.name = "fill";

		this._editor = editor;
	}

	click(e) {
		let tilePos = this._editor.renderer.unprojectToTile({ x: e.x, y: e.y });
		this._editor.getCurrentActionLog().add(new FillAction(
			tilePos.x,
			tilePos.y,
			this._editor.currentLayerId,
			this._editor.selectedTiles
		));

		this._editor.renderer.update();
		this._editor.renderer.render();
	}
}
