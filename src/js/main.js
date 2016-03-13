import DTile from "./dTile.js";

let dTile;

function start() {
	dTile = new DTile(document.getElementById("renderContainer"),
		document.getElementById("tilesetSelectorContainer"));
	window.addEventListener("resize", function() {
		dTile.resize(window.innerWidth, window.innerHeight);
	});
}

document.addEventListener("DOMContentLoaded", start);
