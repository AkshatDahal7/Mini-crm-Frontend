import React from "react";
import Card from "./Card";


const SegmentList = ({ segments }) => {
  if (!segments || segments.length === 0) {
    return <div className="empty-state">No segments found.</div>;
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
      {segments.map(s => (
        <Card key={s._id || s.id}>
          <div style={{ padding: '8px 2px' }}>
            <h3 style={{ margin: '0 0 6px 0', color: '#4f46e5' }}>{s.name}</h3>
            <div style={{ color: '#555', marginBottom: '6px' }}>{s.description}</div>
            {s.rules && (
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                <strong>Rules:</strong>
                <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                  <li>Min Spend: ₹{s.rules.minSpend || 0}</li>
                  <li>Max Spend: ₹{s.rules.maxSpend || '∞'}</li>
                  <li>Min Visits: {s.rules.minVisits || 0}</li>
                  {s.rules.lastActiveAfter && <li>Active After: {new Date(s.rules.lastActiveAfter).toLocaleDateString()}</li>}
                  {s.rules.lastActiveBefore && <li>Active Before: {new Date(s.rules.lastActiveBefore).toLocaleDateString()}</li>}
                </ul>
              </div>
            )}
            <div style={{ fontSize: '13px', color: '#059669', marginBottom: '4px' }}>
              <strong>Customer Count:</strong> {s.customerCount || (s.customerIds ? s.customerIds.length : 'N/A')}
            </div>
            <div style={{ fontSize: '13px', color: '#dc2626', marginBottom: '4px' }}>
              <strong>Created By:</strong> {s.createdBy || 'Unknown'}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              <strong>Created At:</strong> {s.createdAt ? new Date(s.createdAt).toLocaleString() : 'N/A'}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SegmentList;
