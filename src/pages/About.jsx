import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../css/main.css';
import '../css/about.css';
import '../css/principal-card.css';
import '../css/flip-card.css';

export default function About() {
  const [modalData, setModalData] = useState({ isOpen: false, src: '', title: '' });

  const openImageModal = (src, title) => {
    setModalData({ isOpen: true, src, title });
  };

  const closeImageModal = () => {
    setModalData({ isOpen: false, src: '', title: '' });
  };

  return (
    <section className="about-section" style={{ paddingTop: '80px' }}>
      <div className="page-header" style={{ padding: '3rem 1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>About Us</h1>
        <p style={{ color: 'var(--secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Empowering Young Minds Since Inception</p>
      </div>
      <div className="container">
        
        {/* Animated Stats Cards Grid */}
        <motion.div 
          className="stats-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {[
            { icon: 'user-graduate', num: '150+', label: 'Happy Students' },
            { icon: 'chalkboard-teacher', num: '6+', label: 'Expert Teachers' },
            { icon: 'school', num: '8+', label: 'Classes' },
            { icon: 'trophy', num: '100%', label: 'Success Rate' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              className="stat-card"
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
              }}
              whileHover={{ y: -8 }}
            >
              <div className="stat-icon-wrapper">
                <i className={`fas fa-${stat.icon}`}></i>
              </div>
              <h3>{stat.num}</h3>
              <p>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission and Vision section */}
        <div className="mission-vision" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '3rem 0' }}>
          <motion.div 
            className="mv-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mv-icon"><i className="fas fa-bullseye"></i></div>
            <h3><span className="highlight-text">Our</span> Mission</h3>
            <p>To provide quality education that nurtures intellectual curiosity, moral values, and prepares students for a successful future.</p>
          </motion.div>
          <motion.div 
            className="mv-card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mv-icon"><i className="fas fa-eye"></i></div>
            <h3><span className="highlight-text">Our</span> Vision</h3>
            <p>To be a leading educational institution that shapes confident, compassionate, and capable individuals ready to contribute to society.</p>
          </motion.div>
        </div>

        {/* Leadership Cards Grid */}
        <motion.div 
          className="leadership-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {/* Director Card */}
          <motion.div 
            className="principal-card"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <div className="card-header director-bg">
              <div className="header-content">
                <div className="header-left">
                  <div className="principal-image" onClick={() => openImageModal('/images/gopalji.jpg', 'Gopal Krishan Bhamu - Director')}>
                    <img src="/images/gopalji.jpg" alt="Director" width="480" height="640" loading="lazy" />
                  </div>
                </div>
                <div className="header-right">
                  <h3 className="principal-name">Gopal Krishan Bhamu</h3>
                  <p className="principal-designation">Director</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <blockquote className="principal-message">
                "Education is the power that can transform lives. At Shree Jagdamba Convent School, we help every child reach their full potential."
              </blockquote>
            </div>
            <div className="card-footer">
              <a href="tel:+919828869462" className="social-icon phone-icon" title="Call Director">
                <i className="fas fa-phone-alt"></i>
              </a>
            </div>
          </motion.div>

          {/* Principal Card */}
          <motion.div 
            className="principal-card"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <div className="card-header principal-bg">
              <div className="header-content">
                <div className="header-left">
                  <div className="principal-image" onClick={() => openImageModal('/images/principal.webp', 'Rakesh Jangir - Principal')}>
                    <img src="/images/principal.webp" alt="Principal" width="480" height="640" loading="lazy" />
                  </div>
                </div>
                <div className="header-right">
                  <h3 className="principal-name">Rakesh Jangir</h3>
                  <p className="principal-designation">Principal</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <blockquote className="principal-message">
                "Education is not the filling of a pail, but the lighting of a fire. At Shree Jagdamba Convent School, we nurture young minds to become responsible citizens and future leaders."
              </blockquote>
            </div>
            <div className="card-footer">
              <a href="tel:+919784394907" className="social-icon phone-icon" title="Call Principal">
                <i className="fas fa-phone-alt"></i>
              </a>
            </div>
          </motion.div>

          {/* Management Director Card */}
          <motion.div 
            className="principal-card"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <div className="card-header md-bg">
              <div className="header-content">
                <div className="header-left">
                  <div className="principal-image" onClick={() => openImageModal('/images/sarla.webp', 'Sarla Devi - Management Director')}>
                    <img src="/images/sarla.webp" alt="Management Director" width="480" height="640" loading="lazy" />
                  </div>
                </div>
                <div className="header-right">
                  <h3 className="principal-name">Sarla Devi</h3>
                  <p className="principal-designation">Management Director</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <blockquote className="principal-message">
                "Quality management and compassionate guidance create an environment where students excel both academically and morally."
              </blockquote>
            </div>
            <div className="card-footer">
              <a href="tel:+919828641091" className="social-icon phone-icon" title="Call Management Director (9828641091)">
                <i className="fas fa-phone-alt"></i>
              </a>
            </div>
          </motion.div>

          {/* Headmaster Card */}
          <motion.div 
            className="principal-card"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <div className="card-header headmaster-bg">
              <div className="header-content">
                <div className="header-left">
                  <div className="principal-image" onClick={() => openImageModal('/images/chandan-singh.webp', 'Chandan Singh - HOD & English Teacher')}>
                    <img src="/images/chandan-singh.webp" alt="Chandan Singh" width="480" height="640" loading="lazy" />
                  </div>
                </div>
                <div className="header-right">
                  <h3 className="principal-name">Chandan Singh</h3>
                  <p className="principal-designation">HOD & English Teacher</p>
                  <p className="principal-qualification">MA, BA & B.Ed</p>
                </div>
              </div>
            </div>
            <div className="card-body">
              <blockquote className="principal-message">
                "Our goal is not only to achieve academic excellence but also to develop moral values and life skills in children."
              </blockquote>
            </div>
            <div className="card-footer">
              <a href="tel:+919166856325" className="social-icon phone-icon" title="Call Headmaster">
                <i className="fas fa-phone-alt"></i>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Leadership Image Modal */}
        {modalData.isOpen && (
          <div className="image-modal show" onClick={closeImageModal} style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', zIndex: 10000 }}>
            <div className="modal-content-wrapper" onClick={(e) => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
              <button className="modal-close" onClick={closeImageModal} style={{ position: 'absolute', right: '-15px', top: '-40px', background: 'none', border: 'none', color: 'white', fontSize: '2.5rem', cursor: 'pointer' }}>×</button>
              <img src={modalData.src} alt={modalData.title} className="modal-image" style={{ width: 'auto', maxHeight: '80vh', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
              <div className="modal-info" style={{ color: 'white', textAlign: 'center', marginTop: '10px', fontSize: '1.1rem' }}>{modalData.title}</div>
            </div>
          </div>
        )}

        <h2 className="section-title" style={{ textAlign: 'center', margin: '3rem 0 2rem' }}>Our Teachers</h2>
        {/* Animated Teachers Grid */}
        <motion.div 
          className="teachers-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {[
            { name: 'Kanhaiya lal', role: 'Maths & Computer Teacher', degree: 'BSc in Maths & BEd', inst: 'Sadguru Institute of Education, Jaipur', img: 'kanhaiyalal.webp', link: 'https://klsuthar.github.io/KanhaiyalalSuthar/' },
            { name: 'Renu Noyal', role: 'EVS & English Teacher', degree: 'BA and BEd', inst: '', img: 'renu.webp' },
            { name: 'Vimla', role: 'Hindi & Oral Teacher', degree: 'BA', inst: '', img: 'vimala.webp' }
          ].map((t, idx) => (
            <motion.div 
              key={idx}
              className="teacher-card"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
              }}
              whileHover={{ y: -6, scale: 1.025 }}
            >
              {t.link ? (
                <a href={t.link} target="_blank" rel="noopener noreferrer" className="teacher-link">
                  <div className="teacher-img">
                    {t.img ? (
                      <img src={`/images/teachers/${t.img}`} alt={t.name} width="708" height="838" loading="lazy" />
                    ) : (
                      <div className="teacher-avatar-placeholder">
                        <i className="fas fa-chalkboard-teacher"></i>
                      </div>
                    )}
                  </div>
                  <div className="teacher-content">
                    <h3>{t.name}</h3>
                    <p className="teacher-subject">{t.role}</p>
                    <p className="teacher-degree">{t.degree}</p>
                    {t.inst && <p className="teacher-institute">{t.inst}</p>}
                  </div>
                </a>
              ) : (
                <>
                  <div className="teacher-img">
                    {t.img ? (
                      <img src={`/images/teachers/${t.img}`} alt={t.name} width="708" height="838" loading="lazy" />
                    ) : (
                      <div className="teacher-avatar-placeholder">
                        <i className="fas fa-chalkboard-teacher"></i>
                      </div>
                    )}
                  </div>
                  <div className="teacher-content">
                    <h3>{t.name}</h3>
                    <p className="teacher-subject">{t.role}</p>
                    <p className="teacher-degree">{t.degree}</p>
                    {t.inst && <p className="teacher-institute">{t.inst}</p>}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>

        <h2 className="section-title" style={{ textAlign: 'center', margin: '4rem 0 2rem' }}>Why Choose Us</h2>
        <div className="excellence-grid">
          <div className="excellence-card">
            <div className="excellence-number">01</div>
            <div className="excellence-icon"><i className="fas fa-graduation-cap"></i></div>
            <h3>Academic Excellence</h3>
            <p>Modern teaching methods with traditional values</p>
          </div>
          <div className="excellence-card">
            <div className="excellence-number">02</div>
            <div className="excellence-icon"><i className="fas fa-users"></i></div>
            <h3>Collaborative Environment</h3>
            <p>Strong community of students, teachers & parents</p>
          </div>
          <div className="excellence-card">
            <div className="excellence-number">03</div>
            <div className="excellence-icon"><i className="fas fa-chart-line"></i></div>
            <h3>Holistic Development</h3>
            <p>Balanced growth in academics, sports & arts</p>
          </div>
          <div className="excellence-card">
            <div className="excellence-number">04</div>
            <div className="excellence-icon"><i className="fas fa-chalkboard-teacher"></i></div>
            <h3>Expert Faculty</h3>
            <p>Experienced and dedicated teaching staff</p>
          </div>
          <div className="excellence-card">
            <div className="excellence-number">05</div>
            <div className="excellence-icon"><i className="fas fa-laptop"></i></div>
            <h3>Smart Classes</h3>
            <p>Technology-enabled learning environment</p>
          </div>
          <div className="excellence-card">
            <div className="excellence-number">06</div>
            <div className="excellence-icon"><i className="fas fa-shield-alt"></i></div>
            <h3>Safe Environment</h3>
            <p>Secure campus with caring supervision</p>
          </div>
        </div>

        <div className="school-footer" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '30px 15px', textAlign: 'center', borderRadius: '16px', margin: '3rem 0' }}>
          <p style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', margin: 0, fontWeight: 600, lineHeight: 1.5, fontFamily: "'Quicksand', sans-serif", color: 'white' }}>Creating confident minds for a changing world.</p>
        </div>
      </div>
    </section>
  );
}
