export function scalar(vector_1, vector_2) {
    if (vector_1.length !== vector_2.length) {
        throw new RangeError('Array lengths does not match!');
    }
    let result = 0;
    for (let i = 0; i < vector_1.length; ++i) { result += vector_1[i] * vector_2[i]; }
    return result;
}

export function cross(vector_1, vector_2) {
    if (vector_1.length !== 3 || vector_2.length !== 3) {
        throw new RangeError('Array lengths must be 3!');
    }
    return [
        (vector_1[1] * vector_2[2] - vector_1[2] * vector_2[1]),
        -(vector_1[0] * vector_2[2] - vector_1[2] * vector_2[0]),
        (vector_1[0] * vector_2[1] - vector_1[1] * vector_2[0])
    ];
}

export function equals(vector_1, vector_2) {
    return (vector_1.length === vector_2.length) && (this.abs(this.sub(vector_1, vector_2)) === 0);
}

export function add(vector_1, vector_2) {
    const result = [];
    for (let i = 0; i < vector_1.length; ++i) {
        result[i] = vector_1[i] + vector_2[i];
    }
    return result;
}

export function sub(vector_1, vector_2) {
    const result = [];
    for (let i = 0; i < vector_1.length; ++i) {
        result[i] = vector_1[i] - vector_2[i];
    }
    return result;
}

export function abs(vector) {
    const summer = (accumulator, val) => accumulator + val * val;
    return Math.abs(Math.sqrt(vector.reduce(summer, 0)));
}

export function scale(vector, n) {
    return vector.map(x => x * n);
}

export function normalize(vector) {
    return this.scale(vector, 1. / this.abs(vector));
}

export function duplicate(vector) {
    const result = [];
    for (let i = 0; i < vector.length; ++i) {
        result[i] = vector[i];
    }
    return result;
}

export function roundRadToDeg(rad) {
    return Math.round(rad * 180.0 / Math.PI) / (180.0 / Math.PI)
}

export function degToRad(deg) {
    return deg / 180.0 * Math.PI;
}