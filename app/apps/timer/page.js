"use client";

/**
 * External dependencies.
 */
import React, { useState, useEffect } from "react";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";

const Timer = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/timer", title: "Timer" },
  ];

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = () => {
    const milliseconds = Math.floor((time % 1000) / 10); // Get milliseconds up to two digits
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 100);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* Timer */}
        <div className="py-8 sm:py-16 flex flex-col gap-8 border rounded-md shadow-sm">
          <div className="text-4xl sm:text-5xl font-bold text-center">
            {formatTime()}
          </div>
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                onClick={handleStart}
              >
                Start
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm"
                onClick={handlePause}
              >
                Pause
              </button>
            )}
            <button
              className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Users can start the timer by clicking the "Start" button. Once
              started, the timer will increment every 10 milliseconds.
            </li>
            <li className="ml-4">
              Users can pause the timer by clicking the "Pause" button. Pausing
              the timer will stop it from incrementing.
            </li>
            <li className="ml-4">
              Users can reset the timer to zero by clicking the "Reset" button.
              This action stops the timer and sets the displayed time back to "
              <code>00:00:00.00</code>".
            </li>
            <li className="ml-4">
              The timer displays milliseconds with up to two digits of
              precision.
            </li>
            <li className="ml-4">
              Time is updated in real-time, reflecting changes made to the timer
              state.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default Timer;
