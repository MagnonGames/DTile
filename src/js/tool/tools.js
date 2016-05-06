import Pen from "./pen.js";
import Fill from "./fill.js";

import { PubSub, Events } from "../event/pubSub.js";

let tools = {}
export default tools;

export class ToolManager {
	constructor(defaultTool, editor) {
		tools = {
			pen: new Pen(editor),
			fill: new Fill(editor)
		};

		this.setTool(defaultTool);

		this.setUpListeners();
	}

	setUpListeners() {
		PubSub.subscribe(Events.TOOL_SELECTED, this.setTool.bind(this));
	}

	setTool(newToolName) {
		for (let tool in tools) {
			if (tools[tool].name == newToolName) {
				this.currentTool = tools[tool];
			}
		}
	}

	fireClick(e) {
		if (typeof this.currentTool.click != "function") return;
		this.currentTool.click(e);
	}

	fireDrag(e) {
		if (typeof this.currentTool.drag != "function") return;
		this.currentTool.drag(e);
	}

	fireUp(e) {
		if (typeof this.currentTool.up != "function") return;
		this.currentTool.up(e);
	}
}
