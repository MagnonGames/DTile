import { TextureLoader, NearestFilter, Vector2 } from "../../node_modules/three/build/three.module.js";

export class RenderTileset {
    constructor(tileset, texture, renderer) {
        this._tileset = tileset;
        this.texture = texture;

        this._renderer = renderer;
    }

    static load(tileset, renderer) {
        const resolveTexture = (resolve, texture) => {
            texture.name = `Tileset ${tileset.name}`;
            texture.magFilter = texture.minFilter = NearestFilter;
            texture.generateMipmaps = false;
            resolve(new RenderTileset(tileset, texture, renderer));
        };

        if (tileset.tilesetType === "ortho") {
            return new Promise((resolve, reject) => {
                const texture = new TextureLoader().load(tileset.url, () => {
                    resolveTexture(resolve, texture);
                }, undefined, e => {
                    reject(e);
                });
            });
        } else if (tileset.tilesetType === "test") {
            return new Promise((resolve, reject) => {
                const testTileset = generateTestImage(
                    tileset.name || "a",
                    25, 25,
                    tileset.tileWidth, tileset.tileHeight
                );

                const texture = new TextureLoader().load(testTileset, () => {
                    resolveTexture(resolve, texture);
                }, undefined, e => {
                    reject(e);
                });
            });
        } else {
            console.error(`Unknown tileset type ${tileset.tilesetType}`);
        }
    }

    getTileUvs(id) {
        if (id === -1) {
            const v = new Vector2(-1, -1);
            return makeTrisFromQuad([v, v, v, v]);
        }

        const array = [];

        const tileWidth = this._tileset.tileWidth,
            tileHeight = this._tileset.tileHeight,
            textureWidth = this.texture.image.width,
            textureHeight = this.texture.image.height,
            width = textureWidth / tileWidth,
            y = Math.floor(id / width),
            x = Math.floor(id - y * width);

        for (let ly = y; ly < y + 2; ly++) {
            for (let lx = x; lx < x + 2; lx++) {
                array.push(new Vector2(
                    lx * tileWidth / textureWidth,
                    ly * tileHeight / textureHeight * -1 + 1
                ));
            }
        }

        return makeTrisFromQuad(array);
    }
}

function makeTrisFromQuad(quad) {
    return [
        [quad[0], quad[2], quad[1]],
        [quad[2], quad[3], quad[1]]
    ];
}

function generateTestImage(seed, width, height, tileWidth, tileHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = width * tileWidth;
    canvas.height = height * tileHeight;
    const context = canvas.getContext("2d");

    randomSeed = seed.split("").reduce((acc, string) => acc + string.charCodeAt(0), 0);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            context.fillStyle = "#" + ("000000" +
                (Math.floor(random() * 0xffffff))).substr(-6);
            context.fillRect(
                x * tileWidth, y * tileHeight,
                (x + 1) * tileWidth, (y + 1) * tileHeight
            );
        }
    }

    return canvas.toDataURL();
}

let randomSeed = 0;

function random() {
    const x = Math.sin(randomSeed++) * 10000;
    return x - Math.floor(x);
}
