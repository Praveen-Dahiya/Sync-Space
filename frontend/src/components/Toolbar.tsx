// File: components/Toolbar.tsx
import React from 'react';
import { FaPencilAlt, FaEraser, FaSquare, FaCircle, FaVectorSquare, FaSlash, FaFont } from 'react-icons/fa';
import { ToolType } from '../types';
import UndoButton from './UndoButton';

interface ToolbarProps {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
  color: string;
  setColor: (color: string) => void;
  lineWidth: number;
  setLineWidth: (width: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  history: HTMLImageElement[];
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
}

interface ToolButtonProps {
  toolType: ToolType;
  currentTool: ToolType;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({ toolType, currentTool, onClick, icon: Icon, label }) => {
  const isActive = toolType === currentTool;
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center p-2 rounded ${
        isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
      }`}
      aria-label={label}
      title={label}
    >
      <Icon color={isActive ? 'white' : 'black'} />
    </button>
  );
};

const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  fontSize,
  setFontSize,
  canvasRef,
  history,
  historyIndex,
  setHistoryIndex
}) => {
  const tools = [
    { type: ToolType.Draw, icon: FaPencilAlt, label: 'Draw' },
    { type: ToolType.Erase, icon: FaEraser, label: 'Erase' },
    { type: ToolType.Rectangle, icon: FaVectorSquare, label: 'Rectangle' },
    { type: ToolType.Circle, icon: FaCircle, label: 'Circle' },
    { type: ToolType.Square, icon: FaSquare, label: 'Square' },
    { type: ToolType.Line, icon: FaSlash, label: 'Line' },
    { type: ToolType.Text, icon: FaFont, label: 'Text' }
  ];

  return (
    <div className="flex flex-col gap-4 p-4 bg-white shadow-md">
      {tools.map((toolItem) => (
        <ToolButton
          key={toolItem.type}
          toolType={toolItem.type}
          currentTool={tool}
          onClick={() => setTool(toolItem.type)}
          icon={toolItem.icon}
          label={toolItem.label}
        />
      ))}
      
      <UndoButton
        canvasRef={canvasRef}
        history={history}
        historyIndex={historyIndex}
        setHistoryIndex={setHistoryIndex}
      />
      
      <input 
        type="color" 
        value={color} 
        onChange={(e) => setColor(e.target.value)} 
        className="w-10 h-10" 
        aria-label="Color picker"
      />

      <div className="flex flex-col items-center">
        <input 
          type="range" 
          min="1" 
          max="20" 
          value={lineWidth} 
          onChange={(e) => setLineWidth(parseInt(e.target.value))} 
          className="h-32 w-8"
          style={{ writingMode: 'bt-lr', transform: 'rotate(-180deg)' }}
          title="Line Width" 
          aria-label="Line Width"
        />
        {tool === ToolType.Text && (
          <input 
            type="range" 
            min="12" 
            max="48" 
            value={fontSize} 
            onChange={(e) => setFontSize(parseInt(e.target.value))} 
            className="h-32 w-8 mt-4"
            style={{ writingMode: 'bt-lr', transform: 'rotate(-180deg)' }}
            title="Font Size" 
            aria-label="Font Size"
          />
        )}
      </div>
    </div>
  );
};

export default Toolbar;