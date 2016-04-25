import React from "react";

import { Button } from "../guiComponents.jsx";

export default class AboutDialog extends React.Component {
	render() {
		return (
			<form onSubmit={ this.props.close }>
				<h2 className="primary">About DTile</h2>
				<p>
					DTile is a simple tilemap editor without clutter. Its aim
					is to be as easy to use with minimal configuration while
					still not compromising on features. It was made mostly by
					@magnontobi over at <a href="https://magnon.net">Magnon</a>.
					All source code is available on { " " }
					<a href="https://github.com/theMagnon/DTile">GitHub</a>, so
					feel free to help us out with making DTile the best tilemap
					editor out there by submitting issues and pull requests!
					<br /><br />
					Thank you for using DTile! :D
				</p>
				<Button text="Close" onClick={ this.props.close } />
			</form>
		)
	}
}
