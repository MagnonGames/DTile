import React from "react";

import { Button } from "../guiComponents.jsx";

import PubSub from "../../event/pubSub.js";
import Events from "../../event/events.js";

export default class AboutDialog extends React.Component {
	openMentions() {
		PubSub.publish(Events.OPEN_DIALOG, MentionsDialog);
	}

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
				<div className="actionButtonContainer">
					<Button text="These people / projects are awesome"
						onClick={ this.openMentions } />
					<Button text="Close" onClick={ this.props.close } />
				</div>
			</form>
		);
	}
}

class MentionsDialog extends React.Component {
	render() {
		return (
			<form onSubmit={ this.props.close }>
				<h2 className="primary">Awesome People & Projects</h2>
				<p>
					DTile uses a whole bunch of projects for various things.
					We would like to thank all of the creators of these
					awesome projects!
				</p>
				<ul>
					<li>
						<a href="https://facebook.github.io/react/" target="_blank">
							React
						</a> by <a href="https://www.facebook.com/" target="_blank">
							Facebook
						</a>
					</li>
					<li>
						<a href="http://www.pixijs.com/" target="_blank">
							Pixi.js
						</a> by <a href="http://www.goodboydigital.com/" target="_blank">
							GoodBoy
						</a>
					</li>
					<li>
						<a href="https://github.com/eligrey/FileSaver.js" target="_blank">
							Filesaver.js
						</a> by <a href="https://eligrey.com/" target="_blank">
							Eli Grey
						</a>
					</li>
					<li>
						<a href="https://design.google.com/icons/" target="_blank">
							Material Icons
						</a> by <a href="https://www.google.com/" target="_blank">
							Google
						</a>
					</li>
				</ul>
				<div className="actionButtonContainer">
					<Button text="Close" onClick={ this.props.close } />
				</div>
			</form>
		);
	}
}
