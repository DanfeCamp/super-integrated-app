"use client";

/**
 * External dependencies.
 */
import React, { useState } from "react";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";

const Home = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/apps/calculator", title: "Calculator" },
  ];

  const [error, setError] = useState("");
  const [result, setResult] = useState("0");
  const [formattedResult, setFormattedResult] = useState("0");
  const [isCalculatedValue, setIsCalculatedValue] = useState(false);

  const KEYS = [
    "(",
    ")",
    "%",
    "AC",
    "7",
    "8",
    "9",
    "÷",
    "4",
    "5",
    "6",
    "×",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "=",
    "+",
  ];

  const handleClick = (e) => {
    setIsCalculatedValue(false);
    const key = e.target.innerText;

    if (key === "AC") {
      setError("");
      setResult("0");
      setFormattedResult("0");
      return;
    }

    if (key === "=") {
      try {
        const _result = eval(result);
        if (isNaN(_result)) {
          setResult("0");
          setFormattedResult("0");
          setError("Undefined");
        } else if (_result === Infinity) {
          setResult("0");
          setFormattedResult("0");
          setError("Infinity");
        } else {
          setResult(_result);
          setFormattedResult(_result);
        }
      } catch (error) {
        setError(error.message);
      }
      setIsCalculatedValue(true);
      return;
    }

    setError("");
    setResult((prev) => {
      let _key = key;
      if (key === "÷") {
        _key = "/";
      }
      if (key === "×") {
        _key = "*";
      }
      return prev === "0" || (isCalculatedValue && !isNaN(_key))
        ? _key
        : prev + _key;
    });
    setFormattedResult((prev) => {
      return prev === "0" || (isCalculatedValue && !isNaN(key))
        ? key
        : prev + key;
    });
  };

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* Calculator */}
        <div className="mx-auto max-w-md border rounded-md shadow-sm w-full flex flex-col gap-4 p-4 text-black">
          {/* Result */}
          <div className="border border-gray-300 rounded-md text-right py-2 px-4 text-xl">
            {formattedResult}
          </div>

          {/* Error Message */}
          {error && (
            <div className="border border-red-400 rounded-md py-2 px-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {KEYS.map((key) => {
              return (
                <button
                  onClick={handleClick}
                  className="rounded-md border border-gray-300 py-2 hover:bg-gray-200"
                  key={key}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Perform basic arithmetic operations like addition, subtraction,
              multiplication, and division.
            </li>
            <li className="ml-4">
              Use the clear (<code>AC</code>) button to reset the current input.
            </li>
            <li className="ml-4">
              Press the equals (<code>=</code>) button to calculate and display
              the result.
            </li>
            <li className="ml-4">
              Utilize special functions like percentage (<code>%</code>) and
              parentheses for complex calculations.
            </li>
            <li className="ml-4">
              View the error message area for any calculation errors.
            </li>
            <li className="ml-4">
              Check the result display for the current input and calculated
              results.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default Home;
