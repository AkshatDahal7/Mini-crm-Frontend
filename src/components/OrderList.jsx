import React, { useState } from "react";
import Card from "./Card";
import { updateOrderStatus } from "../services/api";


const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

const OrderList = ({ orders }) => {
  const [orderStatuses, setOrderStatuses] = useState(
    orders.reduce((acc, o) => ({ ...acc, [o._id]: o.status }), {})
  );

  const handleStatusChange = async (orderId, newStatus) => {
    setOrderStatuses(prev => ({ ...prev, [orderId]: newStatus }));
    try {
      await updateOrderStatus(orderId, newStatus);
      // Optionally show a success message or refresh orders
    } catch (err) {
      alert("Failed to update status");
      setOrderStatuses(prev => ({ ...prev, [orderId]: orders.find(o => o._id === orderId).status }));
    }
  };

  return (
    <div>
      {orders.map(o => (
        <Card key={o._id}>
          <p><strong>Order ID:</strong> {o._id}</p>
          <p><strong>Customer ID:</strong> {o.customer}</p>
          <p><strong>Items:</strong></p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
            {o.items && o.items.length > 0 ? (
              o.items.map((item, idx) => (
                <div key={idx} style={{
                  background: '#f0f4fa',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  minWidth: '120px',
                  fontSize: '15px',
                  color: '#333',
                  border: '1px solid #e0e6ed',
                }}>
                  <strong>{item.product}</strong><br />
                  <span style={{ color: '#666' }}>Qty: {item.quantity}</span><br />
                  <span style={{ color: '#666' }}>Price: ₹{item.price}</span>
                </div>
              ))
            ) : (
              <span style={{ color: '#888' }}>No items</span>
            )}
          </div>
          <p><strong>Total Amount:</strong> ₹{o.totalAmount}</p>
          <p>
            <strong>Status:</strong>
            <select
              value={orderStatuses[o._id]}
              onChange={e => handleStatusChange(o._id, e.target.value)}
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </p>
          <p><strong>Created At:</strong> {new Date(o.createdAt).toLocaleString()}</p>
        </Card>
      ))}
    </div>
  );
};

export default OrderList;
