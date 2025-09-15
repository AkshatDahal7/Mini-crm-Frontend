import React, { useEffect, useState } from "react";
import { fetchCustomers } from "../services/api";

const DashboardCustomerWidget = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err) {
        console.error("Error loading customers:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-widget">
      <h3>Recent Customers</h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
        {customers.slice(0, 5).map((c) => (
          <div key={c._id} style={{
            background: '#f7f7fa',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            padding: '16px',
            minWidth: '180px',
            maxWidth: '220px',
            border: '1px solid #e0e6ed',
            fontSize: '15px',
            color: '#333',
          }}>
            <strong style={{ fontSize: '16px' }}>{c.name}</strong>
            <div style={{ color: '#666', marginBottom: '4px' }}>{c.email}</div>
            <div style={{ fontSize: '14px', color: '#888' }}>Total Spend: ₹{c.totalSpend || 0}</div>
            <div style={{ fontSize: '14px', color: '#888' }}>Visits: {c.visits || 0}</div>
            <div style={{ fontSize: '13px', color: '#aaa' }}>Last Active: {c.lastActive ? new Date(c.lastActive).toLocaleDateString() : 'N/A'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCustomerWidget;
