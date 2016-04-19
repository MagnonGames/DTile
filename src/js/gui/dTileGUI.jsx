import ReactDOM from "react-dom";
import React from "react";

import * as Components from "./guiComponents.jsx";
import LayerListSelector from "./layerListSelector.jsx";
import { DialogContainer } from "./dialogs/dialog.jsx";

import PubSub from "../event/pubSub.js";
import Events from "../event/events.js";

export default class GUI {
	constructor(dTile) {
		this.dTile = dTile;
	}

	openDialog(dialog) {
		this.dialogContainer.openDialog(dialog);
	}

	render() {
		ReactDOM.render((
			<div>
				<div id="renderContainer"
					ref={ ref => this.mainRenderContainer = ref } />
				<SidebarCard gui={ this } ref={ ref => this.sidebarCard = ref } />
				<DialogContainer ref={ ref => this.dialogContainer = ref } />
			</div>
		), document.getElementById("app"));
	}
}

class SidebarCard extends React.Component {
	render() {
		return (
			<Components.Card id="mainCard">
				<div className="primary" id="topBar">
					<h1>DTile</h1>
					<div className="icons">
						<Components.IconButton onClick={ () => {
							PubSub.publish(Events.UNDO_REQUESTED);
						} } icon="undo" />
						<Components.IconButton onClick={ () => {
							PubSub.publish(Events.REDO_REQUESTED);
						} } icon="redo" />
						<Components.IconButton icon="applicationMenu" />
					</div>
				</div>
				<Components.MultiSelector
					values={ [ "Pen", "Fill", "Select" ] }
					defaultSelected="0" />
				<hr />
				<Components.TextInput name="mapName" label="Map Name" />
				<Components.Container title="Layers" contractible>
					<LayerListSelector ref={ ref => this.layerListSelector = ref } />
				</Components.Container>
				<Components.Container title="Tileset" contractible>
					<div id="tilesetSelectorContainer"
						ref={ ref => this.tilesetRenderContainer = ref }>
					</div>
				</Components.Container>
			</Components.Card>
		);
	}
}
