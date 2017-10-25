import { Geometry, BufferGeometry, BufferAttribute } from "../../node_modules/three/build/three.module.js";

/**
 * This file is totally ripped from three's internal PlaneBufferGeometry.
 * https://github.com/mrdoob/three.js/blob/dev/src/geometries/PlaneGeometry.js
 *
 * There are two reasons why I didn't reuse the existing one:
 *  1. An additional attribute is required for opacity.
 *  2. The original PlaneGeometry has Y going up. DTile is optimised for
 *     reversed y-axis operations.
 * The fist problem could have been solved without doing this, but the second
 * one couldn't. Hence, I pretty much just copied the entire thing.
 */
export class TilesBufferGeometry extends BufferGeometry {
    constructor(width, height, widthSegments, heightSegments) {
        super();

        this.type = "TilesBufferGeometry";

        this.parameters = { width, height, widthSegments, heightSegments };

        const gridX = Math.floor(widthSegments);
        const gridY = Math.floor(heightSegments);

        const gridX1 = gridX + 1;
        const gridY1 = gridY + 1;

        const segmentWidth = width / gridX;
        const segmentHeight = height / gridY;

        const vertices = new Float32Array(gridX1 * gridY1 * 3);
        const normals = new Float32Array(gridX1 * gridY1 * 3);
        const uvs = new Float32Array(gridX1 * gridY1 * 2);

        let offset = 0, offset2 = 0;

        for (let ly = 0; ly < gridY1; ly++) {
            const y = ly * segmentHeight;

            for (let lx = 0; lx < gridX1; lx++) {
                const x = lx * segmentWidth;

                vertices[offset] = x;
                vertices[offset + 1] = y;

                normals[offset + 2] = 1;

                uvs[offset2] = lx / gridX;
                uvs[offset2 + 1] = ly / gridY;

                offset += 3;
                offset2 += 2;
            }
        }
        offset = 0;

        const tooManyVerts = (vertices.length / 3) > 65535;
        const indices = new (tooManyVerts ? Uint32Array : Uint16Array)(gridX * gridY * 6);

        for (let ly = 0; ly < gridY; ly++) {
            for (let lx = 0; lx < gridX; lx++) {
                const a = lx + gridX1 * ly;
                const b = lx + gridX1 * (ly + 1);
                const c = (lx + 1) + gridX1 * (ly + 1);
                const d = (lx + 1) + gridX1 * ly;

                indices[offset] = a;
                indices[offset + 1] = b;
                indices[offset + 2] = d;

                indices[offset + 3] = b;
                indices[offset + 4] = c;
                indices[offset + 5] = d;

                offset += 6;
            }
        }

        this.setIndex(new BufferAttribute(indices, 1));
        this.addAttribute("position", new BufferAttribute(vertices, 3));
        this.addAttribute("normal", new BufferAttribute(normals, 3));
        this.addAttribute("uv", new BufferAttribute(uvs, 2));
    }
}

export class TileGeometry extends Geometry {
    constructor(width, height, widthSegments, heightSegments) {
        super();

        this.type = "TileGeometry";
        this.parameters = { width, height, widthSegments, heightSegments };

        this.fromBufferGeometry(new TilesBufferGeometry(
            width, height, widthSegments, heightSegments));
    }
}
