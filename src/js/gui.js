export default class GUI {
	static prepareMultiselectors() {
		let selectors = document.querySelectorAll(
			".multiSelector"
		);

		for (let i = 0; i < selectors.length; i++) {
			let values = selectors[i].children;
			for (let j = 0; j < values.length; j++) {
				values[j].addEventListener("click", function() {
					for (let k = 0; k < values.length; k++) {
						values[k].classList.remove("selected");
					}
					values[j].classList.add("selected");
				});
			}
		}
	}

	static prepareContainers() {
		let selectors = document.querySelectorAll(
			".container .title.contractible"
		);

		for (let i = 0; i < selectors.length; i++) {
			let item = selectors[i];
			item.addEventListener("click", function() {
				if (item.parentNode.classList.contains("contracted")) {
					item.parentNode.classList.remove("contracted");
				} else {
					item.parentNode.classList.add("contracted");
				}
			});
		}
	}

	static fixInputs() {
		let inputs = document.body.getElementsByClassName("textInput");
		for (let i = 0; i < inputs.length; i++) {
			inputs[i].children[0].setAttribute("required", "");
		}
	}

	static setElementContent(id, value) {
		document.getElementById(id).innerHTML = value;
	}

	static listenTo(elementId, event, callback) {
		document.getElementById(elementId).addEventListener(event, callback);
	}
}

export class Dialog {
	constructor(title, content) {
		this.element = document.createElement("div");
		this.element.className = "card dialog";
		let titleElement = document.createElement("h2");
		titleElement.className = "primary";
		titleElement.innerHTML = title;
		this.element.appendChild(titleElement);

		for (let item of content) {
			let elementToAdd;
			if (item.type == "text") {
				elementToAdd = document.createElement("p");
				elementToAdd.innerHTML = item.content;
			} else if (item.type == "textInput") {
				let container = document.createElement("div"),
					input = document.createElement("input"),
					label = document.createElement("label"),
					uid = (0 | Math.random() * 9e6).toString(36);
				container.className = "textInput";
				input.type = "text";
				input.name = item.name;
				input.id = uid;
				input.setAttribute("required", "");
				label.innerHTML = item.label;
				label.for = uid;
				container.appendChild(input);
				container.appendChild(label);
				elementToAdd = container;
			} else if (item.type == "button") {
				elementToAdd = document.createElement("span");
				elementToAdd.className = "button";
				elementToAdd.innerHTML = item.content;
				elementToAdd.addEventListener("click", function() {
					let resp = {};
					let wander = function(parentElemet) {
						for (let i = 0; i < parentElemet.children.length; i++) {
							let childElement = parentElemet.children[i];
							if (childElement.tagName == "INPUT") {
								resp[childElement.name] = childElement.value;
							} else if (childElement.children.length > 0) {
								wander(childElement);
							}
						}
					};
					wander(this.element);
					item.callback(resp);
				}.bind(this));
			}
			this.element.appendChild(elementToAdd);
		}

		this.container = document.createElement("span");
		this.container.className = "dialogContainer";
		this.container.appendChild(this.element);
		document.body.appendChild(this.container);
		window.setTimeout(function() {
			this.container.style.opacity = 1;
		}.bind(this), 10);
	}

	dispose() {
		this.container.style.opacity = 0;
		window.setTimeout(function() {
			document.body.removeChild(this.container);
		}.bind(this), 300);
	}

	_fire(event, params) {
		if (this._listeners) {
			for (let i = 0; i < this._listeners.length; i++) {
				if (this._listeners[i].event == event) {
					this._listeners[i].callback(params);
					this._listeners.splice(
						this._listeners.indexOf(this._listeners[i]), 1
					);
				}
			}
		}
	}

	once(event, callback) {
		if (!this._listeners) this._listeners = [];
		this._listeners.push({
			event: event,
			callback: callback
		});
	}
}

export class ListSelectorManager {
	constructor(list) {
		this.list = list;
	}

	addItem(content) {
		let item = document.createElement("span");
		item.innerHTML = content;
		item.addEventListener("click", function() {
			this.select(item);
		}.bind(this));
		this.list.appendChild(item);
	}

	select(item) {
		for (let i = 0; i < this.list.children.length; i++) {
			this.list.children[i].classList.remove("selected");
		}
		item.classList.add("selected");
		this._fire("change", {
			item: item,
			value: item.innerHTML
		});
	}

	getItem(content) {
		for (let i = 0; i < this.list.children.length; i++) {
			let item = this.list.children[i];
			if (item.innerHTML == content) {
				return item;
			}
		}
		return null;
	}

	clear() {
		while (this.list.firstChild) {
			this.list.removeChild(this.list.firstChild);
		}
	}

	_fire(event, params) {
		if (this._listeners) {
			for (let i = 0; i < this._listeners.length; i++) {
				if (this._listeners[i].event == event) {
					this._listeners[i].callback(params);
				}
			}
		}
	}

	on(event, callback) {
		if (!this._listeners) this._listeners = [];
		this._listeners.push({
			event: event,
			callback: callback
		});
	}
}

document.addEventListener("DOMContentLoaded", function() {
	GUI.prepareMultiselectors();
	GUI.prepareContainers();
	GUI.fixInputs();
});
