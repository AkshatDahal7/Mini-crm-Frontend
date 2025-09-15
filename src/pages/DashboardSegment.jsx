import React from "react";

const DashboardSegmentWidget = ({ segments = [] }) => {
  return (
    <div className="list-container">
      {segments.length > 0 ? (
        segments.map((segment) => (
          <div key={segment._id || segment.id} className="card">
            <h4>{segment.name}</h4>
            {segment.description && <p>{segment.description}</p>}
            {segment.rules && (
              <p>
                Rules: Min Spend {segment.rules.minSpend || 0}, Max Spend{" "}
                {segment.rules.maxSpend || "∞"}, Min Visits{" "}
                {segment.rules.minVisits || 0}
              </p>
            )}
          </div>
        ))
      ) : (
        <div className="empty-state">
          <h3>No segments created</h3>
          <p>Build your first audience segment to start targeting customers</p>
        </div>
      )}
    </div>
  );
};

export default DashboardSegmentWidget;
