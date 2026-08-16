import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ marginBottom: '1.2rem' }}>
        <img
          src="/images/logo.png"
          alt="School Logo"
          style={{ width: '54px', height: '54px', margin: '0 auto 0.75rem', display: 'block' }}
        />
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: '#0f172a', fontWeight: 800 }}>
          Shree Jagdamba Convent School, Dhadheru Churu
        </h3>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: '#475569', fontWeight: 600 }}>
          Excellence in Education Since 2001
        </p>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          📍 Providing quality education with modern facilities
        </p>
      </div>
      <p style={{ color: '#475569', fontSize: '0.88rem' }}>
        Website Is designed by{' '}
        <a
          href="https://klsuthar.github.io/KanhaiyalalSuthar/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: 'rgba(79, 70, 229, 0.08)',
            color: '#4f46e5',
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
            fontWeight: 700,
            border: '1px solid rgba(79, 70, 229, 0.2)'
          }}
        >
          @kanhaiyalal
        </a>
      </p>
    </footer>
  );
}
