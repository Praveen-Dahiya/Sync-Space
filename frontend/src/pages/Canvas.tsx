import { useEffect, useRef, useState, useCallback } from 'react';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { drawPoints } from '../utils/drawing';
import notifyUserJoined from '../utils/notifications/userJoined';
import { Point, ToolType } from '../types';
import 'react-toastify/dist/ReactToastify.css';
import { onDraw, emitDraw, onUserConnected, emitUserConnected, removeSocketListeners } from '../utils/socket/socket';
import Toolbar from '../components/Toolbar';
import { ShapePoint, Coordinates } from '../types';
import updateCanvasSize from '../utils/canvas/updateCanvasSize';
import { useCanvasDrawing, useCanvasHistory } from '../hooks';


const Canvas = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;
  const textInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [fontSize, setFontSize] = useState(20);
  const [tool, setTool] = useState<ToolType>(ToolType.Draw);
  const [currentStroke, setCurrentStroke] = useState<ShapePoint[]>([]);
  const [startPoint, setStartPoint] = useState<Coordinates | null>(null);
  const [baseCanvasState, setBaseCanvasState] = useState<ImageData | null>(null);
  
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<Coordinates | null>(null);
  
  const { history, historyIndex, setHistoryIndex, saveCanvasState } = useCanvasHistory(canvasRef);
  const drawShape = useCanvasDrawing(canvasRef);

  useEffect(() => {
    updateCanvasSize(canvasRef, containerRef);
    const handleResize = () => updateCanvasSize(canvasRef, containerRef);

    window.addEventListener('resize', handleResize);
    
    const canvas = canvasRef.current;
    if (canvas) {
      onDraw((receivedElements: ShapePoint[]) => {
        drawPoints(canvasRef, receivedElements);
      });

      if (location.pathname === '/canvas') {
        emitUserConnected('/canvas');
      }

      onUserConnected(() => {
        if (location.pathname === '/canvas') {
          notifyUserJoined('🚀 New User Joined: Someone joined the canvas!');
        }
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      removeSocketListeners();
    };
  }, []);

 
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);

    if (tool === ToolType.Text) {
      handleTextToolStart(offsetX, offsetY);
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      setBaseCanvasState(context.getImageData(0, 0, canvas.width, canvas.height));
      setStartPoint({ x: offsetX, y: offsetY });
    }

    if (tool === ToolType.Draw || tool === ToolType.Erase) {
      setCurrentStroke([{ x: offsetX, y: offsetY, color, lineWidth, type: tool }]);
    }
  }, [tool, color, lineWidth]);

  const handleTextToolStart = useCallback((x: number, y: number) => {
    setTextPosition({ x, y });
    if (textInputRef.current) {
      textInputRef.current.style.left = `${x}px`;
      textInputRef.current.style.top = `${y}px`;
      textInputRef.current.style.display = 'block';
      textInputRef.current.focus();
    }
    
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      setBaseCanvasState(context.getImageData(0, 0, canvas.width, canvas.height));
    }
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === ToolType.Text) return;

    const { offsetX, offsetY } = e.nativeEvent;
    
    if (startPoint && baseCanvasState && 
        [ToolType.Rectangle, ToolType.Circle, ToolType.Square, ToolType.Line].includes(tool)) {
      drawShapePreview(offsetX, offsetY);
    } else if (tool === ToolType.Draw || tool === ToolType.Erase) {
      const newPoint: Point = { x: offsetX, y: offsetY, color, lineWidth, type: tool };
      setCurrentStroke((prev) => {
        const updatedStroke = [...prev, newPoint];
        drawPoints(canvasRef, updatedStroke);
        return updatedStroke;
      });
    }
  }, [isDrawing, tool, startPoint, baseCanvasState, color, lineWidth]);

  const drawShapePreview = useCallback((offsetX: number, offsetY: number) => {
    if (!startPoint || !baseCanvasState) return;
    
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (canvas && context) {
      context.putImageData(baseCanvasState, 0, 0);
      
      const shape: ShapePoint = {
        x: startPoint.x,
        y: startPoint.y,
        endX: offsetX,
        endY: offsetY,
        color,
        lineWidth,
        type: tool,
        width: offsetX - startPoint.x,
        height: offsetY - startPoint.y
      };
      
      drawShape(shape);
      setCurrentStroke([shape]);
    }
  }, [startPoint, baseCanvasState, color, lineWidth, tool, drawShape]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke.length > 0) {
      emitDraw(currentStroke);
      saveCanvasState();
    }
    
    setBaseCanvasState(null);
    setStartPoint(null);
  }, [isDrawing, currentStroke, saveCanvasState]);

  // Text handling
  const handleTextInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value);
    
    if (textPosition && baseCanvasState) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (canvas && context) {
        context.putImageData(baseCanvasState, 0, 0);
        
        const textShape: ShapePoint = {
          x: textPosition.x,
          y: textPosition.y,
          color,
          lineWidth,
          type: ToolType.Text,
          text: e.target.value,
          fontSize
        };
        drawShape(textShape);
      }
    }
  }, [textPosition, baseCanvasState, color, lineWidth, fontSize, drawShape]);

  const handleTextInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && textPosition) {
      const textShape: ShapePoint = {
        x: textPosition.x,
        y: textPosition.y,
        color,
        lineWidth,
        type: ToolType.Text,
        text: textInput,
        fontSize
      };
      
      emitDraw([textShape]);
      saveCanvasState();
      
      setTextInput('');
      setTextPosition(null);
      if (textInputRef.current) {
        textInputRef.current.style.display = 'none';
      }
    }
  }, [textPosition, color, lineWidth, textInput, fontSize, saveCanvasState]);

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))]">
      <Toolbar 
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        fontSize={fontSize}
        setFontSize={setFontSize}
        canvasRef={canvasRef}
        history={history}
        historyIndex={historyIndex}
        setHistoryIndex={setHistoryIndex}
      />
      
      <div ref={containerRef} className="relative flex-1 p-4">
        <ToastContainer />
        <canvas 
          ref={canvasRef}
          className="border border-gray-300 w-full h-full"
          onMouseDown={startDrawing} 
          onMouseMove={draw} 
          onMouseUp={stopDrawing} 
          onMouseLeave={stopDrawing}
          aria-label="Drawing canvas"
        />
        <input
          ref={textInputRef}
          type="text"
          value={textInput}
          onChange={handleTextInput}
          onKeyDown={handleTextInputKeyDown}
          className="absolute hidden p-1 border border-gray-300"
          style={{ 
            background: 'transparent',
            color: color,
            fontSize: `${fontSize}px`
          }}
          aria-label="Text input for canvas"
        />
      </div>
    </div>
  );
};

export default Canvas;