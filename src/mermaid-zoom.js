/**
 * Global click-to-zoom viewer for all Mermaid diagrams in Docusaurus.
 *
 * Features:
 * - Click any mermaid SVG to open full-screen modal
 * - Default zoom: 150%
 * - +/- zoom controls (10% steps, range 50%-400%)
 * - Mouse wheel zoom
 * - Pan with click-drag
 * - Reset button returns to 150%
 * - Close: X button, Escape key, click backdrop
 *
 * Loaded as a Docusaurus clientModule.
 *
 * @module mermaid-zoom
 */

if (typeof window !== 'undefined') {
  let modal = null;
  let currentZoom = 150;
  let panX = 0;
  let panY = 0;
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;

  const MIN_ZOOM = 50;
  const MAX_ZOOM = 400;
  const DEFAULT_ZOOM = 150;
  const ZOOM_STEP = 10;

  function getModal() {
    if (modal) return modal;

    /* ---- Backdrop ---- */
    modal = document.createElement('div');
    modal.id = 'mermaid-zoom-modal';
    Object.assign(modal.style, {
      position: 'fixed', inset: '0', zIndex: '99999',
      background: 'rgba(0, 0, 0, 0.92)', backdropFilter: 'blur(8px)',
      display: 'none', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    });

    /* ---- Toolbar ---- */
    const toolbar = document.createElement('div');
    Object.assign(toolbar.style, {
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.08)',
      borderRadius: '8px', marginBottom: '0.75rem', userSelect: 'none',
    });

    const btnStyle = {
      background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: '6px', padding: '0.4rem 0.75rem', cursor: 'pointer',
      color: '#fff', fontSize: '0.85rem', fontWeight: '600',
      transition: 'background 0.15s',
    };

    const zoomOut = document.createElement('button');
    zoomOut.textContent = '−';
    zoomOut.title = 'Zoom out';
    Object.assign(zoomOut.style, btnStyle);
    zoomOut.addEventListener('click', () => setZoom(currentZoom - ZOOM_STEP));
    zoomOut.addEventListener('mouseenter', () => zoomOut.style.background = 'rgba(255,255,255,0.2)');
    zoomOut.addEventListener('mouseleave', () => zoomOut.style.background = 'rgba(255,255,255,0.1)');

    const zoomLabel = document.createElement('span');
    zoomLabel.id = 'mermaid-zoom-label';
    Object.assign(zoomLabel.style, {
      color: '#fff', fontSize: '0.8rem', minWidth: '3.5rem',
      textAlign: 'center', fontFamily: 'monospace',
    });
    zoomLabel.textContent = '150%';

    const zoomIn = document.createElement('button');
    zoomIn.textContent = '+';
    zoomIn.title = 'Zoom in';
    Object.assign(zoomIn.style, btnStyle);
    zoomIn.addEventListener('click', () => setZoom(currentZoom + ZOOM_STEP));
    zoomIn.addEventListener('mouseenter', () => zoomIn.style.background = 'rgba(255,255,255,0.2)');
    zoomIn.addEventListener('mouseleave', () => zoomIn.style.background = 'rgba(255,255,255,0.1)');

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.title = 'Reset to 150%';
    Object.assign(resetBtn.style, { ...btnStyle, marginLeft: '0.25rem' });
    resetBtn.addEventListener('click', () => { setZoom(DEFAULT_ZOOM); panX = 0; panY = 0; applyTransform(); });
    resetBtn.addEventListener('mouseenter', () => resetBtn.style.background = 'rgba(255,255,255,0.2)');
    resetBtn.addEventListener('mouseleave', () => resetBtn.style.background = 'rgba(255,255,255,0.1)');

    const sep = document.createElement('span');
    Object.assign(sep.style, { width: '1px', height: '1.2rem', background: 'rgba(255,255,255,0.2)', margin: '0 0.25rem' });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close';
    closeBtn.title = 'Close (Escape)';
    Object.assign(closeBtn.style, { ...btnStyle, marginLeft: '0.5rem' });
    closeBtn.addEventListener('click', () => hideModal());
    closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = 'rgba(255,255,255,0.2)');
    closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = 'rgba(255,255,255,0.1)');

    toolbar.append(zoomOut, zoomLabel, zoomIn, resetBtn, sep.cloneNode(), closeBtn);

    /* ---- SVG container ---- */
    const container = document.createElement('div');
    container.id = 'mermaid-zoom-container';
    Object.assign(container.style, {
      overflow: 'hidden', borderRadius: '12px',
      background: 'var(--ifm-background-color, #1b1b1d)',
      maxWidth: '95vw', maxHeight: 'calc(90vh - 4rem)',
      width: '100%', cursor: 'grab', position: 'relative',
    });

    const svgWrap = document.createElement('div');
    svgWrap.id = 'mermaid-zoom-svg-wrap';
    Object.assign(svgWrap.style, {
      transformOrigin: '0 0', transition: 'transform 0.1s ease-out',
      padding: '2rem',
    });
    container.appendChild(svgWrap);

    /* Pan handlers */
    container.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isPanning = true;
      panStartX = e.clientX - panX;
      panStartY = e.clientY - panY;
      container.style.cursor = 'grabbing';
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isPanning) return;
      panX = e.clientX - panStartX;
      panY = e.clientY - panStartY;
      applyTransform();
    });
    window.addEventListener('mouseup', () => {
      if (isPanning) {
        isPanning = false;
        container.style.cursor = 'grab';
      }
    });

    /* Mouse wheel zoom */
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom(currentZoom + delta);
    }, { passive: false });

    modal.append(toolbar, container);
    document.body.appendChild(modal);

    /* Click backdrop to close */
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });

    return modal;
  }

  function applyTransform() {
    const wrap = document.getElementById('mermaid-zoom-svg-wrap');
    if (wrap) {
      const scale = currentZoom / 100;
      wrap.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    }
  }

  function setZoom(value) {
    currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
    const label = document.getElementById('mermaid-zoom-label');
    if (label) label.textContent = currentZoom + '%';
    applyTransform();
  }

  function showModal(svgElement) {
    const m = getModal();
    const wrap = document.getElementById('mermaid-zoom-svg-wrap');

    /* Reset state */
    currentZoom = DEFAULT_ZOOM;
    panX = 0;
    panY = 0;

    /* Clone SVG */
    const existing = wrap.querySelector('svg');
    if (existing) existing.remove();

    const clone = svgElement.cloneNode(true);
    clone.style.width = '100%';
    clone.style.height = 'auto';
    clone.removeAttribute('width');
    clone.removeAttribute('height');
    wrap.appendChild(clone);

    /* Update label */
    const label = document.getElementById('mermaid-zoom-label');
    if (label) label.textContent = DEFAULT_ZOOM + '%';

    applyTransform();
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function hideModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      isPanning = false;
    }
  }

  /* Escape closes */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideModal();
    if (!modal || modal.style.display === 'none') return;
    if (e.key === '+' || e.key === '=') setZoom(currentZoom + ZOOM_STEP);
    if (e.key === '-' || e.key === '_') setZoom(currentZoom - ZOOM_STEP);
    if (e.key === '0') { setZoom(DEFAULT_ZOOM); panX = 0; panY = 0; applyTransform(); }
  });

  /* Delegated click on any mermaid SVG */
  document.addEventListener('click', (e) => {
    const svg = e.target.closest('.docusaurus-mermaid-container svg, [class*="mermaid"] svg');
    if (!svg) return;
    if (e.target.closest('a')) return;
    e.preventDefault();
    e.stopPropagation();
    showModal(svg);
  });

  /* Cursor + hover styles for mermaid diagrams */
  const style = document.createElement('style');
  style.textContent = `
    .docusaurus-mermaid-container svg,
    [class*="mermaid"] svg {
      cursor: zoom-in;
      transition: opacity 0.15s ease, box-shadow 0.15s ease;
      border-radius: 8px;
    }
    .docusaurus-mermaid-container svg:hover,
    [class*="mermaid"] svg:hover {
      opacity: 0.88;
      box-shadow: 0 0 0 2px var(--ifm-color-primary-light, #6366f1);
    }
  `;
  document.head.appendChild(style);
}
