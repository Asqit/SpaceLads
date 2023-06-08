/**
 * Class representing 2D vector for use in cartesian grid.
 * `Vector2D` contains helpful static methods for manipulation
 * with vectors.
 */
export class Vector2D {
	public y: number;
	public x: number;

	constructor(x?: number, y?: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
	}

	public distanceTo(target: Vector2D): number {
		const xDifferences = this.x - target.x;
		const yDifferences = this.y - target.y;

		return Math.sqrt(xDifferences * xDifferences + yDifferences * yDifferences);
	}

	// Static Methods -------------------------------------------------->

	public static getDistanceBetween(a: Vector2D, b: Vector2D): number {
		const x = a.x - b.x;
		const y = a.y - b.y;

		return Math.sqrt(x * x + y * y);
	}

	public static sumVectors(a: Vector2D, b: Vector2D) {
		return new Vector2D(a.x + b.x, a.y + b.y);
	}

	public static sumVectorArray(vectors: Vector2D[]) {
		const LENGTH = vectors.length - 1;
		const endResult = new Vector2D();

		for (let i = 0; i < LENGTH; i++) {
			endResult.x += vectors[i].x;
			endResult.y += vectors[i].y;
		}

		return endResult;
	}

	public static substrVectors(a: Vector2D, b: Vector2D) {
		return new Vector2D(a.x - b.x, a.y - b.y);
	}

	public static substrVectorArray(vectors: Vector2D[]) {
		const LENGTH = vectors.length - 1;
		const endResult = new Vector2D();

		for (let i = 0; i < LENGTH; i++) {
			endResult.x -= vectors[i].x;
			endResult.y -= vectors[i].y;
		}

		return endResult;
	}

	public static getNegateVector(vector: Vector2D) {
		return new Vector2D(-Math.abs(vector.x), -Math.abs(vector.y));
	}

	public static getScaledVector(vector: Vector2D, scalar: number) {
		return new Vector2D(vector.x * scalar, vector.y * scalar);
	}

	public static getDividedVector(vector: Vector2D, divisor: number) {
		return new Vector2D(vector.x / divisor, vector.y / divisor);
	}

	public static getVectorLength(vector: Vector2D) {
		return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
	}

	public static getUnitVector(vector: Vector2D) {
		const LENGTH = this.getVectorLength(vector);

		if (0 < LENGTH) {
			return this.getDividedVector(vector, LENGTH);
		}

		return vector;
	}
}

export class Rectangle {
	public x: number;
	public y: number;
	public w: number;
	public h: number;

	constructor(x?: number, y?: number, w?: number, h?: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
		this.w = w ?? 10;
		this.h = h ?? 10;
	}
}

export class AngledRectangle extends Rectangle {
	public angle: number;

	constructor(x = 0, y = 0, w = 4, h = 4, angle = 0) {
		super(x, y, w, h);
		this.angle = angle;
	}
}

export class Line {
	public base: Vector2D;
	public direction: Vector2D;

	constructor(base?: Vector2D, direction?: Vector2D) {
		this.base = base ?? new Vector2D();
		this.direction = direction ?? new Vector2D();
	}
}

export class LineSegment {
	public a: Vector2D;
	public b: Vector2D;

	constructor(a?: Vector2D, b?: Vector2D) {
		this.a = a ?? new Vector2D();
		this.b = b ?? new Vector2D();
	}
}

export class Circle {
	public position: Vector2D;
	public radius: number;

	constructor(position?: Vector2D, radius?: number) {
		this.position = position ?? new Vector2D();
		this.radius = radius ?? 0;
	}
}

export class Maths {
	public static readonly NULL_VECTOR = new Vector2D(0, 0);

	public static rand(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	public static randInt(min: number, max: number) {
		return Math.floor(this.rand(min, max));
	}

	public static randElement<T>(array: T[]) {
		return array[this.randInt(0, array.length)];
	}

	public static randBool() {
		return this.randElement([true, false]);
	}

	public static isNumberBetween(n: number, min: number, max: number) {
		return n >= min && n <= max;
	}

	public static degreeToRadian(degree: number) {
		return (degree * Math.PI) / 180;
	}

	public static clamp(n: number, min: number, max: number) {
		return Math.max(min, Math.min(max, n));
	}

	public static deepFloatCmp(a: number, b: number) {
		let threshold = 1.0 / 8192.0;
		return Math.abs(a - b) < threshold;
	}
}
