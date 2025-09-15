import React, { useState } from 'react';

const SegmentModal = ({ onClose, onSubmit, isLoading, customerCount }) => {
  const [segmentName, setSegmentName] = useState('');
  const [description, setDescription] = useState('');
  const [minSpend, setMinSpend] = useState(0);
  const [maxSpend, setMaxSpend] = useState('');
  const [minVisits, setMinVisits] = useState(0);
  const [lastActiveAfter, setLastActiveAfter] = useState('');
  const [lastActiveBefore, setLastActiveBefore] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!segmentName.trim()) {
      alert('Please enter a segment name');
      return;
    }
    
    onSubmit({
      name: segmentName.trim(),
      description: description.trim(),
      rules: {
        minSpend: Number(minSpend) || 0,
        maxSpend: maxSpend !== '' ? Number(maxSpend) : undefined,
        minVisits: Number(minVisits) || 0,
        lastActiveAfter: lastActiveAfter !== '' ? lastActiveAfter : undefined,
        lastActiveBefore: lastActiveBefore !== '' ? lastActiveBefore : undefined,
      }
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '500px',
        maxWidth: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        <h3>Create Customer Segment</h3>
        
        <p style={{ color: '#666', marginBottom: '20px' }}>
          This segment will include {customerCount} customers based on your current filter rules.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Segment Name *
            </label>
            <input
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="e.g., High Value Customers"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              disabled={isLoading}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this segment..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Min Spend
            </label>
            <input
              type="number"
              value={minSpend}
              onChange={e => setMinSpend(e.target.value)}
              min={0}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Max Spend (Optional)
            </label>
            <input
              type="number"
              value={maxSpend}
              onChange={e => setMaxSpend(e.target.value)}
              min={0}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Min Visits
            </label>
            <input
              type="number"
              value={minVisits}
              onChange={e => setMinVisits(e.target.value)}
              min={0}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Last Active After (Optional)
            </label>
            <input
              type="date"
              value={lastActiveAfter}
              onChange={e => setLastActiveAfter(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Last Active Before (Optional)
            </label>
            <input
              type="date"
              value={lastActiveBefore}
              onChange={e => setLastActiveBefore(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Creating...' : 'Create Segment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SegmentModal;