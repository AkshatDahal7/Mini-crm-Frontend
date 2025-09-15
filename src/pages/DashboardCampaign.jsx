import React from "react";

const DashboardCampaignWidget = ({ campaigns = [] }) => {
  return (
    <div className="list-container">
      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <div key={campaign._id || campaign.id} className="card">
            <h4>{campaign.name || "Unnamed Campaign"}</h4>
            <p>Status: {campaign.status || "N/A"}</p>
            {campaign.metrics && (
              <p>
                Sent: {campaign.metrics.sent || 0}, Opened:{" "}
                {campaign.metrics.opened || 0}, Clicked:{" "}
                {campaign.metrics.clicked || 0}
              </p>
            )}
          </div>
        ))
      ) : (
        <div className="empty-state">
          <h3>No campaigns running</h3>
          <p>Campaign statistics will appear here once you start campaigns</p>
        </div>
      )}
    </div>
  );
};

export default DashboardCampaignWidget;
