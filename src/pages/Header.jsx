import React from "react";

const Header = ({ user }) => {
  return (
    <header style={{ padding: "15px", background: "#222", color: "#fff" }}>
      <h2>Mini CRM</h2>
      <div style={{ float: "right" }}>
        {user.name} ({user.email})
      </div>
    </header>
  );
};

export default Header;
