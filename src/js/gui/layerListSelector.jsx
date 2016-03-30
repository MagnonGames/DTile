import React from "react";

import { ListSelector, FooterToolbar, ImageButton } from "./guiComponents.jsx";

import AddLayerDialog from "./dialogs/addLayerDialog.jsx";

export default class LayerListSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			items: [],
			selectedIndex: 0
		}

		this.listeners = [];

		this._sendChange(0);
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

		this._sendChange(selectedIndex);
	}

	getItem(content) {
		return this.state.items.indexOf(content);
	}

	clear() {
		this._updateState([], 0);
	}

	on(event, callback) {
		this.listeners.push({ event, callback });
	}

	render() {
		return (
			<div>
				<ListSelector name="mapLayerSelector" reverse
					items={ this.state.items }
					selectedIndex={ this.state.selectedIndex }
					onSelect={ index => { this.select(index); } } />
				<FooterToolbar>
					<ImageButton imageURL="../images/plus.svg" title="Add Layer"
					 	id="addLayerButton"
						onClick={
							e => this.props.gui.openDialog(AddLayerDialog)
						} />
				</FooterToolbar>
			</div>
		);
	}

	_sendChange(selectedIndex) {
		this.listeners.map(listener => {
			if (listener.event == "change") {
				listener.callback(selectedIndex);
			}
		});
	}
}
