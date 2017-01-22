/* globals DTile, dtileTilemap */

window.DTile = window.DTile || {};

window.DTile.Group = class {
	constructor(name = "Group", children = []) {
		this.name = name;

		this.children = children.map(c => {
			if (c.children) return new DTile.Group(c.name, c.children);
			else return c;
		});
	}

	getOutlined() {
		return this.children.map(child => {
			if (child instanceof DTile.Group) {
				return { name: child.name, children: child.getOutlined() };
			} else {
				return { name: child.name };
			}
		});
	}

	findChildIndex(name) {
		return this.children.findIndex(child => child.name === name);
	}
};

window.DTile.Project = class extends DTile.Group {
	constructor(name = "Project", children, tilesets = [], maps = []) {
		super(name, children);

		this.tilesets = tilesets.map(tileset => new dtileTilemap.TileSet(tileset));
		this.maps = maps.map(map => new dtileTilemap.TileMap(map));
	}

	// `where` is an array with parent names. This function returns splice changed (with path).
	addMap(map, where) {
		let path = "children";

		const findGroup = (i, currentChild) => {
			const childName = where[i];
			const childIndex = currentChild.findChildIndex(childName);
			const child = currentChild.children[childIndex];

			path += `.${childIndex}.children`;

			if (i === where.length - 1) return child;
			else return findGroup(i + 1, child);
		};

		const targetGroup = where ? findGroup(0, this) : this;
		const changedIndex = targetGroup.children.length;
		targetGroup.children.push({ name: map.name });

		const modifiedMap = new dtileTilemap.TileMap(map);
		modifiedMap.tilesets = this.tilesets;
		this.maps.push(modifiedMap);

		return {
			path, index: changedIndex, addedCount: 1, removed: [],
			object: targetGroup.children, type: "splice"
		};
	}

	getMap(mapName) {
		return this.maps.find(map => map.name === mapName);
	}
};
