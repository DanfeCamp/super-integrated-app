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

const InterestRateCalculator = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/interest-calculator", title: "Interest Calculator" },
  ];

  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [interest, setInterest] = useState(null);

  const calculateInterest = () => {
    const principalAmount = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const time = parseFloat(years);

    if (isNaN(principalAmount) || isNaN(annualRate) || isNaN(time)) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    const interestAmount = principalAmount * (annualRate / 100) * time;
    setInterest(interestAmount.toFixed(2));
  };

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* Interest Calculator */}
        <div className="flex justify-center">
          <div className="bg-white p-6 border rounded-md shadow-sm w-full max-w-sm">
            <h1 className="text-2xl font-bold mb-4 text-center">
              Interest Calculator
            </h1>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Principal Amount
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="Enter principal amount"
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="Enter annual interest rate"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Number of Years
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="Enter number of years"
                min="0"
              />
            </div>
            <button
              onClick={calculateInterest}
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
            >
              Calculate
            </button>
            {interest !== null && (
              <div className="mt-4 p-4 bg-gray-100 text-green-700 rounded-md">
                <p>The interest is: {interest}</p>
              </div>
            )}
          </div>
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Users can enter the principal amount in the "
              <code>Principal Amount</code>", "
              <code>Annual Interest Rate (%)</code>" and "
              <code>Number of Years</code>" in the input field.
            </li>
            <li className="ml-4">
              Users can click the "<code>Calculate</code>" button to compute the
              interest based on the entered values.
            </li>
            <li className="ml-4">
              Users can see the calculated interest displayed below the "
              <code>Calculate</code>" button once the calculation is complete.
            </li>
            <li className="ml-4">
              Users can see an error message if any of the input fields are left
              empty or contain invalid values.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default InterestRateCalculator;
