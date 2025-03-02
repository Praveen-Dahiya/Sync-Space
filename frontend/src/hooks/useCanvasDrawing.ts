// File: hooks/useCanvasDrawing.ts
import { useCallback } from 'react';
import { ToolType } from '../types';
import { ShapePoint } from '../pages/Canvas';

const useCanvasDrawing = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const drawShape = useCallback((element: ShapePoint) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.beginPath();
    context.strokeStyle = element.color;
    context.lineWidth = element.lineWidth;

    switch (element.type) {
      case ToolType.Rectangle:
        if (element.width && element.height) {
          context.strokeRect(element.x, element.y, element.width, element.height);
        }
        break;
      case ToolType.Circle:
        if (element.endX !== undefined && element.endY !== undefined) {
          const radius = Math.sqrt(
            Math.pow(element.endX - element.x, 2) +
            Math.pow(element.endY - element.y, 2)
          );
          context.arc(element.x, element.y, radius, 0, 2 * Math.PI);
          context.stroke();
        }
        break;
      case ToolType.Square:
        if (element.endX !== undefined && element.endY !== undefined) {
          const size = Math.min(
            Math.abs(element.endX - element.x),
            Math.abs(element.endY - element.y)
          );
          context.strokeRect(
            element.x,
            element.y,
            size * Math.sign(element.endX - element.x),
            size * Math.sign(element.endY - element.y)
          );
        }
        break;
      case ToolType.Line:
        if (element.endX !== undefined && element.endY !== undefined) {
          context.moveTo(element.x, element.y);
          context.lineTo(element.endX, element.endY);
          context.stroke();
        }
        break;
      case ToolType.Text:
        if (element.text) {
          context.font = `${element.fontSize}px Arial`;
          context.fillStyle = element.color;
          context.fillText(element.text, element.x, element.y);
        }
        break;
    }
  }, [canvasRef]);

  return { drawShape };
};

export default useCanvasDrawing;

