import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase-config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter and search states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  
  // Modal states
  const [selectedSub, setSelectedSub] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Load submissions from firestore
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'contactSubmissions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(list);
      setFilteredSubmissions(list);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Filter logic
  useEffect(() => {
    let result = submissions;

    if (category !== 'all') {
      result = result.filter(sub => sub.subject === category);
    }

    if (search) {
      const queryStr = search.toLowerCase();
      result = result.filter(sub => 
        (sub.name || '').toLowerCase().includes(queryStr) || 
        (sub.studentName || '').toLowerCase().includes(queryStr) ||
        (sub.message || '').toLowerCase().includes(queryStr)
      );
    }

    setFilteredSubmissions(result);
  }, [search, category, submissions]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/admin');
    } catch (err) {
      console.error('Sign out error', err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    try {
      await deleteDoc(doc(db, 'contactSubmissions', id));
      if (selectedSub && selectedSub.id === id) {
        setShowModal(false);
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const handleRowClick = (sub) => {
    setSelectedSub(sub);
    setShowModal(true);
  };

  // Stats calculation
  const totalCount = submissions.length;
  const admissionCount = submissions.filter(s => s.subject === 'admission').length;
  const complaintCount = submissions.filter(s => s.subject === 'complaint').length;
  const otherCount = totalCount - admissionCount - complaintCount;

  return (
    <div style={{ background: '#eff4fb', minHeight: '100vh', padding: '30px 20px', color: '#14213d' }}>
      <div className="page-shell" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Topbar */}
        <header className="topbar" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
          color: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(29, 78, 216, 0.25)',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div className="brand-block" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="brand-icon" style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyItems: 'center', fontSize: '1.4rem', justifyContent: 'center' }}>
              <i className="fas fa-school"></i>
            </div>
            <div className="brand-copy">
              <h1 style={{ fontSize: '1.4rem', color: 'white', margin: 0 }}>Admin Dashboard</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', margin: 0 }}>Managing Shree Jagdamba School Submissions</p>
            </div>
          </div>
          <div className="topbar-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/weekly-test')} 
              className="action-button" 
              style={{ 
                padding: '8px 16px', 
                borderRadius: '20px', 
                border: 'none', 
                background: 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)', 
                color: '#1e1b4b', 
                cursor: 'pointer', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(202, 138, 4, 0.35)'
              }}
            >
              <i className="fas fa-file-pdf"></i>
              Weekly Test PDF
            </button>
            <button onClick={() => navigate('/')} className="action-link" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>Home</button>
            <button onClick={handleSignOut} className="action-button" style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: 'white', color: '#1e3a8a', cursor: 'pointer', fontWeight: 600 }}>Sign Out</button>
          </div>
        </header>

        {/* Quick Admin Tools Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '16px',
          padding: '18px 24px',
          border: '1.5px solid #cbd5e1',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}>
              <i className="fas fa-magic"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#1e3a8a', fontWeight: 800 }}>Weekly Test Marksheet & PDF Generator Tool</h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.84rem', color: '#64748b' }}>
                Students photo aur marks ke sath A4 portrait marksheet banayein ya direct JSON paste karein.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/weekly-test')}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#1e3a8a',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)'
              }}
            >
              <i className="fas fa-external-link-alt"></i>
              Open Weekly Test Tool
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.15)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '2rem', color: '#1d4ed8', background: '#dbeafe', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-inbox"></i>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{totalCount}</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Total Messages</div>
            </div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.15)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '2rem', color: '#10b981', background: '#d1fae5', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{admissionCount}</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Admissions</div>
            </div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.15)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '2rem', color: '#ef4444', background: '#fee2e2', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{complaintCount}</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Complaints</div>
            </div>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.15)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '2rem', color: '#b45309', background: '#fef3c7', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-info-circle"></i>
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{otherCount}</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Other Inquiries</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Panel */}
        <div style={{ background: 'white', padding: '18px', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.15)', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Search messages</label>
            <input
              type="text"
              placeholder="Search parent name, student, or contents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
          <div style={{ width: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '5px' }}>Filter by Type</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white' }}
            >
              <option value="all">All Items</option>
              <option value="admission">Admissions</option>
              <option value="feedback">Feedback</option>
              <option value="complaint">Complaints</option>
              <option value="leave">Leaves</option>
              <option value="other">Others</option>
            </select>
          </div>
        </div>

        {/* Message Table */}
        <div style={{ background: 'white', borderRadius: '14px', border: '1px solid rgba(148, 163, 184, 0.15)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
              Loading submissions...
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
              <i className="fas fa-folder-open" style={{ fontSize: '3.5rem', marginBottom: '12px', color: '#cbd5e1' }}></i>
              <h4 style={{ fontSize: '1.1rem', color: '#475569' }}>No messages found</h4>
              <p>Try modifying your search or filter options.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Parent Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Student Name</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Category</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map(sub => (
                    <tr
                      key={sub.id}
                      onClick={() => handleRowClick(sub)}
                      style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '0.9rem' }}>{sub.date || 'N/A'}</td>
                      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1e293b' }}>{sub.name}</td>
                      <td style={{ padding: '14px 16px', color: '#334155' }}>{sub.studentName}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '50px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: sub.subject === 'admission' ? '#dbeafe' : sub.subject === 'complaint' ? '#fee2e2' : sub.subject === 'feedback' ? '#d1fae5' : '#fef3c7',
                          color: sub.subject === 'admission' ? '#1e40af' : sub.subject === 'complaint' ? '#991b1b' : sub.subject === 'feedback' ? '#065f46' : '#92400e'
                        }}>
                          {sub.subject}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={(e) => handleDelete(sub.id, e)}
                          style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                          title="Delete message"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showModal && selectedSub && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', zIndex: 1000, padding: '15px' }} onClick={() => setShowModal(false)}>
            <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Message Details</h2>
                <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase' }}>Parent Name</label>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{selectedSub.name}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase' }}>Phone Number</label>
                    <div><a href={`tel:${selectedSub.phone}`} style={{ color: '#1d4ed8', fontWeight: 600 }}>{selectedSub.phone}</a></div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase' }}>Student Name</label>
                    <div style={{ fontSize: '0.95rem' }}>{selectedSub.studentName}</div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase' }}>Inquiry Type</label>
                    <div style={{ textTransform: 'capitalize', fontSize: '0.95rem' }}>{selectedSub.subject}</div>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#1d4ed8', fontWeight: 700, textTransform: 'uppercase' }}>Message Content</label>
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap', lineHeight: '1.5', fontSize: '0.95rem' }}>
                    {selectedSub.message}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 20px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={(e) => handleDelete(selectedSub.id, e)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#991b1b', fontWeight: 600, cursor: 'pointer' }}
                >
                  Delete Message
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
