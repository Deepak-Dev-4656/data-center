import React, { useRef, useState, useEffect } from "react";
import {
  Paintbrush,
  Trash,
  Eraser,
  Undo,
  Redo,
  Circle,
  Square,
  Save,
  X,
  ZoomIn,
  ZoomOut,
  Crop,
  Text,
  RefreshCcw
} from "lucide-react";

const DrawingCanvas = () => {
  const canvasRef = useRef(null);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#000000");
  const [opacity, setOpacity] = useState(1);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [shape, setShape] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");

  // Save canvas state to history
  const saveHistory = () => {
    const canvas = canvasRef.current;
    setHistory((prev) => [...prev, canvas.toDataURL()]);
    setRedoStack([]);
  };

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    if (textMode) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.globalAlpha = opacity;
      ctx.font = `${brushSize * 2}px Arial`;
      ctx.fillStyle = brushColor;
      ctx.fillText(
        textInput,
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      );
      setTextInput("");
      setTextMode(false);
      saveHistory();
      return;
    }
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || shape || textMode) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = isEraser ? "#FFFFFF" : brushColor;
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = opacity;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const handleMouseUp = (e) => {
    if (shape) drawShape(e);
    setIsMouseDown(false);
    if (!textMode) saveHistory();
  };

  const drawShape = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.fillStyle = brushColor;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.globalAlpha = opacity;

    switch (shape) {
      case "circle":
        ctx.beginPath();
        ctx.arc(offsetX, offsetY, brushSize * 5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "square":
        ctx.fillRect(
          offsetX - brushSize * 5,
          offsetY - brushSize * 5,
          brushSize * 10,
          brushSize * 10
        );
        break;
      default:
        break;
    }
  };

  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveHistory();
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    const previousState = history.pop();
    setRedoStack((prev) => [...prev, canvasRef.current.toDataURL()]);
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack.pop();
    setHistory((prev) => [...prev, canvasRef.current.toDataURL()]);
    const img = new Image();
    img.src = nextState;
    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const zoomCanvas = (factor) => setZoom((prevZoom) => Math.max(0.5, prevZoom + factor));

  const resetZoom = () => setZoom(1);

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "z") undo();
    if (e.ctrlKey && e.key === "y") redo();
    if (e.ctrlKey && e.key === "k") clearCanvas();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, redoStack]);

  return (
    <div className="relative w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg flex items-center gap-4 z-20">
        <Paintbrush className="w-6 h-6 text-gray-700" />
        <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24 cursor-pointer" />
        
        <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className="w-10 h-10 rounded-full border cursor-pointer" />
        
        <button onClick={clearCanvas} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"><Trash className="w-5 h-5" /></button>
        
        <button onClick={undo} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"><Undo className="w-5 h-5" /></button>
        
        <button onClick={redo} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"><Redo className="w-5 h-5" /></button>
        
        <button onClick={() => setShape("circle")} className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"><Circle className="w-5 h-5" /></button>
        
        <button onClick={() => setShape("square")} className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"><Square className="w-5 h-5" /></button>
        
        <button onClick={() => zoomCanvas(0.1)} className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"><ZoomIn className="w-5 h-5" /></button>
        
        <button onClick={() => zoomCanvas(-0.1)} className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"><ZoomOut className="w-5 h-5" /></button>
        
        <button onClick={resetZoom} className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"><RefreshCcw className="w-5 h-5" /></button>
        
        <button onClick={() => setTextMode(!textMode)} className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"><Text className="w-5 h-5" /></button>
        
        <button onClick={saveCanvas} className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"><Save className="w-5 h-5" /></button>
      </div>

      {textMode && (
        <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Enter text" className="absolute top-20 left-1/2 transform -translate-x-1/2 p-2 border rounded-lg shadow-lg" />
      )}

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="bg-white absolute top-0 left-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default DrawingCanvas;
