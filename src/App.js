import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Segment from "./pages/Segments";
import CustomerPage from "./pages/CustomerPages"; // ✅ import the new customer page
import OrderPage from "./pages/OrderPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/segment" element={<Segment />} />
        <Route path="/customers" element={<CustomerPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
