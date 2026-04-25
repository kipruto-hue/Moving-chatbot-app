import { useState } from 'react';
import { companies } from './config/companies';
import ChatWidget from './components/ChatWidget';

export default function App() {
  const [activeId, setActiveId] = useState('nellions');
  const [leads, setLeads] = useState([]);

  const company = companies[activeId];

  const handleLeadCaptured = (data) => {
    if (data) setLeads(prev => [data, ...prev]);
  };

  return (
    <div className="app">
      <header className="app-header" style={{ borderBottom: `3px solid ${company.color}` }}>
        <div className="header-brand">
          <span className="brand-logo">{company.logo}</span>
          <div>
            <div className="brand-name">{company.name}</div>
            <div className="brand-tagline">{company.tagline}</div>
          </div>
        </div>

        <div className="company-switcher">
          <span className="switcher-label">Demo:</span>
          {Object.values(companies).map(c => (
            <button
              key={c.id}
              className={`switcher-btn ${activeId === c.id ? 'active' : ''}`}
              style={activeId === c.id ? { background: c.color, color: '#fff', borderColor: c.color } : { borderColor: c.color, color: c.color }}
              onClick={() => setActiveId(c.id)}
            >
              {c.logo} {c.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <div className="trust-card">
            <div className="trust-title" style={{ color: company.color }}>Why {company.name.split(' ')[0]}?</div>
            {company.stats.map((s, i) => (
              <div key={i} className="trust-stat">
                <span className="stat-icon" style={{ color: company.color }}>✓</span>
                {s}
              </div>
            ))}
            <div className="trust-badge" style={{ background: company.colorLight, color: company.color }}>
              🏆 {company.badge}
            </div>
          </div>

          <div className="test-card">
            <div className="test-title">Quick test phrases</div>
            {company.quickPhrases.map((p, i) => (
              <div key={i} className="test-phrase">"{p}"</div>
            ))}
          </div>

          {leads.length > 0 && (
            <div className="leads-card">
              <div className="leads-title">
                <span>📋 Captured Leads</span>
                <span className="leads-count" style={{ background: company.color }}>{leads.length}</span>
              </div>
              <div className="leads-list">
                {leads.map((lead, i) => (
                  <div key={i} className="lead-item">
                    <div className="lead-name">{lead.name || lead.customer_name || 'Unknown'}</div>
                    <div className="lead-detail">
                      {lead.phone || lead.customer_phone || '—'}
                      {lead.from_location && ` · ${lead.from_location} → ${lead.to_location}`}
                    </div>
                    <div className="lead-id">{lead.id}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="chat-main">
          <ChatWidget
            key={activeId}
            company={company}
            onLeadCaptured={handleLeadCaptured}
          />
        </main>
      </div>
    </div>
  );
}
