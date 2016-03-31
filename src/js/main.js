import DTile from "./dTile.js";

let dTile;

function start() {
	dTile = new DTile();
	window.addEventListener("resize", function() {
		dTile.resize(window.innerWidth, window.innerHeight);
	});
	window.dTile = dTile;
}

document.addEventListener("DOMContentLoaded", start);
