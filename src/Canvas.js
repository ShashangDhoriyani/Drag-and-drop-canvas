import React, { useRef, useState, useEffect } from "react";
import "./Canvas.css";

const Canvas = () => {
  const draggableRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const [objectSize, setObjectSize] = useState({ width: 200, height: 100 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Update canvas size on window resize
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDragStart = (event) => {
    isDraggingRef.current = true;
    mouseRef.current.x = event.clientX;
    mouseRef.current.y = event.clientY;
    offsetRef.current.x = event.clientX - draggableRef.current.offsetLeft;
    offsetRef.current.y = event.clientY - draggableRef.current.offsetTop;
  };

  const handleDrag = (event) => {
    if (!isDraggingRef.current) return;
    const { clientX, clientY } = event;
    const draggedObject = draggableRef.current;
    const offsetX = clientX - mouseRef.current.x;
    const offsetY = clientY - mouseRef.current.y;
    const newLeft = draggableRef.current.offsetLeft + offsetX;
    const newTop = draggableRef.current.offsetTop + offsetY;

    // Calculate the boundaries of the draggable object
    const objectWidth = draggedObject.offsetWidth;
    const objectHeight = draggedObject.offsetHeight;
    const minX = 0;
    const minY = 0;
    const maxX = canvasSize.width - objectWidth;
    const maxY = canvasSize.height - objectHeight;

    // Apply clamping to prevent object from moving beyond canvas boundaries
    const clampedLeft = Math.max(minX, Math.min(newLeft, maxX));
    const clampedTop = Math.max(minY, Math.min(newTop, maxY));

    draggedObject.style.left = `${clampedLeft}px`;
    draggedObject.style.top = `${clampedTop}px`;

    mouseRef.current.x = clientX;
    mouseRef.current.y = clientY;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue)) {
      const clampedValue = Math.max(0, Math.min(parsedValue, canvasSize[name]));
      setObjectSize((prevState) => ({ ...prevState, [name]: clampedValue }));
    }
  };

  const handleLogPositionSize = () => {
    const { left, top } = draggableRef.current.getBoundingClientRect();
    console.log("Position:", { left, top });
    console.log("Size:", objectSize);
  };

  return (
    <div className="canvas-container">
      <div
        className="canvas"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      >
        <div
          className="draggable-object"
          ref={draggableRef}
          onMouseDown={handleDragStart}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          style={{ width: objectSize.width, height: objectSize.height }}
        >
          Drag and Drop Canvas
        </div>
      </div>
      <div className="controls-container">
        <div className="input-container">
          <label htmlFor="widthInput">Width:</label>
          <input
            id="widthInput"
            type="number"
            name="width"
            value={objectSize.width}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-container">
          <label htmlFor="heightInput">Height:</label>
          <input
            id="heightInput"
            type="number"
            name="height"
            value={objectSize.height}
            onChange={handleInputChange}
          />
        </div>
        <button onClick={handleLogPositionSize}>Log Position and Size</button>
      </div>
    </div>
  );
};

export default Canvas;
