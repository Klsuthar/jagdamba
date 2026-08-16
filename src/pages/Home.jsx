import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../css/main.css';
import '../css/hero.css';
import '../css/home.css';

function Counter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setHasStarted(true);
      }
    }, { threshold: 0.1 });

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const end = parseInt(target, 10);
    if (start === end) return;

    let totalMilisecondsRoundUp = duration;
    let incrementTime = Math.abs(Math.floor(totalMilisecondsRoundUp / end));
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime || 16);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return <span ref={counterRef}>{count}</span>;
}

export default function Home() {
  return (
    <main role="main">
      <section className="hero-section" aria-labelledby="hero-title" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero-bg.webp"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        >
          <source src="/video/hero-video.webm" type="video/webm" />
          <source src="/video/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Video Overlay Layer */}
        <div 
          className="hero-video-overlay" 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(10, 14, 26, 0.7) 0%, rgba(26, 16, 64, 0.7) 50%, rgba(10, 14, 26, 0.7) 100%)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        ></div>


        {/* Animated Hero Content */}
        <motion.div 
          className="hero-content" 
          style={{ position: 'relative', zIndex: 2 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-badge">🎓 Excellence in Education Since 2001</div>
          <h1 className="hero-title" id="hero-title">
            <span style={{ color: 'white' }}>Welcome to</span> <span className="gradient-text">Shree Jagdamba Convent School</span>
          </h1>
          <p className="hero-subtitle">Where Education, Values and Success Meet 🌟</p>
          <div className="hero-buttons">
            <Link to="/admin" className="cta-button primary" aria-label="Admin login">
              <span>Admin Login</span>
              <i className="fas fa-user-shield"></i>
            </Link>
            <Link to="/progress" className="cta-button secondary" aria-label="View student progress reports">
              <span>Student Portal</span>
              <i className="fas fa-external-link-alt"></i>
            </Link>
          </div>
          <div className="session-highlight" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '0.3rem 1rem',
            borderRadius: '50px',
            fontSize: '0.85rem',
            color: '#a5b4fc',
            marginTop: '1.5rem',
            animation: 'pulse-glow 3s ease-in-out infinite'
          }}>
            📅 Session 2026-27
          </div>
        </motion.div>
      </section>

      <div style={{ background: 'white' }}>
        <img src="/images/stikers/students.webp" alt="Shree Jagdamba School Students - Quality Education" width="1920" height="544" style={{ width: '100%', height: 'auto', display: 'block', margin: 0, padding: 0 }} loading="eager" />
      </div>
      <div className="quote-bar" style={{
        background: 'linear-gradient(135deg, #0a2463 0%, #1e3a8a 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '20px 15px',
        margin: 0,
        fontSize: '1.3rem',
        fontWeight: 600,
        fontFamily: "'Georgia', serif",
        letterSpacing: '0.5px'
      }}>
        ✨ We teach beyond books — preparing students for life.
      </div>

      <section id="home" className="features-section" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">School Statistics and Features</h2>
        <div className="container">
          {/* Animated Stats Cards Grid */}
          <motion.div 
            className="stats-grid" 
            role="list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12 }
              }
            }}
          >
            <motion.div 
              className="stat-card" 
              role="listitem"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
              }}
            >
              <div className="stat-icon-wrapper">
                <i className="fas fa-users" aria-hidden="true"></i>
              </div>
              <h3><Counter target="150" />+</h3>
              <p>Happy Students</p>
            </motion.div>
            <motion.div 
              className="stat-card" 
              role="listitem"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
              }}
            >
              <div className="stat-icon-wrapper">
                <i className="fas fa-chalkboard-teacher" aria-hidden="true"></i>
              </div>
              <h3><Counter target="6" />+</h3>
              <p>Expert Teachers</p>
            </motion.div>
            <motion.div 
              className="stat-card" 
              role="listitem"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
              }}
            >
              <div className="stat-icon-wrapper">
                <i className="fas fa-school" aria-hidden="true"></i>
              </div>
              <h3><Counter target="8" />+</h3>
              <p>Classes</p>
            </motion.div>
            <motion.div 
              className="stat-card" 
              role="listitem"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
              }}
            >
              <div className="stat-icon-wrapper">
                <i className="fas fa-trophy" aria-hidden="true"></i>
              </div>
              <h3><Counter target="100" />%</h3>
              <p>Success Rate</p>
            </motion.div>
          </motion.div>

          <img src="/images/stikers/student_nursary.webp" alt="Shree Jagdamba Convent School Nursery Students" width="3165" height="1197" style={{ width: '100%', height: 'auto', display: 'block', margin: '2rem 0 0', padding: 0 }} loading="lazy" />
          <div className="quote-bar quote-bar-green" style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #0d5e3a 100%)',
            color: 'white',
            textAlign: 'center',
            padding: '20px 15px',
            margin: '0 0 20px 0',
            fontSize: '1.3rem',
            fontWeight: 600,
            fontFamily: "'Georgia', serif",
            letterSpacing: '0.5px'
          }}>
            🚀 Not just teaching, but building the future
          </div>

          {/* Animated Features Grid */}
          <motion.div 
            className="features-grid" 
            role="list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            {[
              { icon: 'laptop-code', title: 'Modern Education', desc: 'Latest teaching methods and technology' },
              { icon: 'bus', title: 'Transport Facility', desc: 'Safe and convenient bus service' },
              { icon: 'running', title: 'Sports Facilities', desc: 'Playground for physical development' },
              { icon: 'desktop', title: 'Computer Lab', desc: 'Modern lab for digital education' },
              { icon: 'video', title: 'CCTV Campus', desc: '24x7 security surveillance' },
              { icon: 'headset', title: 'Tech Support', desc: 'Fast information for parents' }
            ].map((feat, idx) => (
              <motion.article 
                key={idx}
                className="feature-card" 
                role="listitem"
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
                whileHover={{ y: -6, scale: 1.025, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.25)' }}
              >
                <div className="feature-icon">
                  <i className={`fas fa-${feat.icon}`}></i>
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

    </main>
  );
}
