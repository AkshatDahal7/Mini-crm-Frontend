import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreateCustomer from "../components/CreateCustomerN";
import CreateOrder from "../components/CreateOrderN";
import SegmentList from "../components/SegmentList";
import SuccessFailure from "../components/SuccessFailure";
import DashboardCustomer from "../pages/DashboardCustomer";
import DashboardOrder from "../pages/DashboardOrder";
import "../Dashboard.css";

import {
  fetchCustomers,
  createCustomer,
  fetchOrders,
  createOrder,
  fetchSegments,
  createSegment,
  fetchCampaigns,
} from "../services/api";

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [segments, setSegments] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Decode JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ name: payload.name, email: payload.email });
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [customersData, ordersData, segmentsData, campaignsData] =
          await Promise.all([
            fetchCustomers(),
            fetchOrders(),
            fetchSegments(),
            fetchCampaigns(),
          ]);
        setCustomers(customersData || []);
        setOrders(ordersData || []);
        setSegments(segmentsData || []);
        setCampaigns(campaignsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handlers
  const handleCreateCustomer = async (customerData) => {
    try {
      const newCustomer = await createCustomer(customerData);
      setCustomers((prev) => [newCustomer, ...prev]);
      return newCustomer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      const newOrder = await createOrder(orderData);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleCreateSegment = async (segmentData) => {
    try {
      const newSegment = await createSegment(segmentData);
      setSegments((prev) => [...prev, newSegment]);
      alert(`✅ Segment "${newSegment.name}" created!`);
    } catch (err) {
      console.error("Failed to create segment:", err);
      alert("❌ Failed to create segment. Check console.");
    }
  };

  const handleCreateAICampaign = async () => {
    try {
      const ideas = [
        "Boost your productivity with our new features!",
        "Exclusive offer just for you — limited time only!",
        "Upgrade today and enjoy premium benefits instantly!",
        "Discover smarter ways to manage your business.",
        "Get ahead of competitors with our latest tools!"
      ];
      const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];

      const totalCustomers = Array.isArray(customers) ? customers.length : 0;
      const sent = Math.floor(totalCustomers * (0.9 + Math.random() * 0.03));
      const failed = totalCustomers - sent;

      const newCampaign = {
        id: Date.now(),
        title: "AI Generated Campaign",
        description: randomIdea,
        status: "Draft",
        sent,
        failed
      };

      setCampaigns((prev) => [newCampaign, ...prev]);
      alert("✅ AI Campaign generated!");
    } catch (err) {
      console.error("Error generating campaign:", err);
      alert("❌ Failed to generate campaign");
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard-content">
          {user && <div>Logged in as: {user.name} ({user.email})</div>}
          <div className="loading-text">
            <div className="spinner"></div>
            Loading dashboard data...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard-content">
          {user && <div>Logged in as: {user.name} ({user.email})</div>}
          <div className="alert error">
            <strong>Error loading dashboard:</strong> {error}
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        {user && <div>Logged in as: {user.name} ({user.email})</div>}
        <h1>Marketing Campaign Dashboard</h1>

        {/* First Row - Customers & Orders */}
        <div className="dashboard-grid">
          <div className="dashboard-section">
            <h2>👥 Customers ({customers.length})</h2>
            <CreateCustomer onCreate={handleCreateCustomer} />
            <DashboardCustomer customers={customers} />
          </div>

          <div className="dashboard-section">
            <h2>🛍️ Orders ({orders.length})</h2>
            {customers.length > 0 ? (
              <CreateOrder customers={customers} onCreate={handleCreateOrder} />
            ) : (
              <div className="alert warning">Add customers first!</div>
            )}
            <DashboardOrder orders={orders} />
          </div>
        </div>

        {/* Second Row - Segments & Campaigns */}
        <div className="dashboard-grid">
          {/* Segments */}
          <div className="dashboard-section">
            <h2>🎯 Audience Segments ({segments.length})</h2>

            {/* Segment Form */}
            <div className="create-segment-form">
              <input type="text" id="segmentName" placeholder="Segment Name" />
              <input type="text" id="segmentDesc" placeholder="Description" />
              <input type="number" id="minSpend" placeholder="Min Spend" />
              <input type="number" id="maxSpend" placeholder="Max Spend" />
              <input type="number" id="minVisits" placeholder="Min Visits" />
              <input type="number" id="lastActive" placeholder="Last Active (days)" />
              <button
                onClick={() => {
                  const name = document.getElementById("segmentName").value;
                  const description = document.getElementById("segmentDesc").value;
                  const minSpend = parseFloat(document.getElementById("minSpend").value) || 0;
                  const maxSpend = parseFloat(document.getElementById("maxSpend").value) || 0;
                  const minVisits = parseInt(document.getElementById("minVisits").value) || 0;
                  const lastActive = parseInt(document.getElementById("lastActive").value) || 0;
                  if (!name) return alert("Segment name required!");
                  handleCreateSegment({ name, description, minSpend, maxSpend, minVisits, lastActive });
                }}
              >
                Create Segment
              </button>
            </div>

            <SegmentList segments={segments} />
          </div>

          {/* Campaign Analytics */}
          <div className="dashboard-section success-failure-section">
            <h2>📊 Campaign Analytics</h2>
            {campaigns.length > 0 ? (
              <SuccessFailure campaigns={campaigns} />
            ) : (
              <div className="empty-state">
                <h3>No campaign data</h3>
                <p>Campaign statistics will appear here once you start running campaigns</p>
                <small>Campaigns: {campaigns.length} (Type: {typeof campaigns})</small>
              </div>
            )}

            {/* AI Campaign Generator */}
            <div style={{ marginTop: "1.5rem" }}>
              <button className="btn-primary" onClick={handleCreateAICampaign}>
                🚀 Generate AI Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="form-container" style={{ marginTop: "1.5rem" }}>
          <div className="form-grid-2">
            <div>Total Customers: {customers.length}</div>
            <div>Total Orders: {orders.length}</div>
            <div>Active Segments: {segments.length}</div>
            <div>
              Total Revenue: ₹
              {orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Toasts */}
        <div id="toast-container" style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}></div>
      </div>
    </div>
  );
};

export default Dashboard;
