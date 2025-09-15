import React from "react";

const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 15px",
        background: "#007bff",
        border: "none",
        color: "white",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

export default Button;
