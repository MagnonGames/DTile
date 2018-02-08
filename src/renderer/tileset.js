import {
    TextureLoader, PlaneGeometry, MeshBasicMaterial, Mesh, NearestFilter, Vector2
} from "../../node_modules/three/build/three.module.js";

export default class Tileset {
    constructor(tilesetObject, texture) {
        this.meshes = [];
        this.texture = texture;

        const imageWidth = texture.image.naturalWidth;
        const imageHeight = texture.image.naturalHeight;
        const tileWidth = tilesetObject.tileWidth;
        const tileHeight = tilesetObject.tileHeight;

        const width = Math.floor(imageWidth / tileWidth);
        const height = Math.floor(imageHeight / tileHeight);

        const img = this.texture.image;
        const canvas = document.createElement("canvas");
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        const c = canvas.getContext("2d");
        c.drawImage(img, 0, 0, imageWidth, imageHeight);

        const isTileTransparent = (id) => {
            const x = id % width * tileWidth;
            const y = id / width * tileHeight;
            const data = c.getImageData(x, y, tileWidth, tileHeight).data;
            if (id === 0) console.log(data);
            for (let i = 0; i < data.length / 4; i++) {
                const index = i * 4 + 3;
                if (data[index] !== 0) return false;
            }
            return true;
        };

        for (let i = 0; i < width * height; i++) {
            if (!isTileTransparent(i)) {
                const geometry = new PlaneGeometry(1, 1);
                geometry.faceVertexUvs = [getTileUv(i, imageWidth, imageHeight, tileWidth, tileHeight)];
                geometry.uvsNeedUpdate = true;
                const material = new MeshBasicMaterial({
                    map: this.texture,
                    transparent: true
                });

                this.meshes[i] = new Mesh(geometry, material);
            } else {
                this.meshes[i] = false;
            }
        }
    }

    static async load(tilesetObject) {
        const texture = await new Promise((resolve, reject) => {
            new TextureLoader().load(tilesetObject.url, resolve);
        });

        texture.minFilter = texture.magFilter = NearestFilter;

        return new Tileset(tilesetObject, texture);
    }
}

export function getTileUv(id, imageWidth, imageHeight, tileWidth, tileHeight) {
    const quad = [];

    const wide = Math.floor(imageWidth / tileWidth);

    const x = Math.floor(id % wide);
    const y = Math.floor(id / wide);

    for (let ly = y; ly < y + 2; ly++) {
        for (let lx = x; lx < x + 2; lx++) {
            quad.push(new Vector2(
                lx * tileWidth / imageWidth,
                ly * tileHeight / imageHeight * -1 + 1
            ));
        }
    }

    return [
        [quad[0], quad[2], quad[1]],
        [quad[2], quad[3], quad[1]]
    ];
}
