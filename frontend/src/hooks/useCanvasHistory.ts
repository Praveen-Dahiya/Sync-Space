import { useState, useCallback } from 'react';

const useCanvasHistory = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const [history, setHistory] = useState<HTMLImageElement[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveCanvasState = useCallback(() => {
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
  }, [canvasRef, historyIndex]);

  return { history, historyIndex, setHistoryIndex, saveCanvasState };
};

export default useCanvasHistory;