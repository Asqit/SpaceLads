import { Circle, Maths, Rectangle, Vector2D } from "./Math";

export class Collision {
	public static areCirclesColliding(a: Circle, b: Circle) {
		const RADIUS_SUM = a.radius + b.radius;
		const DISTANCE = Vector2D.substrVectors(a.position, b.position);

		return Vector2D.getVectorLength(DISTANCE) <= RADIUS_SUM;
	}

	public static areRectanglesColliding(a: Rectangle, b: Rectangle) {
		return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
	}

	public static arePointsColliding(a: Vector2D, b: Vector2D) {
		return Maths.deepFloatCmp(a.x, b.x) && Maths.deepFloatCmp(a.y, b.y);
	}

	public static areVectorsColliding(a: Vector2D, b: Vector2D) {
		const X_SUM = a.x === b.x;
		const Y_SUM = a.y === b.y;

		return X_SUM && Y_SUM;
	}
}
