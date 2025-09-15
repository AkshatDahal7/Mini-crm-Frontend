import React, { useState } from "react";

const CreateCustomer = ({ onCreate }) => {
  const [customer, setCustomer] = useState({ name: "", email: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer.name || !customer.email) return;
    onCreate(customer);
    setCustomer({ name: "", email: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Name</label>
        <input
          placeholder="Enter customer name"
          value={customer.name}
          onChange={e => setCustomer({...customer, name: e.target.value})}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
            background: '#f7f7fa',
            marginTop: '4px',
            marginBottom: '2px',
            transition: 'border-color 0.2s',
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Email</label>
        <input
          placeholder="Enter customer email"
          value={customer.email}
          onChange={e => setCustomer({...customer, email: e.target.value})}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '16px',
            background: '#f7f7fa',
            marginTop: '4px',
            marginBottom: '2px',
            transition: 'border-color 0.2s',
          }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          Total Spend
          <span title="Total amount spent by the customer" style={{ marginLeft: '6px', color: '#888', cursor: 'help' }}>ⓘ</span>
        </label>
        <input type="number" min="0" placeholder="Total Spend (₹)" value={customer.totalSpend || 0} onChange={e => setCustomer({...customer, totalSpend: Number(e.target.value)})} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          Visits
          <span title="Number of times the customer has made a purchase" style={{ marginLeft: '6px', color: '#888', cursor: 'help' }}>ⓘ</span>
        </label>
        <input type="number" min="0" placeholder="Number of Visits" value={customer.visits || 0} onChange={e => setCustomer({...customer, visits: Number(e.target.value)})} />
      </div>
      <button type="submit">Add Customer</button>
    </form>
  );
};

export default CreateCustomer;
