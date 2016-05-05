import React from "react";

import { ListSelector, FooterToolbar, IconButton } from "./guiComponents.jsx";

import AddLayerDialog from "./dialogs/addLayerDialog.jsx";

import { PubSub, Events } from "../event/pubSub.js";

export default class LayerListSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			selectedIndex: 0
		}

		PubSub.publish(Events.LAYER_SELECTED, 0);
	}

	addItem(content, select) {
		let itemsArray = this.state.items;
		itemsArray.push(content);

		let id = itemsArray.indexOf(content);

		this._updateState(itemsArray, id);
	}

	select(id) {
		this._updateState(undefined, id);
	}

	_updateState(items, selectedIndex) {
		selectedIndex = typeof selectedIndex != "undefined"
			? selectedIndex : this.state.selectedIndex;

		this.setState({
			items: items ? items : this.state.items,
			selectedIndex
		});

		PubSub.publish(Events.LAYER_SELECTED, selectedIndex);
	}

	getItem(content) {
		return this.state.items.indexOf(content);
	}

	clear() {
		this._updateState([], 0);
	}

	render() {
		return (
			<div>
				<ListSelector name="mapLayerSelector" reverse
					items={ this.state.items }
					selectedIndex={ this.state.selectedIndex }
					onSelect={ index => { this.select(index); } } />
				<FooterToolbar>
					<IconButton icon="add" title="Add Layer"
					 	id="addLayerButton"
						onClick={
							e => PubSub.publish(Events.OPEN_DIALOG, AddLayerDialog)
						} />
				</FooterToolbar>
			</div>
		);
	}
}
