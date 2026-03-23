/**
 * Swizzled Mermaid component — wraps the default Docusaurus Mermaid
 * renderer with a click-to-fullscreen modal for zoom/pan.
 */
import React, { useState, useRef, useCallback } from 'react';
import MermaidOriginal from '@theme-original/Mermaid';

export default function MermaidWrapper(props: any): JSX.Element {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const openFullscreen = useCallback(() => {
    // Calculate optimal scale to fit the diagram nicely in the viewport
    const svgEl = containerRef.current?.querySelector('svg');
    if (svgEl) {
      const svgRect = svgEl.getBoundingClientRect();
      const vpW = window.innerWidth * 0.85;
      const vpH = window.innerHeight * 0.8;
      const fitScale = Math.min(vpW / svgRect.width, vpH / svgRect.height);
      // Use the fit scale but cap between 1.2x and 3x for readability
      const optimalScale = Math.max(1.2, Math.min(3, fitScale));
      setScale(optimalScale);
    } else {
      setScale(1.5);
    }
    setIsFullscreen(true);
    setPosition({ x: 0, y: 0 });
    posRef.current = { x: 0, y: 0 };
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  // Close on Escape key
  React.useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFullscreen();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, closeFullscreen]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScale(s => Math.max(0.25, Math.min(5, s - e.deltaY * 0.001)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const newPos = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
    posRef.current = newPos;
    setPosition(newPos);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <>
      {/* Inline diagram with click hint */}
      <div
        ref={containerRef}
        onClick={openFullscreen}
        style={{ cursor: 'zoom-in', position: 'relative' }}
        title="Click to expand"
      >
        <MermaidOriginal {...props} />
        <div style={{
          position: 'absolute',
          top: 6,
          right: 6,
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          fontSize: '0.65rem',
          padding: '2px 6px',
          borderRadius: 4,
          pointerEvents: 'none',
          opacity: 0.7,
        }}>
          🔍 Click to zoom
        </div>
      </div>

      {/* Fullscreen modal */}
      {isFullscreen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeFullscreen(); }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isDragging.current ? 'grabbing' : 'grab',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* Controls */}
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 8,
            zIndex: 10000,
          }}>
            <button onClick={() => setScale(s => Math.min(5, s + 0.25))} style={btnStyle}>＋</button>
            <button onClick={() => setScale(s => Math.max(0.25, s - 0.25))} style={btnStyle}>−</button>
            <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); posRef.current = { x: 0, y: 0 }; }} style={btnStyle}>Reset</button>
            <button onClick={closeFullscreen} style={{ ...btnStyle, background: 'rgba(239, 68, 68, 0.8)' }}>✕ Close</button>
          </div>

          {/* Scale indicator */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#888',
            fontSize: '0.75rem',
          }}>
            {Math.round(scale * 100)}% · Scroll to zoom · Drag to pan · Click backdrop to close
          </div>

          {/* Diagram */}
          <div style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging.current ? 'none' : 'transform 0.1s ease-out',
            maxWidth: '90vw',
            maxHeight: '90vh',
          }}>
            <MermaidOriginal {...props} />
          </div>
        </div>
      )}
    </>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.15)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  color: '#fff',
  padding: '6px 14px',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: 500,
  backdropFilter: 'blur(8px)',
};
