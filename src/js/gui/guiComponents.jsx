import React from "react";

const iconMap = require("./icon/materialIconMap.json");

export class Card extends React.Component {
	render() {
		return (
			<div className="card" id={ this.props.id }>
				{ this.props.children }
			</div>
		);
	}
}

export class CardTitle extends React.Component {
	render() {
		return (
			<h1 className="primary">{ this.props.children }</h1>
		);
	}
}

export class MultiSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedIndex: props.defaultSelected
		};
	}

	changeSelectedIndex(index) {
		this.setState({
			selectedIndex: index
		});
	}

	render() {
		return (
			<div className="multiSelector">{
				this.props.values.map((value, index) => { return (
					<span key={ index } className={
						index == this.state.selectedIndex ? "selected" : ""
					} onClick={ e => this.changeSelectedIndex(index) }>
						{ this.props.useIcons
							? <Icon iconName={ value } />
							: value
						}
					</span>
				)})
			}</div>
		);
	}
}

export class TextInput extends React.Component {
	render() {
		return (
			<div className="textInput">
				<input id={ this.props.name } type="text" autoComplete={
						this.props.autocomplete ? this.props.autocomplete : "off"
					} required onChange={ this.props.onChange }
					value={ this.props.value } />
				<label htmlFor={ this.props.name }>{ this.props.label }</label>
			</div>
		);
	}
}

export class Container extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			contracted: false
		};
	}

	handleClick() {
		if (this.props.contractible) {
			this.setState({
				contracted: !this.state.contracted
			});
		}
	}

	render() {
		let contracted = this.state.contracted ? " contracted" : "",
			contractible = this.props.contractible ? " contractible" : "";

		return (
			<div className={ "container" + contracted }>
				<span className={ "top" + contractible }
						onClick={ e => this.handleClick() }>
					<Icon iconName={
						this.state.contracted ? "expandArrow" : "contractArrow"
					} />
					<span className="title">
						{ this.props.title }
					</span>
				</span>
				{ this.props.children }
			</div>
		);
	}
}

export class ListSelector extends React.Component {
	handleClick(index) {
		this.props.onSelect(index);
	}

	render() {
		return (
			<div className="listSelector">{
				this._getListItems(this.props.reverse)
			}</div>
		);
	}

	_getListItems(reverse) {
		let item = (index, text) => {
			return (
				<ListItem key={ index } text={ text }
					selected={ this.props.selectedIndex == index }
					onClick={ () => { this.handleClick(index); } } />
			);
		}

		let items = [];

		// This should probably be simplified to somthing nicer, although I
		// couldn't manage to come up with something better atm. -- magnontobi
		if (reverse) {
			for (let i = this.props.items.length - 1; i >= 0; i--) {
				items.push(item(i, this.props.items[i]));
			}
		} else {
			for (let i = 0; i < this.props.items.length; i++) {
				items.push(item(i, this.props.items[i]));
			}
		}

		return items;
	}
}

class ListItem extends React.Component {
	render() {
		let selected = this.props.selected ? "selected" : "";

		return (
			<span className={ selected }
				onClick={ this.props.onClick }>
				{ this.props.text }
			</span>
		);
	}
}

export class FooterToolbar extends React.Component {
	render() {
		return (
			<div className="toolbar">
				{ this.props.children }
			</div>
		);
	}
}

export class IconButton extends React.Component {
	render() {
		return (
			<span className="iconButton" title={ this.props.tooltip }
				onClick={ e => this.props.onClick(e) }
				id={ this.props.id }>
				<Icon iconName={ this.props.icon } />
			</span>
		);
	}
}

class Icon extends React.Component {
	render() {
		return (
			<i className={ "icon " + (this.props.light ? "light" : "dark") }>
				{ iconMap[this.props.iconName] }
			</i>
		)
	}
}

export class Button extends React.Component {
	_onClick(e) {
		if (!this.props.disabled) {
			this.props.onClick(e);
		}
	}

	render() {
		return (
			<span className={ "button" + (this.props.disabled ? " disabled" : "") }
				onClick={ e => this._onClick(e) }>
				{ this.props.text }
			</span>
		)
	}
}

export class ContextMenu extends React.Component {
	render() {
		return (
			<div className="contextMenu" onClick={ e => {
				e.stopPropagation();
			} }>
				{ this.props.children }
			</div>
		);
	}
}

export class ContextMenuEntry extends React.Component {
	render() {
		return (
			<div className="entry" onClick={ e => this.props.onClick(e) }>
				{ this.props.children }
			</div>
		);
	}
}
