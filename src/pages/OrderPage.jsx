import React, { useEffect, useState } from "react";
import OrderList from "../components/OrderList";
import { fetchOrders } from "../services/api"; // make sure this is exported in api.js

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

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Order Management</h2>
      <OrderList orders={orders} />
    </div>
  );
};

export default OrderPage;
