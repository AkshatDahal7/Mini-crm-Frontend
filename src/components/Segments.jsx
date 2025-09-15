
import React, { useEffect, useState } from "react";
import "../styles.css";
import { fetchSegments } from "../services/api";

function Segment() {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSegments = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchSegments();
        setSegments(data);
      } catch (err) {
        setError("Failed to load segments");
      } finally {
        setLoading(false);
      }
    };
    loadSegments();
  }, []);

  return (
    <div className="page-container">
      <h2>Customer Segments</h2>
      {loading ? (
        <p>Loading segments...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : segments.length === 0 ? (
        <p>No segments found.</p>
      ) : (
        <ul className="segment-list">
          {segments.map((seg) => (
            <li key={seg._id || seg.id}>
              <strong>{seg.name}</strong>
              {seg.description && <> – {seg.description}</>}
              {seg.rules && (
                <div style={{ fontSize: "12px", color: "#555" }}>
                  Rules: Min Spend {seg.rules.minSpend || 0}, Max Spend {seg.rules.maxSpend || "∞"}, Min Visits {seg.rules.minVisits || 0}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Segment;
