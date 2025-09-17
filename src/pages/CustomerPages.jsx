import React, { useEffect, useState } from "react";
import CustomerList from "../components/CustomerList";
import SegmentModal from "../components/SegmentModal";
import { fetchCustomers, createSegment } from "../services/api";
import './PageStyles.css'; // Import shared styles

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [currentFilters, setCurrentFilters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSegmentModal, setShowSegmentModal] = useState(false);
  const [isCreatingSegment, setIsCreatingSegment] = useState(false);

  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // This function will be called from CustomerList when filters are applied
  const handleFiltersChange = (filters, filteredData) => {
    setCurrentFilters(filters);
    setFilteredCustomers(filteredData);
  };

  const handleCreateSegment = async (segmentData) => {
    if (!currentFilters) {
      alert("Please apply filters before creating a segment");
      return;
    }

    setIsCreatingSegment(true);
    
    try {
      // Get current user ID (adjust based on your auth system)
      let userId = localStorage.getItem('userId');
      // Validate userId is a 24-character hex string
      if (!userId || !/^[a-fA-F0-9]{24}$/.test(userId)) {
        userId = '000000000000000000000000'; // fallback placeholder
      }

      const segmentPayload = {
        name: segmentData.name,
        description: segmentData.description,
        rules: currentFilters,
        createdBy: userId,
      };

      await createSegment(segmentPayload);
      alert("Segment created successfully! It will be processed shortly.");
      setShowSegmentModal(false);
    } catch (err) {
      console.error("Error creating segment:", err);
      alert("Failed to create segment: " + (err.message || "Unknown error"));
    } finally {
      setIsCreatingSegment(false);
    }
  };

  const canCreateSegment = currentFilters && filteredCustomers.length > 0;

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading customers...</p>
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
            onClick={loadCustomers}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active' || !c.status).length;
  const filteredCount = filteredCustomers.length;
  const averageSpending = customers.length > 0 
    ? (customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / customers.length)
    : 0;

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">👥</div>
          <div>
            <h2 className="page-title">Customer Management</h2>
            <p className="page-subtitle">
              Manage customers and create targeted segments
            </p>
          </div>
        </div>
        
        {/* Statistics Summary */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{totalCustomers}</div>
            <div className="stat-label">Total Customers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{activeCustomers}</div>
            <div className="stat-label">Active Customers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{filteredCount}</div>
            <div className="stat-label">Filtered Results</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              ₹{Math.round(averageSpending).toLocaleString()}
            </div>
            <div className="stat-label">Avg. Spending</div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="content-card">
        <div className="action-bar">
          <div className="left-actions">
            <h3 className="section-title">Customer Segments</h3>
            {currentFilters && (
              <span className="info-text success-text">
                ✅ Filters applied
              </span>
            )}
          </div>
          <div className="right-actions">
            <button
              className={`btn ${canCreateSegment ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowSegmentModal(true)}
              disabled={!canCreateSegment}
            >
              ➕ Create Segment ({filteredCustomers.length} customers)
            </button>
            <button 
              className="btn btn-secondary"
              onClick={loadCustomers}
              title="Refresh Customers"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        
        {!canCreateSegment && (
          <div className="info-text warning-text" style={{ textAlign: 'center', marginBottom: '20px' }}>
            💡 Apply filters to create a customer segment
          </div>
        )}
      </div>

      {/* Customer List Section */}
      <div className="content-card">
        <div className="section-header">
          <h3 className="section-title">All Customers</h3>
          <div className="section-actions">
            <button className="btn btn-outline">
              📊 Export Data
            </button>
            <button className="btn btn-outline">
              📈 Analytics
            </button>
          </div>
        </div>
        
        <CustomerList 
          customers={customers} 
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {/* Segment Creation Modal */}
      {showSegmentModal && (
        <SegmentModal
          onClose={() => setShowSegmentModal(false)}
          onSubmit={handleCreateSegment}
          isLoading={isCreatingSegment}
          customerCount={filteredCustomers.length}
        />
      )}
    </div>
  );
};

export default CustomerPage;