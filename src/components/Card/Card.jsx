import React, { useState } from "react";
import "./Card.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimateSharedLayout } from "framer-motion";
import { UilTimes } from "@iconscout/react-unicons";
import Chart from "react-apexcharts";

// parent Card

const Card = (props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <AnimateSharedLayout>
      {expanded ? (
        <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
      ) : (
        <CompactCard param={props} setExpanded={() => setExpanded(true)} />
      )}
    </AnimateSharedLayout>
  );
};

// Compact Card
function CompactCard({ param, setExpanded }) {
    const handleButtonClick = (event, action) => {
        event.stopPropagation(); // Prevent event from propagating to the card
        action();
      };
  return (
    <motion.div
      className="CompactCard"
      style={{
        background: 'green', // Set background to green
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      }}
      layoutId="expandableCard"
      onClick={setExpanded}
    >
      <div className="card-header">
        <h3>{param.title}</h3>
        <p>Agent: {param.agentName}</p>
      </div>
      <div>
        <button className="confirm-button" onClick={(e) => handleButtonClick(e, () => param.onConfirm(param.id))}>Confirm</button>
        <button className="cancel-button" onClick={(e) => handleButtonClick(e, () => param.onCancel(param.id))}>Cancel</button>
      </div>
    </motion.div>
  );
}


// Expanded Card
function ExpandedCard({ param, setExpanded }) {
  return (
    <motion.div
      className="ExpandedCard"
      style={{
        background: 'green', // Set background to green
        boxShadow: "0px 10px 20px 0px #e0c6f5"
      }}
      layoutId="expandableCard"
    >
      <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
        <UilTimes onClick={setExpanded} />
      </div>
      <h2>{param.title}</h2>
      <p><strong>Overview:</strong> {param.overview}</p>
      <p><strong>What's Included:</strong> {param.whatsIncluded}</p>
      <p><strong>Tour Itinerary:</strong> {param.tourItinerary}</p>
      <p><strong>Price:</strong> ${param.price}</p>
      <p><strong>Duration:</strong> {param.duration} days</p>
      <p><strong>Max Persons:</strong> {param.maxPersons}</p>
    </motion.div>
  );
}

export default Card;
