import {
    WebGLRenderer, OrthographicCamera, Scene, Group, Vector3, Ray
} from "../../node_modules/three/build/three.module.js";

import MapRenderer from "./map-renderer.js";
import Tileset from "./tileset.js";

let testing = false;

export class Renderer {
    static enableTesting() {
        testing = true;
        console.info("[dtile-renderer] Testing mode enabled; WebGL will not be used.");
    }

    constructor(canvas) {
        this._canvas = canvas;
        if (!testing) {
            this.renderer = new WebGLRenderer({
                canvas,
                alpha: true
            });
        }
        this.camera = new OrthographicCamera(-0.5, 0.5, -0.5, 0.5, 0.1, 1000);
        this.camera.position.z = -100;
        this.camera.rotation.y = Math.PI;
        this.camera.rotation.z = Math.PI;
        this.scene = new Scene();

        this._mapSceneGroup = new Group();
        this.scene.add(this._mapSceneGroup);

        this.debugMode = false;
        this.runProfile = false;

        this._tilesets = [];
        this._mapRenderer = new MapRenderer(this.tilesets, this._mapSceneGroup);
    }

    async updateMap(map) {
        if (
            !this._map ||
            this._map.width !== map.width ||
            this._map.height !== map.height
        ) {
            this._mapRenderer.map = map;
        }

        this._map = map;
    }

    async updateTilesets(tilesets) {
        this._tilesets = {};
        await Promise.all(Object.entries(tilesets).map(async ([id, tileset]) => {
            this._tilesets[id] = await Tileset.load(tileset);
        }));
        this._mapRenderer.tilesets = this._tilesets;
    }

    getTileXY(layer, mouseX, mouseY) {
        const ray = (() => {
            if (this.camera.isOrthographicCamera) {
                const position = this._screenToWorldPosition(mouseX, mouseY);
                const direction = this.camera.getWorldDirection();
                direction.z = -direction.z;

                return new Ray(position, direction);
            } else {
                console.warn("This type of camera is not supported for raycasting");
            }
        })();

        return this._mapRenderer.castRayOnLayer(layer, ray);
    }

    render() {
        if (testing) return;
        if (this.debugMode) console.time("Render Time");
        this.renderer.render(this.scene, this.camera);

        if (this.debugMode) {
            this.printDebugInfo("Render Time");
        }
    }

    updateRendererSize(width, height) {
        if (!testing) {
            this.renderer.setSize(width, height);
        }
        const a = width / height;
        this.camera.left = -a / 2;
        this.camera.right = a / 2;
        this.camera.updateProjectionMatrix();

        this._width = width;
        this._height = height;
    }

    _screenToWorldPosition(sx, sy) {
        const screen3D = new Vector3();
        screen3D.x = (sx / this._width) * 2 - 1;
        screen3D.y = -(sy / this._height) * 2 + 1;
        screen3D.z = 1.0;

        screen3D.unproject(this.camera);

        return screen3D;
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
        `.replace(/[ ]{2,}/g, "").trim());
        if (consoleTimer) {
            console.log("---");
            console.timeEnd(consoleTimer);
        }
        console.groupEnd();
    }
}
