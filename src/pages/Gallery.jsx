import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lightbox from '../components/Lightbox';
import '../css/main.css';
import '../css/gallery.css';

export default function Gallery() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lightbox, setLightbox] = useState({ isOpen: false, images: [], currentIndex: 0 });

  useEffect(() => {
    fetch('/json/gallery_events.json?v=' + Date.now())
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        const loadedEvents = data.events || [];
        setEvents(loadedEvents);
        setLoading(false);

        // Preload & permanently cache all gallery images in browser Cache Storage
        if (typeof window !== 'undefined') {
          const cacheAndPreloadImages = async () => {
            try {
              let cacheStorage = null;
              if ('caches' in window) {
                cacheStorage = await caches.open('jagdamba-images-v1').catch(() => null);
              }

              loadedEvents.forEach((evt) => {
                evt.images?.forEach((img) => {
                  if (img.path) {
                    // 1. In-memory Image Cache
                    const pImg = new Image();
                    pImg.src = img.path;

                    // 2. Persistent Cache Storage API
                    if (cacheStorage) {
                      cacheStorage.match(img.path).then((found) => {
                        if (!found) {
                          fetch(img.path, { cache: 'force-cache' })
                            .then((res) => {
                              if (res.ok) cacheStorage.put(img.path, res);
                            })
                            .catch(() => {});
                        }
                      });
                    }
                  }
                });
              });
            } catch (e) {
              console.warn('Gallery caching error:', e);
            }
          };

          if ('requestIdleCallback' in window) {
            window.requestIdleCallback(cacheAndPreloadImages);
          } else {
            setTimeout(cacheAndPreloadImages, 100);
          }
        }
      })
      .catch(err => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const handleOpenLightbox = (eventIndex, imageIndex = 0) => {
    const eventImages = events[eventIndex].images.map(img => img.path);
    // Preload current event images immediately
    eventImages.forEach(path => {
      const p = new Image();
      p.src = path;
    });
    setLightbox({
      isOpen: true,
      images: eventImages,
      currentIndex: imageIndex
    });
  };

  const handleCloseLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
  };

  const handleOpenSingleImage = (imgSrc) => {
    setLightbox({
      isOpen: true,
      images: [imgSrc],
      currentIndex: 0
    });
  };

  const handleNext = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const handlePrev = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  return (
    <div className="gallery-page-wrapper">
      {/* Full Width Edge-to-Edge Hero Banner with Prayer Image */}
      <div
        className="gallery-hero-banner"
        onClick={() => handleOpenSingleImage('/images/prayer.webp')}
        role="button"
        tabIndex={0}
        aria-label="View full resolution morning prayer assembly photo"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenSingleImage('/images/prayer.webp');
          }
        }}
      >
        <img
          src="/images/prayer.webp"
          alt="Morning Assembly & Prayer - Shree Jagdamba Convent School"
          className="gallery-hero-img"
          loading="eager"
          fetchPriority="high"
        />
        <div className="gallery-hero-overlay">
          <motion.div
            className="gallery-hero-content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="gallery-hero-pill">
              <i className="fas fa-sun"></i>
              <span>Morning Assembly & Campus Life</span>
            </div>
            <h1 className="gallery-hero-title">School Photo Gallery</h1>
            <p className="gallery-hero-subtitle">
              Capturing daily morning prayers, cultural celebrations, and campus moments.
            </p>
            <div className="gallery-hero-fullscreen-hint">
              <i className="fas fa-expand"></i> Tap photo for full view
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Gallery Albums Grid Section */}
      <section className="gallery-section">
        <div className="gallery-container">
          <div className="gallery-section-header">
            <div className="gallery-section-title-wrap">
              <h2 className="gallery-section-title">Campus Events & Albums</h2>
              <span className="gallery-events-count">{events.length} Albums</span>
            </div>
            <p className="gallery-section-sub">
              Click on any album to view full-screen high-resolution photos.
            </p>
          </div>

          {loading && (
            <div className="gallery-state-box">
              <i className="fas fa-spinner fa-spin gallery-state-icon"></i>
              <h3>Loading Photo Albums...</h3>
              <p>Fetching memories and high-resolution photos.</p>
            </div>
          )}

          {error && (
            <div className="gallery-state-box gallery-error-box">
              <i className="fas fa-exclamation-triangle gallery-state-icon"></i>
              <h3>Unable to load gallery</h3>
              <p>Please check your internet connection and reload the page.</p>
            </div>
          )}

          {!loading && !error && (
            <motion.div
              className="gallery-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 }
                }
              }}
            >
              {events.map((event, idx) => (
                <motion.div
                  key={idx}
                  className="gallery-item-card"
                  onClick={() => handleOpenLightbox(idx, 0)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${event.eventName} album`}
                  variants={{
                    hidden: { opacity: 0, y: 25 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                  }}
                  whileHover={{ y: -8 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenLightbox(idx, 0);
                    }
                  }}
                >
                  <div className="gallery-card-thumb">
                    <img
                      src={event.images[0].path}
                      alt={event.eventName}
                      loading="lazy"
                      className="gallery-card-img"
                    />
                    <div className="gallery-photo-badge">
                      <i className="fas fa-images"></i>
                      <span>{event.images.length} Photos</span>
                    </div>
                    <div className="gallery-card-hover-overlay">
                      <div className="gallery-hover-icon">
                        <i className="fas fa-expand-alt"></i>
                      </div>
                      <span>Open Album</span>
                    </div>
                  </div>

                  <div className="gallery-card-info">
                    <h3 className="gallery-card-title">{event.eventName}</h3>
                    <div className="gallery-card-meta">
                      <span><i className="fas fa-photo-video"></i> {event.images.length} High-Res Images</span>
                      <span className="gallery-view-link">View Album <i className="fas fa-arrow-right"></i></span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Lightbox
        isOpen={lightbox.isOpen}
        images={lightbox.images}
        currentIndex={lightbox.currentIndex}
        onClose={handleCloseLightbox}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
