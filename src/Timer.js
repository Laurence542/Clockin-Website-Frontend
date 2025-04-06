import React, { useState, useEffect } from "react";

export default function Timer() {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let startTime = localStorage.getItem("timerStart");
    let interval;

    if (!startTime) {
      // Start new timer if not set
      startTime = Date.now();
      localStorage.setItem("timerStart", startTime);
    }

    const updateTimer = () => {
      const now = Date.now();
      const newElapsedTime = Math.floor((now - startTime) / 1000);
      setElapsedTime(newElapsedTime);
      localStorage.setItem("elapsedTime", newElapsedTime);
    };

    // Update timer every second
    interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return <div>Elapsed Time: {elapsedTime}s</div>;
}
