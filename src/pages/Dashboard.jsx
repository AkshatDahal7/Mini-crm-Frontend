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

  // Decode JWT token to get user info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ name: payload.name, email: payload.email });
      } catch (err) {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Loading dashboard data...");

        const [customersData, ordersData, segmentsData, campaignsData] =
          await Promise.all([
            fetchCustomers(),
            fetchOrders(),
            fetchSegments(),
            fetchCampaigns(),
          ]);

        console.log("Loaded data:", {
          customers: customersData,
          orders: ordersData,
          segments: segmentsData,
          campaigns: campaignsData,
        });

        setCustomers(customersData || []);
        setOrders(ordersData || []);
        setSegments(segmentsData || []);
        setCampaigns(campaignsData || []);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreateCustomer = async (customerData) => {
    try {
      console.log("Creating customer:", customerData);
      const newCustomer = await createCustomer(customerData);
      console.log("Created customer:", newCustomer);
      setCustomers((prevCustomers) => [newCustomer, ...prevCustomers]);
      return newCustomer;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error;
    }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      console.log("Creating order:", orderData);
      const newOrder = await createOrder(orderData);
      console.log("Created order:", newOrder);
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
      return newOrder;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  // Debug logging for customers state changes
  useEffect(() => {
    console.log("Customers state updated:", customers);
    console.log("Customers length:", customers.length);
    console.log("Customers array:", Array.isArray(customers));
  }, [customers]);

  // Handle creating AI campaign (frontend-only demo)
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    const name = e.target.campaignName.value;

    try {
      // Free AI-like API (random joke for demo)
      const response = await fetch("https://api.chucknorris.io/jokes/random");
      const data = await response.json();

      const newCampaign = {
        name,
        message: data.value,
        createdAt: new Date().toISOString(),
      };

      setCampaigns((prev) => [...prev, newCampaign]);

      e.target.reset();

      // Show toast
      const toast = document.createElement("div");
      toast.innerText = `✅ Campaign "${name}" created with AI message!`;
      toast.style.background = "#4f46e5";
      toast.style.color = "white";
      toast.style.padding = "10px";
      toast.style.marginTop = "10px";
      toast.style.borderRadius = "5px";
      document.getElementById("toast-container").appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (err) {
      console.error("Error creating campaign:", err);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard-content">
          {user && (
            <div
              style={{ marginBottom: "10px", color: "#333", fontWeight: "bold" }}
            >
              Logged in as: {user.name} ({user.email})
            </div>
          )}
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
          {user && (
            <div
              style={{ marginBottom: "10px", color: "#333", fontWeight: "bold" }}
            >
              Logged in as: {user.name} ({user.email})
            </div>
          )}
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
        {user && (
          <div
            style={{ marginBottom: "10px", color: "#333", fontWeight: "bold" }}
          >
            Logged in as: {user.name} ({user.email})
          </div>
        )}
        <h1>Marketing Campaign Dashboard</h1>

        {/* First Row - Customers and Orders Widgets */}
        <div className="dashboard-grid">
          {/* Customers Widget */}
          <div className="dashboard-section">
            <h2>👥 Customers ({customers.length})</h2>
            <div className="create-form">
              <div className="form-container">
                <CreateCustomer onCreate={handleCreateCustomer} />
              </div>
            </div>
            <DashboardCustomer customers={customers} />
          </div>

          {/* Orders Widget */}
          <div className="dashboard-section">
            <h2>🛍️ Orders ({orders.length})</h2>
            <div className="create-form">
              <div className="form-container">
                {Array.isArray(customers) && customers.length > 0 ? (
                  <CreateOrder customers={customers} onCreate={handleCreateOrder} />
                ) : (
                  <div className="alert warning">
                    <strong>No customers available!</strong> Please add customers
                    first before creating orders.
                    <br />
                    <small>
                      Current customers: {customers.length} (Type:{" "}
                      {typeof customers})
                    </small>
                  </div>
                )}
              </div>
            </div>
            <DashboardOrder orders={orders} />
          </div>
        </div>

        {/* Second Row - Segments and Analytics */}
        <div className="dashboard-grid">
          {/* Segments Section */}
          <div className="dashboard-section">
            <h2>🎯 Audience Segments ({segments.length})</h2>
            <div className="list-container">
              {Array.isArray(segments) && segments.length > 0 ? (
                <SegmentList segments={segments} />
              ) : (
                <div className="empty-state">
                  <h3>No segments created</h3>
                  <p>
                    Build your first audience segment to start targeting customers
                  </p>
                </div>
              )}
            </div>
          </div>

                    {/* Campaign Analytics */}
          <div className="dashboard-section success-failure-section">
            <h2>📊 Campaign Analytics</h2>
            <div className="component-container">
              {Array.isArray(campaigns) && campaigns.length > 0 ? (
                <SuccessFailure campaigns={campaigns} />
              ) : (
                <div className="empty-state">
                  <h3>No campaign data</h3>
                  <p>
                    Campaign statistics will appear here once you start running
                    campaigns
                  </p>
                  <small>Campaigns: {campaigns.length} (Type: {typeof campaigns})</small>
                </div>
              )}
            </div>

            {/* AI Campaign Generator */}
            <div style={{ marginTop: "1.5rem" }}>
              <button
                className="btn-primary"
                onClick={async () => {
                  try {
                    // Simulate AI text generation (could plug OpenAI or HuggingFace later)
                    const ideas = [
                      "Boost your productivity with our new features!",
                      "Exclusive offer just for you — limited time only!",
                      "Upgrade today and enjoy premium benefits instantly!",
                      "Discover smarter ways to manage your business.",
                      "Get ahead of competitors with our latest tools!"
                    ];
                    const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];

                    const totalCustomers = Array.isArray(customers) ? customers.length : 0;
                    const sent = Math.floor(totalCustomers * (0.9 + Math.random() * 0.03)); // 90–93%
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
                }}
    >
      🚀 Generate AI Campaign
    </button>
  </div>

  {/* Quick Stats */}
  <div className="form-container" style={{ marginTop: "1.5rem" }}>
    <div className="form-section-title">Quick Stats</div>
    <div className="form-grid-2">
      <div className="component-container">
        <h4>Total Customers</h4>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#4f46e5",
          }}
        >
          {Array.isArray(customers) ? customers.length : 0}
        </div>
      </div>
      <div className="component-container">
        <h4>Total Orders</h4>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#059669",
          }}
        >
          {Array.isArray(orders) ? orders.length : 0}
        </div>
      </div>
    </div>
    <div className="form-grid-2">
      <div className="component-container">
        <h4>Active Segments</h4>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#dc2626",
          }}
        >
          {Array.isArray(segments) ? segments.length : 0}
        </div>
      </div>
      <div className="component-container">
        <h4>Total Revenue</h4>
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#7c2d12",
          }}
        >
          ₹
          {Array.isArray(orders) 
            ? orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toLocaleString()
            : 0
          }
        </div>
      </div>
    </div>
  </div>
</div>
        </div>

        {/* Toasts */}
        <div
          id="toast-container"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Dashboard;
