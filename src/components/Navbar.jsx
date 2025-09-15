import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav style={{ display: "flex", gap: "20px", padding: "10px", background: "#f5f5f5" }}>
    <Link to="/customers">Customers</Link>
    <Link to="/orders">Orders</Link>
    <Link to="/segments">Segments</Link>
  </nav>
);

export default Navbar;
