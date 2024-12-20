'use client';
import React, { useState, useEffect } from "react";

export default function Timeclock() {
  const [time, setTime] = useState(new Date());

  // Function to update the time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update every second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Format the current date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(time);

  // Format the current time in 24-hour format
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const result = `${formattedTime} | ${formattedDate}`;

  return <div>{result}</div>;
}
