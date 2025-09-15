import React from "react";

const Card = ({ children, style }) => (
  <div style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "10px", ...style }}>
    {children}
  </div>
);

export default Card;
