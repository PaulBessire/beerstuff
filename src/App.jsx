import { useState } from 'react'
import BreweryPlanner from './BreweryPlanner.jsx'
import NetSuiteInventory from './NetSuiteInventory.jsx'

const VIEWS = [
  { id: 'planner', label: 'Production Planner', icon: '🍺', desc: 'Schedule, materials, demand' },
  { id: 'netsuite', label: 'NetSuite Inventory', icon: '🔗', desc: 'Live sync from NetSuite' },
]

export default function App() {
  const [view, setView] = useState('planner')

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0b0f14', color: '#e2e8f0', minHeight: '100vh' }}>
      {/* Top-level view switcher */}
      <div style={{
        background: '#080b10', borderBottom: '1px solid #1e293b',
        padding: '0 24px', display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {VIEWS.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              padding: '10px 20px',
              background: view === v.id ? '#111820' : 'transparent',
              color: view === v.id ? '#f8fafc' : '#64748b',
              border: 'none',
              borderBottom: view === v.id ? '2px solid #c8854a' : '2px solid transparent',
              borderTop: view === v.id ? '2px solid #c8854a22' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.85rem',
              fontWeight: view === v.id ? 700 : 400,
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{v.icon}</span>
            <span>{v.label}</span>
            <span style={{
              fontSize: '0.6rem', color: '#475569',
              fontFamily: "'JetBrains Mono', monospace",
            }}>{v.desc}</span>
          </button>
        ))}
      </div>

      {/* View content */}
      <div style={{ display: view === 'planner' ? 'block' : 'none' }}>
        <BreweryPlanner />
      </div>
      <div style={{ display: view === 'netsuite' ? 'block' : 'none' }}>
        <NetSuiteInventory />
      </div>
    </div>
  )
}
