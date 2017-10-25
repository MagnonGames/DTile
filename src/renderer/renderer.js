import {
    WebGLRenderer, OrthographicCamera, Scene, Vector2, Vector3, BoxGeometry,
    MeshBasicMaterial, Mesh, Raycaster
} from "../../node_modules/three/build/three.module.js";

import { RenderLayer } from "./tilelayer.js";
import { RenderTileset } from "./tileset.js";
import { RenderMapObject } from "./mapObject.js";

import { tilesUpdated, resetTilesUpdated } from "./tile.js";

import { cmp, deepEql } from "./utils.js";

export const CAMERA_UNIT = 10;
export const TILE_BASE_SIZE = 16;

let testing = false;

export class Renderer {
    static enableTesting() {
        testing = true;
        console.info("[dtile-three-renderer] Testing mode enabled; WebGL will not be used.");
    }

    constructor(canvas, alpha, backdrop) {
        this._canvas = canvas;
        if (!testing) {
            this.renderer = new WebGLRenderer({
                canvas,
                alpha
            });
        }
        this.camera = new OrthographicCamera(0, CAMERA_UNIT, 0, CAMERA_UNIT, 0.1, CAMERA_UNIT * 10);
        this.camera.position.setZ(CAMERA_UNIT);
        this.scene = new Scene();

        this.tileSize = new Vector2(0, 0);

        this.debugMode = false;
        this.runProfile = false;

        this._sizeChanged = true;

        this._layers = [];
        this._tilesets = [];
        this._objects = [];

        this._backdropEnabled = backdrop;

        this._raycaster = new Raycaster();

        this.scene = new Scene();

        this.update();
    }

    get width() {
        return this._currentWidth;
    }

    get height() {
        return this._currentHeight;
    }

    get backdropEnabled() {
        return this._backdropEnabled;
    }

    set backdropEnabled(enabled) {
        this._backdropEnabled = enabled;

        if (enabled) {
            this._generateBackdrop();
        } else {
            this.scene.remove(this._baseMesh);
            this._baseMesh = null;
        }
    }

    set outlineEnabled(enabled) {
        this._layers.forEach((layer, i) => {
            layer.showOutline = enabled && i === this._layers.length - 1;
        });
    }

    update(shouldUpdate = ["size", "camera"]) {
        if (this.debugMode && this.runProfile) console.profile("Update: " + shouldUpdate.join(", "));

        for (let toUpdate of shouldUpdate) {
            if (toUpdate === "size") {
                this._updateCanvasSize();
                this._updateSize(this.width, this.height);
            } else if (toUpdate === "camera") {
                this.camera.updateProjectionMatrix();
            } else if (toUpdate === "tiles") {
                this._layers.forEach((layer, i) => layer.update(this.map.layers[i]));
            } else if (toUpdate === "objects") {
                this._updateObjects();
            } else {
                console.error("Unknown update action: " + toUpdate);
            }
        }

        this.render();

        if (this.debugMode && this.runProfile) console.profileEnd();
    }

    render() {
        if (testing) return;
        if (this.debugMode) console.time("Render Time");
        this.renderer.render(this.scene, this.camera);

        if (this.debugMode) {
            this.printDebugInfo("Render Time");
        }
    }

    updateMap(map) {
        this._previousMap = this.map || {};
        this.map = map;

        const sizeChanged = !cmp(this.map, this._previousMap, ["width", "height"]);
        const tileSizeChanged = !cmp(this.map, this._previousMap, ["tileWidth", "tileHeight"]);

        const layersChanged = !this._previousMap.layers ||
            this.map.layers.length !== this._previousMap.layers.length;

        if (tileSizeChanged) {
            const tileSize = new Vector2(map.tileWidth, map.tileHeight);
            const maxTileSize = Math.max(tileSize.x, tileSize.y);
            tileSize.divideScalar(maxTileSize).multiplyScalar(TILE_BASE_SIZE);
            this.tileSize = tileSize;
        }

        if (this._backdropEnabled && sizeChanged) this._generateBackdrop();

        const shouldGenerateLayers = layersChanged || sizeChanged;
        if (shouldGenerateLayers) this._generateLayers();

        this._layers.forEach((layer, i) => {
            if (shouldGenerateLayers || tileSizeChanged || layer !== this._previousMap.layers[i]) {
                layer.update(this.map.layers[i]);
            }
        });

        this._updateObjects();

        this.render();
    }

    updateTilesets(tilesets) {
        if (deepEql(tilesets, this._tilesetInformations)) return;
        this._tilesetInformations = tilesets;
        this.loadTilesets();
    }

    loadTilesets() {
        this._tilesets = {};
        Object.keys(this._tilesetInformations).forEach(tilesetId => {
            const tilesetInfo = this._tilesetInformations[tilesetId];
            return RenderTileset.load(tilesetInfo, this).then(renderTileset => {
                this._tilesets[tilesetId] = renderTileset;
                this._layers.forEach((layer, i) => layer.update(this.map.layers[i]));
                this.render();
            });
        });
    }

    getTileset(id) {
        return this._tilesets[id];
    }

    unprojectToTilePosition(position, includeDecimals) {
        const normalizedPosition = this._normalizePosition(position);

        normalizedPosition.unproject(this.camera);
        normalizedPosition.divide(new Vector3(this.tileSize.x, this.tileSize.y, 1));

        const tilePosition = new Vector2(normalizedPosition.x, normalizedPosition.y);
        if (!includeDecimals) {
            tilePosition.set(Math.floor(tilePosition.x), Math.floor(tilePosition.y));
        }

        return tilePosition;
    }

    getObjectInformationAtMouse(mousePosition) {
        const normalizedPosition = this._normalizePosition(mousePosition);

        this._raycaster.setFromCamera(normalizedPosition, this.camera);
        const intersects = this._raycaster.intersectObjects(this._objects);

        if (intersects.length <= 0) return null;

        const intersection = intersects[0];
        const position = intersection.point
            .sub(intersection.object.getWorldPosition()) // Local position
            .divide(new Vector3(this.tileSize.x, this.tileSize.y, 1)); // Tile position
        return {
            object: intersection.object.mapObject,
            position
        };
    }

    getLayer(index) {
        return this._layers[index];
    }

    setGhosts(ghostArray) {
        this._layers.forEach((layer, i) => {
            layer.setGhosts(ghostArray[i]);
        });
    }

    _normalizePosition(position) {
        const normalizedPosition = new Vector3();
        normalizedPosition.x = (position.x / this.width) * 2 - 1;
        normalizedPosition.y = -(position.y / this.height) * 2 + 1;
        normalizedPosition.z = 0;

        return normalizedPosition;
    }

    _generateBackdrop() {
        const width = this.tileSize.x * this.map.width;
        const height = this.tileSize.y * this.map.height;

        const baseGeometry = new BoxGeometry(width, height, 1);
        const baseMaterial = new MeshBasicMaterial({ color: 0x212121 });
        this.scene.remove(this._baseMesh);
        this._baseMesh = new Mesh(baseGeometry, baseMaterial);
        this._baseMesh.translateX(width / 2);
        this._baseMesh.translateY(height / 2);
        this.scene.add(this._baseMesh);
    }

    _updateCanvasSize() {
        this._currentWidth = this._canvas.offsetWidth;
        this._currentHeight = this._canvas.offsetHeight;
    }

    _updateSize(width, height) {
        if (!testing) {
            this.renderer.setSize(width, height);
        } else {
            this._canvas.style.width = width;
            this._canvas.style.height = height;
            this._canvas.width = width;
            this._canvas.height = height;
        }
        this.camera.right = width / height * CAMERA_UNIT;
    }

    _generateLayers() {
        this._layers.forEach(layer => {
            this.scene.remove(layer);
        });

        this._layers = this.map.layers.map(layer => {
            const renderLayer = new RenderLayer(this);
            this.scene.add(renderLayer);
            return renderLayer;
        });
    }

    _updateObjects() {
        this._objects.forEach(object => {
            this.scene.remove(object);
        });
        this._objects = [];

        if (!this.map.objects) return;

        this._objects = this.map.objects.map((object, i) => {
            const renderMapObject = new RenderMapObject(this, object);
            this.scene.add(renderMapObject);
            return renderMapObject;
        });
    }

    printDebugInfo(consoleTimer) {
        console.group("Render info");
        console.log(`
            Draw Calls: ${this.renderer.info.render.calls}
            Vertex Count: ${this.renderer.info.render.vertices}
            Face Count: ${this.renderer.info.render.faces}
            ---
            Textures Count: ${this.renderer.info.memory.textures}
            Shader Program Count: ${this.renderer.info.programs.length}
            ---
            Tiles Updated: ${tilesUpdated}
        `.replace(/[ ]{2,}/g, "").trim());
        if (consoleTimer) {
            console.log("---");
            console.timeEnd(consoleTimer);
        }
        console.groupEnd();

        resetTilesUpdated();
    }
}
