import React, { useState, useRef, useEffect } from 'react';

interface ImageCropModalProps {
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  onClose,
  onCropComplete,
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset position & zoom when image changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  }, [imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel zoom inside crop area
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoom((prev) => Math.min(Math.max(prev + zoomDelta, 0.5), 3));
  };

  const handleSaveCrop = () => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const canvas = document.createElement('canvas');
    const size = 400; // Output dimension for crisp avatar
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Save context state for clipping circular avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Fill background with light neutral tone
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, size, size);

    // Translate to canvas center and apply zoom & pan offsets
    const displaySize = 250; // Viewport size in px
    const scaleFactor = size / displaySize;

    ctx.translate(size / 2 + position.x * scaleFactor, size / 2 + position.y * scaleFactor);
    ctx.scale(zoom, zoom);

    // Calculate dimensions to preserve full original photo aspect ratio (no forced cropping)
    const aspect = img.naturalWidth / img.naturalHeight;
    let baseWidth = size;
    let baseHeight = size;

    if (aspect > 1) {
      baseWidth = size;
      baseHeight = size / aspect;
    } else {
      baseWidth = size * aspect;
      baseHeight = size;
    }

    ctx.drawImage(img, -baseWidth / 2, -baseHeight / 2, baseWidth, baseHeight);
    ctx.restore();

    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 select-none">
      <div className="bg-white dark:bg-[#121e21] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-[#00a88a]/20 flex flex-col items-center animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="w-full flex justify-between items-center mb-6">
          <div>
            <h3 className="font-extrabold text-base text-[#091e22] dark:text-[#f1f5f9]">Adjust Profile Photo</h3>
            <p className="text-[11px] text-[#5c7075] dark:text-slate-400 font-normal">Full picture loaded. Position & scale to fit circle.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Circular Viewport Container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className={`relative w-[250px] h-[250px] rounded-full overflow-hidden border-4 border-white dark:border-[#00a88a]/20 shadow-2xl bg-slate-900 cursor-${
            isDragging ? 'grabbing' : 'grab'
          } flex items-center justify-center touch-none mb-6`}
        >
          {/* Guide Overlay Ring */}
          <div className="absolute inset-0 border border-white/30 rounded-full pointer-events-none z-10" />

          {/* Full Unclipped Image */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Adjust avatar"
            draggable={false}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.05s ease-out',
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
            className="pointer-events-none select-none"
          />
        </div>

        <p className="text-[11px] text-[#5c7075] dark:text-slate-400 font-semibold mb-6 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-[#006655] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span>Drag to move • Scroll or slider to scale</span>
        </p>

        {/* Scale & Zoom Slider */}
        <div className="w-full space-y-2 mb-6 bg-slate-50 dark:bg-[#1a292c] p-4 rounded-2xl border border-[#006655]/15 dark:border-[#00a88a]/20 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs font-bold text-[#5c7075] dark:text-slate-300">
            <span>Photo Scale</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
              className="text-slate-500 hover:text-[#006655] font-bold text-base select-none px-1.5 py-0.5 rounded hover:bg-slate-200/50"
            >
              -
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-[#006655] cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}
              className="text-slate-500 hover:text-[#006655] font-bold text-base select-none px-1.5 py-0.5 rounded hover:bg-slate-200/50"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#091e22] dark:text-[#f1f5f9] font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveCrop}
            className="flex-1 bg-[#006655] hover:bg-[#004d40] text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Save & Apply</span>
          </button>
        </div>

      </div>
    </div>
  );
};
