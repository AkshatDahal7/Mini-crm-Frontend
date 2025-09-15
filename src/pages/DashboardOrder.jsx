import React, { useEffect, useState } from "react";
import { fetchOrders } from "../services/api";

const DashboardOrderWidget = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-widget">
      <h3>Recent Orders</h3>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
        {orders.slice(0, 5).map((o) => (
          <div key={o._id} style={{
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
            <strong style={{ fontSize: '16px' }}>Order #{o._id.slice(-6)}</strong>
            <div style={{ color: '#666', marginBottom: '4px' }}>Amount: ₹{o.totalAmount}</div>
            <div style={{ fontSize: '14px', color: '#888' }}>Status: {o.status}</div>
            <div style={{ fontSize: '13px', color: '#aaa' }}>Created: {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}</div>
            <div style={{ fontSize: '13px', color: '#aaa' }}>Items: {o.items && o.items.length > 0 ? o.items.map(i => i.product).join(', ') : 'None'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOrderWidget;
