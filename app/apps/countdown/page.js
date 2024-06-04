"use client";

/**
 * External dependencies.
 */
import React, { useCallback, useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";

const Home = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/apps/countdown", title: "Countdown" },
  ];

  const notify = () =>
    toast.success("Time's up! Your countdown has finished.", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const timerRef = useRef(null);
  const [countDownTime, setCountDownTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [timerRunning, setTimerRunning] = useState(false);

  const getTimeDifference = useCallback(() => {
    const currentTime = new Date().getTime();
    const timeDifference = countDownTime - currentTime;
    if (timeDifference <= 0 && timerRunning) {
      notify();
      setTimeLeft({
        hours: "00",
        minutes: "00",
        seconds: "00",
      });
      setTimerRunning(false);
      clearInterval(timerRef.current);
    } else {
      const hours = Math.floor(
        (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      )
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");
      setTimeLeft({ hours, minutes, seconds });
    }
  }, [countDownTime]);

  const handleTimeChange = (e) => {
    const [hours, minutes, seconds] = e.target.value.split(":");
    setTimeLeft({
      hours: hours.padStart(2, "0"),
      minutes: minutes.padStart(2, "0"),
      seconds: seconds.padStart(2, "0"),
    });
  };

  const toggleTimer = () => {
    if (timerRunning) {
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
      const now = new Date();
      const futureTime = new Date(
        now.getTime() +
          parseInt(timeLeft.hours) * 3600000 +
          parseInt(timeLeft.minutes) * 60000 +
          parseInt(timeLeft.seconds) * 1000
      ).getTime();
      setCountDownTime(futureTime);
    }
  };

  const resetTimer = () => {
    setCountDownTime(0);
    setTimerRunning(false);
    setTimeLeft({
      hours: "00",
      minutes: "00",
      seconds: "00",
    });
    clearInterval(timerRef.current);
  };

  const startCountDown = useCallback(() => {
    timerRef.current = setInterval(() => {
      getTimeDifference();
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [getTimeDifference]);

  useEffect(() => {
    if (countDownTime > 0 && timerRunning) {
      startCountDown();
    }
    return () => clearInterval(startCountDown);
  }, [countDownTime, startCountDown, timerRunning]);

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        <div className="w-full flex flex-col gap-4 sm:gap-8 border rounded-md shadow-sm py-8 sm:py-16">
          {/* Countdown */}
          <div className="flex justify-center gap-3 sm:gap-8">
            <div className="flex flex-col gap-5 relative">
              <div className="h-14 w-14 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex justify-between items-center bg-[#343650] rounded-lg">
                <div className="relative h-2 w-2 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-[#191A24]"></div>
                <span className="lg:text-7xl sm:text-6xl text-3xl font-semibold text-[#a5b4fc]">
                  {timeLeft.hours}
                </span>
                <div className="relative h-2 w-2 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-[#191A24]"></div>
              </div>
              <span className="text-[#8486A9] text-xs sm:text-2xl text-center font-medium">
                {timeLeft.hours == 1 ? "Hour" : "Hours"}
              </span>
            </div>
            <div className="flex flex-col gap-5 relative">
              <div className="h-14 w-14 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex justify-between items-center bg-[#343650] rounded-lg">
                <div className="relative h-2 w-2 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-[#191A24]"></div>
                <span className="lg:text-7xl sm:text-6xl text-3xl font-semibold text-[#a5b4fc]">
                  {timeLeft.minutes}
                </span>
                <div className="relative h-2 w-2 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-[#191A24]"></div>
              </div>
              <span className="text-[#8486A9] text-xs sm:text-2xl text-center capitalize">
                {timeLeft.minutes == 1 ? "Minute" : "Minutes"}
              </span>
            </div>
            <div className="flex flex-col gap-5 relative">
              <div className="h-14 w-14 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex justify-between items-center bg-[#343650] rounded-lg">
                <div className="relative h-2 w-2 sm:h-3 sm:w-3 !-left-[6px] rounded-full bg-[#191A24]"></div>
                <span className="lg:text-7xl sm:text-6xl text-3xl font-semibold text-[#a5b4fc]">
                  {timeLeft.seconds}
                </span>
                <div className="relative h-2 w-2 sm:h-3 sm:w-3 -right-[6px] rounded-full bg-[#191A24]"></div>
              </div>
              <span className="text-[#8486A9] text-xs sm:text-2xl text-center capitalize">
                {timeLeft.seconds == 1 ? "Second" : "Seconds"}
              </span>
            </div>
          </div>

          {/* Toast Notification */}
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          {/* Time Input */}
          <div className="flex flex-col justify-center items-center w-full">
            <input
              type="time"
              className="bg-gray-50 border border-gray-300 leading-none text-gray-900 rounded-lg disabled:bg-gray-300 focus:ring-blue-500 focus:border-blue-500 w-48 py-3 px-6 text-center"
              min="00:00:00"
              max="24:00:00"
              step="1"
              value={`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
              onChange={handleTimeChange}
              disabled={timerRunning ? true : false}
            />
          </div>

          {/* Buttons */}
          <div className="w-full flex justify-center gap-4">
            <button
              onClick={toggleTimer}
              className={`align-middle select-none font-medium text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm py-3 px-6 rounded-lg ${
                timerRunning ? "bg-red-500" : "bg-blue-500"
              } text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none`}
            >
              {timerRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="align-middle select-none font-medium text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm py-3 px-6 rounded-lg bg-blue-500 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
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
              Users can enter their desired countdown time in the time input
              field, specifying hours, minutes, and seconds.
            </li>
            <li className="ml-4">
              Users can initiate the countdown timer by clicking the "
              <code>Start</code>" button. The timer will commence counting down
              from the specified time.
            </li>
            <li className="ml-4">
              If users need to temporarily halt the countdown, they can click
              the "<code>Pause</code>" button to pause the timer.
            </li>
            <li className="ml-4">
              Users have the option to reset the countdown timer and begin again
              by clicking the "<code>Restart</code>" button. This action will
              revert the timer to the initial countdown time.
            </li>
            <li className="ml-4">
              Throughout the countdown duration, users can monitor the remaining
              time displayed in hours, minutes, and seconds format.
            </li>
            <li className="ml-4">
              Upon reaching zero, a notification will inform users that the
              countdown has concluded. Users can then take appropriate actions
              based on the completion of the countdown.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default Home;
