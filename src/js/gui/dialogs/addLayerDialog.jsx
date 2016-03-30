import React from "react";

import { Button, TextInput } from "../guiComponents.jsx";

export default class AddLayerDialog extends React.Component {
	constructor(props) {
		super(props);

		this.state = { layerNameText: "" };
	}

	success(e) {
		if (typeof e != "undefined") e.preventDefault();

		this.props.dTile.editor.addLayerToCurrentMap(this.state.layerNameText);
		this.props.close();
	}

	abort() {
		this.props.close();
	}

	onChange(e) {
		this.setState({ layerNameText: e.target.value });
	}

	render() {
		return (
			<form onSubmit={ e => { this.success(e); } } onsubmit="return false">
				<h2 className="primary">Add Layer</h2>
				<TextInput name="layerName" label="Layer Name"
					value={ this.state.layerNameText }
					onChange={ this.onChange.bind(this) } />
				<div className="actionButtonContainer">
					<Button onClick={ () => this.abort() } text="Cancel" />
					<Button onClick={ () => this.success() } text="Add" />
				</div>
			</form>
		);
	}
}
