import { Vector2 } from "../types";

export function randomInitFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function calculateAngle(point1Coord: Vector2, point2Coord: Vector2) {
    const xDist = point2Coord.x - point1Coord.x;
    const yDist = point2Coord.y - point1Coord.y;

    // console.log(xDist)
    return Math.atan2(yDist, xDist)
}

export function randomColor(colors: string[]) {
    return colors[Math.floor(Math.random() * colors.length)]
}

export function getDistance(x1: number, y1: number, x2: number, y2: number) {
    const xDist = x2 - x1
    const yDist = y2 - y1

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

