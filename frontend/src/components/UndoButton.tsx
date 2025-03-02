interface UndoButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  history: HTMLImageElement[];
  historyIndex: number;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
}

const UndoButton: React.FC<UndoButtonProps> = ({ canvasRef, history, historyIndex, setHistoryIndex }) => {
  const undo = () => {
    if (historyIndex < 0) return; 
    if(historyIndex >= history.length) {
      setHistoryIndex(history.length - 1);
    }
    const newIndex = historyIndex - 1;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear canvas and restore previous state
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(history[newIndex], 0, 0);

    // Update history index
    setHistoryIndex(newIndex);
    
  };

  return (
    <button onClick={undo} className='px-4 py-2 rounded bg-gray-200'>
      Undo
    </button>
  );
};

export default UndoButton;
