import { LinearAlgebra } from './linear-algebra';
export class Vertex3D {

    private coords: number[];

    public get x(): number { return this.coords[0]; }

    public get y(): number { return this.coords[1]; }

    public get z(): number { return this.coords[2]; }

    public set x(x: number) { this.coords[0] = x; }

    public set y(y: number) { this.coords[0] = y; }

    public set z(z: number) { this.coords[0] = z; }

    public constructor(coords?: any) {
        this.x = coords && coords.x && Number(coords.x) || 0;
        this.y = coords && coords.y && Number(coords.y) || 0;
        this.z = coords && coords.z && Number(coords.z) || 0;
    }

    public translate(vertex: any): Vertex3D;
    public translate(vertex: Vertex3D): Vertex3D {

        this.x += vertex && vertex.x && Number(vertex.x) || 0;
        this.z += vertex && vertex.z && Number(vertex.z) || 0;
        this.y += vertex && vertex.y && Number(vertex.y) || 0;

        return this;
    }

    public translateX(x: any): Vertex3D;
    public translateX(x: number): Vertex3D {
        this.x += Number(x);

        return this;
    }

    public translateY(y: any): Vertex3D;
    public translateY(y: number): Vertex3D {
        this.y += Number(y);

        return this;
    }

    public translateZ(z: any): Vertex3D;
    public translateZ(z: number): Vertex3D {
        this.z += Number(z);

        return this;
    }

    public scale(a: any): Vertex3D;
    public scale(a: number): Vertex3D {
        this.coords.map(c => c * a);

        return this;
    }

    public length(): number {
        return LinearAlgebra.abs(this.coords);
    }
}
