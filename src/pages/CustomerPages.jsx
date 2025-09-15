import React, { useEffect, useState } from "react";
import CustomerList from "../components/CustomerList";
import SegmentModal from "../components/SegmentModal";
import { fetchCustomers, createSegment } from "../services/api";

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

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Customer Management</h2>
      
      {/* Segment Creation Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowSegmentModal(true)}
          disabled={!canCreateSegment}
          style={{
            padding: '10px 20px',
            backgroundColor: canCreateSegment ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: canCreateSegment ? 'pointer' : 'not-allowed'
          }}
        >
          Create Segment ({filteredCustomers.length} customers)
        </button>
        {!canCreateSegment && (
          <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
            Apply filters to create a segment
          </p>
        )}
      </div>

      <CustomerList 
        customers={customers} 
        onFiltersChange={handleFiltersChange}
      />

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