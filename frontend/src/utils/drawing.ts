// import { ToolType, Point, Shape } from '../types';

type DrawElement = Point | Shape;

export enum ToolType {
  Draw = 'draw',
  Erase = 'erase',
  Rectangle = 'rectangle',
  Circle = 'circle',
  Square = 'square',
  Line = 'line',
  Text = 'text'
}

export interface Point {
  x: number;
  y: number;
  color: string;
  lineWidth: number;
  type: ToolType;
}

export interface Shape extends Point {
  width: number;
  height: number;
  text?: string;
  fontSize?: number;
}

export const drawPoints = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  elements: DrawElement[]
) => {
  console.log('Draw this -->', elements);
  
  const canvas = canvasRef.current;
  if (!canvas || elements.length === 0) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const isShape = (element: DrawElement): element is Shape => {
    return [
      ToolType.Rectangle,
      ToolType.Circle,
      ToolType.Square,
      ToolType.Line,
      ToolType.Text
    ].includes(element.type);
  };

  // Handle continuous line drawing (Draw/Erase)
  if (!isShape(elements[0])) {
    const points = elements as Point[];
    if (points.length < 2) return;

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (const point of points.slice(1)) {
      context.lineTo(point.x, point.y);
      context.strokeStyle = point.type === ToolType.Erase ? '#ffffff' : point.color;
      context.lineWidth = point.lineWidth;
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }

    context.stroke();
    return;
  }

  // Handle shapes
  for (const element of elements) {
    if (!isShape(element)) continue;

    context.beginPath();
    context.strokeStyle = element.color;
    context.lineWidth = element.lineWidth;

    switch (element.type) {
      case ToolType.Rectangle:
        context.rect(element.x, element.y, element.width, element.height);
        context.stroke();
        break;

      case ToolType.Square:
        { const size = Math.min(Math.abs(element.width), Math.abs(element.height));
        context.rect(
          element.x,
          element.y,
          size * Math.sign(element.width),
          size * Math.sign(element.height)
        );
        context.stroke();
        break; }

      case ToolType.Circle:
        { const radius = Math.sqrt(
          Math.pow(element.width, 2) + Math.pow(element.height, 2)
        ) / 2;
        context.arc(element.x + element.width / 2, element.y + element.height / 2, radius, 0, 2 * Math.PI);
        context.stroke();
        break; }

      case ToolType.Line:
        context.moveTo(element.x, element.y);
        context.lineTo(element.x + element.width, element.y + element.height);
        context.stroke();
        break;

      case ToolType.Text:
        if (element.text) {
          context.font = `${element.fontSize || 20}px Arial`;
          context.fillStyle = element.color;
          context.fillText(element.text, element.x, element.y);
        }
        break;
    }
  }
};