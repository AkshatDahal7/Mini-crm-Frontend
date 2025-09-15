import React, { useState } from "react";

/**
 * CreateOrder expects `customers` in normalized shape:
 * [{ id: "...", name: "...", email: "..." }, ...]
 *
 * It calls onCreate(payload) where payload is:
 * { customer: "<id>", items: [{ productName, quantity, price }], totalAmount }
 */
const CreateOrder = ({ customers = [], onCreate }) => {
  const [order, setOrder] = useState({ customerId: "", product: "", amount: "" , quantity: 1});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order.customerId || !order.product) return alert("Please select a customer and enter product");

    // call parent's onCreate with flexible data (parent will normalize)
    try {
      // Build payload matching backend schema
      const payload = {
        customer: order.customerId, // backend expects 'customer'
        items: [
          {
            product: order.product,
            quantity: Number(order.quantity || 1),
            price: Number(order.amount || 0)
          }
        ],
        totalAmount: Number(order.amount || 0) * Number(order.quantity || 1)
      };
      await onCreate(payload);

      // reset form
      setOrder({ customerId: "", product: "", amount: "", quantity: 1 });
    } catch (err) {
      console.error("Create order failed:", err);
      alert("Failed to create order");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
      <select
        value={order.customerId}
        onChange={(e) => setOrder({ ...order, customerId: e.target.value })}
        required
      >
        <option value="">Select Customer</option>
        {customers.map((c) => {
          const cid = c.id || c._id || c._userId;
          return (
            <option key={cid} value={cid}>
              {c.name || c.email || cid}
            </option>
          );
        })}
      </select>

      <input
        placeholder="Product name"
        value={order.product}
        onChange={(e) => setOrder({ ...order, product: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={order.amount}
        onChange={(e) => setOrder({ ...order, amount: e.target.value })}
        min="0"
        required
      />

      <input
        type="number"
        placeholder="Qty"
        value={order.quantity}
        onChange={(e) => setOrder({ ...order, quantity: e.target.value })}
        min="1"
        style={{ width: "60px" }}
      />

      <button type="submit">Add Order</button>
    </form>
  );
};

export default CreateOrder;
