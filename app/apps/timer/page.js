"use client";

/**
 * External dependencies.
 */
import React, { useState, useEffect, useMemo } from "react";

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

  const hours = useMemo(() => {
    return Math.floor((time / (1000 * 60 * 60)) % 24)
      .toString()
      .padStart(2, "0");
  }, [time]);

  const minutes = useMemo(() => {
    return Math.floor((time / (1000 * 60)) % 60)
      .toString()
      .padStart(2, "0");
  }, [time]);

  const seconds = useMemo(() => {
    return Math.floor((time / 1000) % 60)
      .toString()
      .padStart(2, "0");
  }, [time]);

  const milliseconds = useMemo(() => {
    return Math.floor((time % 1000) / 10)
      .toString()
      .padStart(2, "0");
  }, [time]);

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
          <div className="flex flex-col items-center justify-center w-full h-full gap-8 sm:gap-16">
            <div className="flex justify-center gap-3 sm:gap-8">
              <div className="flex flex-col gap-5 relative">
                <div className="h-14 w-14 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex justify-between items-center bg-[#343650] rounded-lg">
                  <div className="relative h-2 w-2 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-[#191A24]"></div>
                  <span className="lg:text-7xl sm:text-6xl text-2xl font-semibold text-[#a5b4fc]">
                    {hours}
                  </span>
                  <div className="relative h-2 w-2 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-[#191A24]"></div>
                </div>
                <span className="text-[#8486A9] text-xs sm:text-2xl text-center font-medium">
                  {hours <= 1 ? "Hour" : "Hours"}
                </span>
              </div>
              <div className="flex flex-col gap-5 relative">
                <div className="h-14 w-14 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex justify-between items-center bg-[#343650] rounded-lg">
                  <div className="relative h-2 w-2 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-[#191A24]"></div>
                  <span className="lg:text-7xl sm:text-6xl text-2xl font-semibold text-[#a5b4fc]">
                    {minutes}
                  </span>
                  <div className="relative h-2 w-2 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-[#191A24]"></div>
                </div>
                <span className="text-[#8486A9] text-xs sm:text-2xl text-center capitalize">
                  {minutes <= 1 ? "Minute" : "Minutes"}
                </span>
              </div>
              <div className="flex flex-col gap-5 relative">
                <div className="h-14 w-14 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex justify-between items-center bg-[#343650] rounded-lg">
                  <div className="relative h-2 w-2 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-[#191A24]"></div>
                  <span className="lg:text-7xl sm:text-6xl text-2xl font-semibold text-[#a5b4fc]">
                    {seconds}
                  </span>
                  <div className="relative h-2 w-2 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-[#191A24]"></div>
                </div>
                <span className="text-[#8486A9] text-xs sm:text-2xl text-center capitalize">
                  {seconds <= 1 ? "Second" : "Seconds"}
                </span>
              </div>
              <div className="flex flex-col gap-5 relative">
                <div className="h-14 w-14 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex justify-between items-center bg-[#343650] rounded-lg">
                  <div className="relative h-2 w-2 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-[#191A24]"></div>
                  <span className="lg:text-7xl sm:text-6xl text-2xl font-semibold text-[#a5b4fc]">
                    {milliseconds}
                  </span>
                  <div className="relative h-2 w-2 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-[#191A24]"></div>
                </div>
                <span className="text-[#8486A9] text-xs sm:text-2xl text-center capitalize">
                  {milliseconds <= 1 ? "Millisecond" : "Milliseconds"}
                </span>
              </div>
            </div>
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
