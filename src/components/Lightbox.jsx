import React, { useEffect, useRef } from 'react';

export default function Lightbox({ isOpen, images = [], currentIndex = 0, onClose, onNext, onPrev }) {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Aggressive Preloading of Next, Prev, and all Event Images for 0ms delay
  useEffect(() => {
    if (!isOpen || !images || images.length === 0) return;

    // High-priority preloading for adjacent images
    const nextIdx = (currentIndex + 1) % images.length;
    const prevIdx = (currentIndex - 1 + images.length) % images.length;

    const imgNext = new Image();
    imgNext.src = images[nextIdx];

    const imgPrev = new Image();
    imgPrev.src = images[prevIdx];

    // Preload remaining images in background
    images.forEach((path) => {
      const img = new Image();
      img.src = path;
    });
  }, [isOpen, images, currentIndex]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !images || images.length === 0) return null;

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (swipeDistance > 50 && images.length > 1) {
      onNext();
    } else if (swipeDistance < -50 && images.length > 1) {
      onPrev();
    }
  };

  const currentSrc = images[currentIndex];
  const nextIdx = (currentIndex + 1) % images.length;
  const prevIdx = (currentIndex - 1 + images.length) % images.length;

  return (
    <div
      className="lightbox active"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hidden browser cache priming elements */}
      <div style={{ display: 'none' }} aria-hidden="true">
        {images.length > 1 && <img src={images[nextIdx]} alt="" />}
        {images.length > 1 && <img src={images[prevIdx]} alt="" />}
      </div>

      <button
        className="lightbox-close"
        aria-label="Close image viewer"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        type="button"
      >
        <i className="fas fa-times" aria-hidden="true"></i>
      </button>

      {images.length > 1 && (
        <button
          className="lightbox-prev"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          type="button"
        >
          <i className="fas fa-chevron-left" aria-hidden="true"></i>
        </button>
      )}

      <div className="lightbox-image-container" onClick={(e) => e.stopPropagation()}>
        <img
          key={currentSrc}
          src={currentSrc}
          alt=""
          className="lightbox-image"
          loading="eager"
          decoding="async"
        />
        {images.length > 1 && (
          <div className="lightbox-counter-badge">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <button
          className="lightbox-next"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          type="button"
        >
          <i className="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
      )}
    </div>
  );
}
