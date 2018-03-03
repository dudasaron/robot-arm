
export class LinearAlgebra {

    public static scalar(vector_1: number[], vector_2: number[]): number {
        if (vector_1.length !== vector_2.length) {
            throw new RangeError('Array lengths does not match!');
        }
        let result = 0;
        for (let i = 0; i < vector_1.length; ++i) { result += vector_1[i] * vector_2[i]; }
        return result;
    }

    public static cross(vactor_1: number[], vector_2: number[]): number[] {
        if (vactor_1.length !== 3 || vector_2.length !== 3) {
            throw new RangeError('Array lengths must be 3!');
        }
        return [
             (vactor_1[1] * vector_2[2] - vactor_1[2]  * vector_2[1]),
            -(vactor_1[0] * vector_2[2] - vactor_1[2]  * vector_2[0]),
             (vactor_1[0] * vector_2[1] - vactor_1[1]  * vector_2[0])
        ];
    }

    public static abs(vector: number[]): number {
        const summer = (accumulator, val) => accumulator + val * val;
        return Math.abs(Math.sqrt(vector.reduce(summer)));
    }
}