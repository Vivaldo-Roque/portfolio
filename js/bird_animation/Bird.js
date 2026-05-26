import * as THREE from 'three';

class Bird extends THREE.BufferGeometry {
    constructor() {
        super();

        var vertices = new Float32Array([
            5, 0, 0,
            -5, -2, 1,
            -5, 0, 0,
            -5, -2, -1,
            0, 2, -6,
            0, 2, 6,
            2, 0, 0,
            -3, 0, 0
        ]);

        var indices = [
            0, 2, 1,
            4, 7, 6,
            5, 6, 7
        ];

        var position = new THREE.BufferAttribute(vertices, 3);
        position.setUsage(THREE.DynamicDrawUsage);

        this.setAttribute('position', position);
        this.setIndex(indices);
        this.computeVertexNormals();
    }
}

export { Bird };
