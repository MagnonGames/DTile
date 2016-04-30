import TilingAction from "./tilingAction.js";

export default class DragPaintAction extends TilingAction {
	constructor(startX, startY, layerId, tileArea) {
		super(startX, startY, layerId, tileArea, false);
	}
}
