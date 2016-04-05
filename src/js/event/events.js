// When creating events, name them with all CAPS separated with underscores.
// Example: AMAZING_MAP_CREATED
//
// The value of the event should be a very short description on when the event
// is fired.
// Example: "when an awesome map was created"

export default {
	TILESET_LOADED: "tileset is loaded",
	TILESET_TILES_SELECTED: "tiles are selected in tileset selector",

	// GUI Events
	LAYER_SELECTED: "a new layer was selected",
	ADD_LAYER: "a new layer was requested to be added",
	OPEN_DIALOG: "a request to open a dialog was made",

	UNDO_REQUESTED: "undo action was requested",
	REDO_REQUESTED: "redo action was requested"
}
