
export class LinearAlgebra {

    public static scalar(vector_1: number[], vector_2: number[]): number {
        if (vector_1.length !== vector_2.length) {
            throw new RangeError('Array lengths does not match!');
        }
        let result = 0;
        for (let i = 0; i < vector_1.length; ++i) { result += vector_1[i] * vector_2[i]; }
        return result;
    }

    public static cross(vector_1: number[], vector_2: number[]): number[] {
        if (vector_1.length !== 3 || vector_2.length !== 3) {
            throw new RangeError('Array lengths must be 3!');
        }
        return [
             (vector_1[1] * vector_2[2] - vector_1[2]  * vector_2[1]),
            -(vector_1[0] * vector_2[2] - vector_1[2]  * vector_2[0]),
             (vector_1[0] * vector_2[1] - vector_1[1]  * vector_2[0])
        ];
    }

    public static equals(vector_1: number[], vector_2: number[]): boolean {
        return (vector_1.length === vector_2.length) && (this.abs(this.sub(vector_1, vector_2)) === 0);
    }

    public static add(vector_1: number[], vector_2: number[]): number[] {
        const result = [];
        for (let i = 0; i < vector_1.length; ++i) {
            result[i] = vector_1[i] + vector_2[i];
        }
        return result;
    }

    public static sub(vector_1: number[], vector_2: number[]): number[] {
        const result = [];
        for (let i = 0; i < vector_1.length; ++i) {
            result[i] = vector_1[i] - vector_2[i];
        }
        return result;
    }

    public static abs(vector: number[]): number {
        const summer = (accumulator, val) => accumulator + val * val;
        return Math.abs(Math.sqrt(vector.reduce(summer, 0)));
    }

    public static scale(vector: number[], n: number): number[] {
        return vector.map(x => x * n);
    }

    public static normalize(vector: number[]): number[] {
        return this.scale(vector, 1. / this.abs(vector));
    }

    public static duplicate(vector: number[]): number[] {
        const result = [];
        for (let i = 0; i < vector.length; ++i) {
            result[i] = vector[i];
        }
        return result;
    }
}
