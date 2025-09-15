import React from "react";
import Card from "../components/Card";

const StatsCard = ({ title, value }) => {
  return (
    <Card>
      <h3>{title}</h3>
      <p style={{ fontSize: "20px", fontWeight: "bold" }}>{value}</p>
    </Card>
  );
};

export default StatsCard;
