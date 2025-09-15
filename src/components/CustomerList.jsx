import React, { useState, useEffect } from 'react';

const CustomerList = ({ customers, onFiltersChange }) => {
  const [rules, setRules] = useState({
    minSpend: 0,
    maxSpend: '',
    minVisits: 0,
    lastActiveAfter: '',
    lastActiveBefore: ''
  });
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Check if any filters are actively set (non-default values)
  const checkActiveFilters = (currentRules) => {
    return (
      currentRules.minSpend > 0 ||
      currentRules.maxSpend !== '' ||
      currentRules.minVisits > 0 ||
      currentRules.lastActiveAfter !== '' ||
      currentRules.lastActiveBefore !== ''
    );
  };

  // Apply rules-based filtering
  const applyFilters = () => {
    const active = checkActiveFilters(rules);
    setHasActiveFilters(active);

    if (!active) {
      setFilteredCustomers(customers);
      onFiltersChange && onFiltersChange(null, customers);
      return;
    }

    const filtered = customers.filter(customer => {
      // Min spend filter
      if (rules.minSpend > 0 && customer.totalSpend < rules.minSpend) {
        return false;
      }

      // Max spend filter
      if (rules.maxSpend !== '' && customer.totalSpend > Number(rules.maxSpend)) {
        return false;
      }

      // Min visits filter
      if (rules.minVisits > 0 && customer.visits < rules.minVisits) {
        return false;
      }

      // Last active after filter (assuming customer has lastActive field)
      if (rules.lastActiveAfter && customer.lastActive) {
        const customerLastActive = new Date(customer.lastActive);
        const filterDate = new Date(rules.lastActiveAfter);
        if (customerLastActive < filterDate) {
          return false;
        }
      }

      // Last active before filter
      if (rules.lastActiveBefore && customer.lastActive) {
        const customerLastActive = new Date(customer.lastActive);
        const filterDate = new Date(rules.lastActiveBefore);
        if (customerLastActive > filterDate) {
          return false;
        }
      }

      return true;
    });

    setFilteredCustomers(filtered);
    
    // Clean rules object (remove empty strings and convert to proper types)
    const cleanRules = {
      minSpend: rules.minSpend || 0,
      ...(rules.maxSpend !== '' && { maxSpend: Number(rules.maxSpend) }),
      minVisits: rules.minVisits || 0,
      ...(rules.lastActiveAfter && { lastActiveAfter: new Date(rules.lastActiveAfter) }),
      ...(rules.lastActiveBefore && { lastActiveBefore: new Date(rules.lastActiveBefore) })
    };

    onFiltersChange && onFiltersChange(cleanRules, filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    const resetRules = {
      minSpend: 0,
      maxSpend: '',
      minVisits: 0,
      lastActiveAfter: '',
      lastActiveBefore: ''
    };
    setRules(resetRules);
    setFilteredCustomers(customers);
    setHasActiveFilters(false);
    onFiltersChange && onFiltersChange(null, customers);
  };

  // Update a specific rule
  const updateRule = (field, value) => {
    const newRules = { ...rules, [field]: value };
    setRules(newRules);
  };

  // Apply filters when rules or customers change
  useEffect(() => {
    applyFilters();
  }, [rules, customers]);

  return (
    <div>
      {/* Filter Controls */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Customer Filters ({filteredCustomers.length} of {customers.length} customers)</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
          {/* Spend Range */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
              Minimum Spend ($)
            </label>
            <input
              type="number"
              min="0"
              value={rules.minSpend}
              onChange={(e) => updateRule('minSpend', Number(e.target.value) || 0)}
              placeholder="0"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
              Maximum Spend ($)
            </label>
            <input
              type="number"
              min="0"
              value={rules.maxSpend}
              onChange={(e) => updateRule('maxSpend', e.target.value)}
              placeholder="No limit"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          {/* Visits */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
              Minimum Visits
            </label>
            <input
              type="number"
              min="0"
              value={rules.minVisits}
              onChange={(e) => updateRule('minVisits', Number(e.target.value) || 0)}
              placeholder="0"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          {/* Last Active After */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
              Active After
            </label>
            <input
              type="date"
              value={rules.lastActiveAfter}
              onChange={(e) => updateRule('lastActiveAfter', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          {/* Last Active Before */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>
              Active Before
            </label>
            <input
              type="date"
              value={rules.lastActiveBefore}
              onChange={(e) => updateRule('lastActiveBefore', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={clearFilters}
              style={{ 
                padding: '8px 15px', 
                backgroundColor: '#6c757d', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#495057' }}>
            <strong>Active filters:</strong>
            {rules.minSpend > 0 && <span style={{ marginLeft: '10px', backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '3px' }}>Min Spend: ${rules.minSpend}</span>}
            {rules.maxSpend !== '' && <span style={{ marginLeft: '10px', backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '3px' }}>Max Spend: ${rules.maxSpend}</span>}
            {rules.minVisits > 0 && <span style={{ marginLeft: '10px', backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '3px' }}>Min Visits: {rules.minVisits}</span>}
            {rules.lastActiveAfter && <span style={{ marginLeft: '10px', backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '3px' }}>Active After: {rules.lastActiveAfter}</span>}
            {rules.lastActiveBefore && <span style={{ marginLeft: '10px', backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '3px' }}>Active Before: {rules.lastActiveBefore}</span>}
          </div>
        )}
      </div>

      {/* Customer Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Total Spend</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Visits</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <tr key={customer.id || customer._id || index} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{customer.name}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{customer.email}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>${customer.totalSpend}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{customer.visits}</td>
                  <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                    {customer.lastActive ? new Date(customer.lastActive).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
                  No customers match the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;