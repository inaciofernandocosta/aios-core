import { useState } from 'react';
import AgentsOrganogram from './components/AgentsOrganogram';
import AgentChat from './components/AgentChat';

function App() {
  const [activeView, setActiveView] = useState<'organogram' | 'chat'>('organogram');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{
        background: 'linear-gradient(180deg, #12151c, #0f1117)',
        borderBottom: '1px solid #2a3040',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <span style={{ fontSize: '18px', fontWeight: 700 }}>
            Synkra <span style={{ color: '#a78bfa' }}>AIOS</span>
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <button
            onClick={() => setActiveView('organogram')}
            style={{
              background: activeView === 'organogram' ? 'rgba(167, 139, 250, 0.15)' : 'transparent',
              border: activeView === 'organogram' ? '1px solid rgba(167, 139, 250, 0.4)' : '1px solid transparent',
              color: activeView === 'organogram' ? '#a78bfa' : '#7a82a6',
              padding: '8px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            👑 Organograma
          </button>
          <button
            onClick={() => setActiveView('chat')}
            style={{
              background: activeView === 'chat' ? 'rgba(167, 139, 250, 0.15)' : 'transparent',
              border: activeView === 'chat' ? '1px solid rgba(167, 139, 250, 0.4)' : '1px solid transparent',
              color: activeView === 'chat' ? '#a78bfa' : '#7a82a6',
              padding: '8px 20px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            💬 Chat
          </button>
        </div>
        
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          color: '#22c55e',
          padding: '6px 14px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 600,
        }}>
          12 Agentes Ativos
        </div>
      </nav>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeView === 'organogram' ? <AgentsOrganogram /> : <AgentChat />}
      </div>
    </div>
  );
}

export default App;
