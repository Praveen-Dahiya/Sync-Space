import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { drawPoints } from '../utils/drawing';
import notifyUserJoined from '../utils/notifications/userJoined';
import UndoButton from '../components/UndoButton';
import { Point, ToolType } from '../types';
import 'react-toastify/dist/ReactToastify.css';
import { onDraw, emitDraw, onUserConnected, emitUserConnected, removeSocketListeners } from '../utils/socket/socket';
import { FaPencilAlt, FaEraser, FaSquare, FaCircle, FaVectorSquare, FaSlash, FaFont } from 'react-icons/fa';

interface ShapePoint extends Point {
  width?: number;
  height?: number;
  endX?: number;
  endY?: number;
  text?: string;
  fontSize?: number;
}

const Canvas = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null) as React.RefObject<HTMLCanvasElement>;
  const textInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [fontSize, setFontSize] = useState(20);
  const [tool, setTool] = useState<ToolType>(ToolType.Draw);
  const [history, setHistory] = useState<HTMLImageElement[]>([]);
  const [currentStroke, setCurrentStroke] = useState<ShapePoint[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [baseCanvasState, setBaseCanvasState] = useState<ImageData | null>(null);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
     
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    
    updateCanvasSize();

   
    window.addEventListener('resize', updateCanvasSize);

    
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      removeSocketListeners();
    };
  }, []);

  const drawShape = (element: ShapePoint) => {
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
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);

    if (tool === ToolType.Text) {
      setTextPosition({ x: offsetX, y: offsetY });
      if (textInputRef.current) {
        textInputRef.current.style.left = `${offsetX}px`;
        textInputRef.current.style.top = `${offsetY}px`;
        textInputRef.current.style.display = 'block';
        textInputRef.current.focus();
      }
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
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === ToolType.Text) return;

    const { offsetX, offsetY } = e.nativeEvent;
    
    if (startPoint && baseCanvasState && 
        [ToolType.Rectangle, ToolType.Circle, ToolType.Square, ToolType.Line].includes(tool)) {
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
    } else if (tool === ToolType.Draw || tool === ToolType.Erase) {
      const newPoint: Point = { x: offsetX, y: offsetY, color, lineWidth, type: tool };
      setCurrentStroke((prev) => {
        const updatedStroke = [...prev, newPoint];
        drawPoints(canvasRef, updatedStroke);
        return updatedStroke;
      });
    }
  };
  
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStroke.length > 0) {
      emitDraw(currentStroke);
      saveCanvasState();
    }
    
    setBaseCanvasState(null);
    setStartPoint(null);
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = new Image();
    image.src = canvas.toDataURL();
    
    image.onload = () => {
      setHistory((prev) => {
        const newHistory = [...prev.slice(0, historyIndex + 1), image];
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    };
  };

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))]">
      <div className="flex flex-col gap-4 p-4 bg-white shadow-md">
        <button onClick={() => setTool(ToolType.Draw)} className={`flex flex-col items-center p-2 rounded ${tool === ToolType.Draw ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <FaPencilAlt color={tool === ToolType.Draw ? 'white' : 'black'} />
        </button>
        <button onClick={() => setTool(ToolType.Erase)} className={`flex flex-col items-center p-2 rounded ${tool === ToolType.Erase ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <FaEraser color={tool === ToolType.Erase ? 'white' : 'black'} />
        </button>
        <button onClick={() => setTool(ToolType.Rectangle)} className={`flex flex-col items-center p-2 rounded ${tool === ToolType.Rectangle ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <FaVectorSquare color={tool === ToolType.Rectangle ? 'white' : 'black'} />
        </button>
        <button onClick={() => setTool(ToolType.Circle)} className={`flex flex-col items-center p-2 rounded ${tool === ToolType.Circle ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <FaCircle color={tool === ToolType.Circle ? 'white' : 'black'} />
        </button>
        <button onClick={() => setTool(ToolType.Square)} className={`flex flex-col items-center p-2 rounded ${tool === ToolType.Square ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <FaSquare color={tool === ToolType.Square ? 'white' : 'black'} />
        </button>
        <button onClick={() => setTool(ToolType.Line)} className={`flex flex-col items-center p-2 rounded ${tool === ToolType.Line ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <FaSlash color={tool === ToolType.Line ? 'white' : 'black'} />
        </button>
        <button onClick={() => setTool(ToolType.Text)} className={`flex flex-col items-center p-2 rounded ${tool === ToolType.Text ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <FaFont color={tool === ToolType.Text ? 'white' : 'black'} />
        </button>
        
        <UndoButton
          canvasRef={canvasRef}
          history={history}
          historyIndex={historyIndex}
          setHistoryIndex={setHistoryIndex}
        />
        
        <input type='color' value={color} onChange={(e) => setColor(e.target.value)} className='w-10 h-10' />
        <div className='flex flex-col items-center'>
          <input 
            type='range' 
            min='1' 
            max='20' 
            value={lineWidth} 
            onChange={(e) => setLineWidth(parseInt(e.target.value))} 
            className='h-32 w-8'
            style={{ writingMode: 'bt-lr', transform: 'rotate(-180deg)' }}
            title="Line Width" 
          />
          {tool === ToolType.Text && (
            <input 
              type='range' 
              min='12' 
              max='48' 
              value={fontSize} 
              onChange={(e) => setFontSize(parseInt(e.target.value))} 
              className='h-32 w-8 mt-4'
              style={{ writingMode: 'bt-lr', transform: 'rotate(-180deg)' }}
              title="Font Size" 
            />
          )}
        </div>
      </div>
      
      <div ref={containerRef} className="relative flex-1 p-4">
        <ToastContainer />
        <canvas 
          ref={canvasRef}
          className='border border-gray-300 w-full h-full'
          onMouseDown={startDrawing} 
          onMouseMove={draw} 
          onMouseUp={stopDrawing} 
          onMouseLeave={stopDrawing} 
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
        />
      </div>
    </div>
  );
};

export default Canvas;