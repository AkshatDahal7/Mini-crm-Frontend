import React, { useEffect, useState } from "react";
import OrderList from "../components/OrderList";
import { fetchOrders } from "../services/api";
import './PageStyles.css'; // Import shared styles

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h3 className="error-title">Oops! Something went wrong</h3>
          <p className="error-message">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={loadOrders}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">📋</div>
          <div>
            <h2 className="page-title">Order Management</h2>
            <p className="page-subtitle">
              Manage and track all your orders in one place
            </p>
          </div>
        </div>
        
        {/* Statistics Summary */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{totalOrders}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{deliveredOrders}</div>
            <div className="stat-label">Delivered</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{pendingOrders}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{processingOrders}</div>
            <div className="stat-label">Processing</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="content-card">
        <div className="section-header">
          <h3 className="section-title">All Orders</h3>
          <div className="section-actions">
            <button 
              className="btn btn-secondary"
              onClick={loadOrders}
              title="Refresh Orders"
            >
              🔄 Refresh
            </button>
            <button className="btn btn-outline">
              📊 Export
            </button>
          </div>
        </div>
        
        <div className="order-list-container">
          <OrderList orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;