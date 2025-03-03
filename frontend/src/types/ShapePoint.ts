import { Point } from './Point';

export interface ShapePoint extends Point {
    width?: number;
    height?: number;
    endX?: number;
    endY?: number;
    text?: string;
    fontSize?: number;
}