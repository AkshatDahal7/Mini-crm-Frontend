
import React, { useEffect, useState } from "react";
import "../styles.css";
import { fetchSegments, sendCampaign } from "../services/api";
import Card from "../components/Card";

function Segment() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [campaignResult, setCampaignResult] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const loadSegments = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSegments();
        setSegments(data);
      } catch (err) {
        setError("Failed to load segments");
      } finally {
        setLoading(false);
      }
    };
    loadSegments();
  }, []);

  return (
    <div className="page-container">
      <h2>Customer Segments</h2>
      {loading ? (
        <p>Loading segments...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : segments.length === 0 ? (
        <p>No segments found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
          {segments.map(seg => (
            <Card key={seg._id || seg.id}>
              <div style={{ padding: '8px 2px' }}>
                <h3 style={{ margin: '0 0 6px 0', color: '#4f46e5' }}>{seg.name}</h3>
                <div style={{ color: '#555', marginBottom: '6px' }}>{seg.description}</div>
                {seg.rules && (
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                    <strong>Rules:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                      <li>Min Spend: ₹{seg.rules.minSpend || 0}</li>
                      <li>Max Spend: ₹{seg.rules.maxSpend || '∞'}</li>
                      <li>Min Visits: {seg.rules.minVisits || 0}</li>
                      {seg.rules.lastActiveAfter && <li>Active After: {new Date(seg.rules.lastActiveAfter).toLocaleDateString()}</li>}
                      {seg.rules.lastActiveBefore && <li>Active Before: {new Date(seg.rules.lastActiveBefore).toLocaleDateString()}</li>}
                    </ul>
                  </div>
                )}
                <div style={{ fontSize: '13px', color: '#059669', marginBottom: '4px' }}>
                  <strong>Customer Count:</strong> {seg.customerCount || (seg.customerIds ? seg.customerIds.length : 'N/A')}
                </div>
                <div style={{ fontSize: '13px', color: '#dc2626', marginBottom: '4px' }}>
                  <strong>Created By:</strong> {seg.createdBy || 'Unknown'}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  <strong>Created At:</strong> {seg.createdAt ? new Date(seg.createdAt).toLocaleString() : 'N/A'}
                </div>
  return (
    <div className="page-container">
      <h2>Customer Segments</h2>
      {loading ? (
        <p>Loading segments...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : segments.length === 0 ? (
        <p>No segments found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
          {segments.map(seg => (
            <Card key={seg._id || seg.id}>
              <div style={{ padding: '8px 2px' }}>
                <h3 style={{ margin: '0 0 6px 0', color: '#4f46e5' }}>{seg.name}</h3>
                <div style={{ color: '#555', marginBottom: '6px' }}>{seg.description}</div>
                {seg.rules && (
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                    <strong>Rules:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                      <li>Min Spend: ₹{seg.rules.minSpend || 0}</li>
                      <li>Max Spend: ₹{seg.rules.maxSpend || '∞'}</li>
                      <li>Min Visits: {seg.rules.minVisits || 0}</li>
                      {seg.rules.lastActiveAfter && <li>Active After: {new Date(seg.rules.lastActiveAfter).toLocaleDateString()}</li>}
                      {seg.rules.lastActiveBefore && <li>Active Before: {new Date(seg.rules.lastActiveBefore).toLocaleDateString()}</li>}
                    </ul>
                  </div>
                )}
                <div style={{ fontSize: '13px', color: '#059669', marginBottom: '4px' }}>
                  <strong>Customer Count:</strong> {seg.customerCount || (seg.customerIds ? seg.customerIds.length : 'N/A')}
                </div>
                <div style={{ fontSize: '13px', color: '#dc2626', marginBottom: '4px' }}>
                  <strong>Created By:</strong> {seg.createdBy || 'Unknown'}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  <strong>Created At:</strong> {seg.createdAt ? new Date(seg.createdAt).toLocaleString() : 'N/A'}
                </div>
                <button style={{ marginTop: '10px', padding: '8px 16px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => { setSelectedSegment(seg); setShowSendModal(true); }}>Send Campaign</button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {/* Send Campaign Modal */}
      {showSendModal && selectedSegment && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '32px', borderRadius: '12px', minWidth: '320px', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
            <h3>Send Campaign to Segment: {selectedSegment.name}</h3>
            <form onSubmit={async e => {
              e.preventDefault();
              setSending(true);
              setCampaignResult(null);
              const form = e.target;
              const name = form.name.value;
              const type = form.type.value;
              const message = form.message.value;
              try {
                const result = await sendCampaign({ name, type, segmentId: selectedSegment._id, message });
                setCampaignResult(result.campaign);
              } catch (err) {
                setCampaignResult({ error: err.message });
              } finally {
                setSending(false);
              }
            }}>
              <div style={{ marginBottom: '12px' }}>
                <label>Campaign Name</label>
                <input name="name" required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Type</label>
                <select name="type" required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label>Message</label>
                <textarea name="message" required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
              </div>
              <button type="submit" disabled={sending} style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{sending ? 'Sending...' : 'Send Campaign'}</button>
              <button type="button" style={{ marginLeft: '10px', padding: '8px 16px', background: '#aaa', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => { setShowSendModal(false); setSelectedSegment(null); setCampaignResult(null); }}>Cancel</button>
            </form>
            {campaignResult && (
              <div style={{ marginTop: '18px', color: campaignResult.error ? 'red' : '#059669' }}>
                {campaignResult.error ? (
                  <>Error: {campaignResult.error}</>
                ) : (
                  <>
                    <strong>Campaign Sent!</strong><br />
                    Sent: {campaignResult.sentCount}<br />
                    Failed: {campaignResult.failedCount}<br />
                    Recipients: {campaignResult.recipients ? campaignResult.recipients.length : 0}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Segment;
