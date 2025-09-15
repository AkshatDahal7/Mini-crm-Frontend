import React from "react";
import "./SuccessFailure.css"; 

const SuccessFailure = ({ campaigns }) => {
  if (!Array.isArray(campaigns) || campaigns.length === 0) {
    return <p>No campaign data available</p>;
  }

  return (
    <div className="campaign-list">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="campaign-card">
          <h3>{campaign.title}</h3>
          <p className="campaign-description">{campaign.description}</p>

          <div className="campaign-stats">
            <p><strong>Status:</strong> {campaign.status}</p>
            <p><strong>Sent:</strong> {campaign.sent}</p>
            <p><strong>Failed:</strong> {campaign.failed}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuccessFailure;
