import * as algebra from './algebra.js';

export default class Vertex3d {

    //#coords = [0, 0, 0];

    get x() { return this.coords[0]; }

    get y() { return this.coords[1]; }

    get z() { return this.coords[2]; }

    set x(x) { this.coords[0] = x; }

    set y(y) { this.coords[1] = y; }

    set z(z) { this.coords[2] = z; }

    constructor(coords) {
        this.coords = [0, 0, 0];
        this.x = coords && coords.x && Number(coords.x) || 0;
        this.y = coords && coords.y && Number(coords.y) || 0;
        this.z = coords && coords.z && Number(coords.z) || 0;
    }

    translate(vertex) {

        this.x += vertex && vertex.x && Number(vertex.x) || 0;
        this.z += vertex && vertex.z && Number(vertex.z) || 0;
        this.y += vertex && vertex.y && Number(vertex.y) || 0;

        return this;
    }

    translateX(x) {
        this.x += Number(x);

        return this;
    }

    translateY(y) {
        this.y += Number(y);

        return this;
    }

    translateZ(z) {
        this.z += Number(z);

        return this;
    }

    scale(a) {
        this.coords.map(c => c * a);

        return this;
    }

    length() {
        return algebra.abs(this.coords);
    }
} 
