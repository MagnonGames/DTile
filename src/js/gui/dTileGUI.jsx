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

		this.openMenu = null;
		this.menuShown = false;

		PubSub.subscribe(Events.OPEN_CONTEXT_MENU, contextMenu => {
			this.openMenu = contextMenu.menu;
			this.menuShown = true;
			this.menuX = contextMenu.x;
			this.menuY = contextMenu.y;

			this.render();
		});
		PubSub.subscribe(Events.CLOSE_CONTEXT_MENU, () => {
			this.menuShown = false;

			this.render();
		});
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

				<div className={
					"contextMenuContainer" + (this.menuShown ? " shown" : "")
				} style={ { paddingLeft: this.menuX, paddingTop: this.menuY } }
				onClick={ () => {
					PubSub.publish(Events.CLOSE_CONTEXT_MENU);
				} }>
					<div className="animationContainer">
						{ this.openMenu }
					</div>
				</div>
			</div>
		), document.getElementById("app"));
	}
}

class SidebarCard extends React.Component {
	openTopContextMenu(x, y) {
		PubSub.publish(Events.OPEN_CONTEXT_MENU, {
			menu: <TopContextMenu />, x, y
		});
	}

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
						<Components.IconButton onClick={ e => {
							let bounds = e.target.getBoundingClientRect();
							this.openTopContextMenu(bounds.left, bounds.top);
						} } icon="applicationMenu" />
					</div>
				</div>
				<div id="mainToolbar">
					<Components.MultiSelector useIcons
						values={ [ "pen", "fill", "select" ] }
						defaultSelected="0" />
				</div>
				<hr />
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

class TopContextMenu extends React.Component {
	exportMap() {
		// TODO
	}

	openAbout() {
		// TODO
	}

	render() {
		return (
			<Components.ContextMenu>
				<Components.ContextMenuEntry onClick={ () => this.exportMap() }>
					Export Map
				</Components.ContextMenuEntry>
				<Components.ContextMenuEntry onClick={ () =>
					window.open("https://github.com/theMagnon/DTile/issues/new")
				}>
					Report a Bug
				</Components.ContextMenuEntry>
				<Components.ContextMenuEntry onClick={ () =>
					window.open("https://github.com/theMagnon/DTile")
				}>
					Source Code Available on GitHub!
				</Components.ContextMenuEntry>
				<Components.ContextMenuEntry onClick={ () => this.openAbout() }>
					About DTile
				</Components.ContextMenuEntry>
			</Components.ContextMenu>
		);
	}
}
