"use client";

/**
 * External dependencies.
 */
import React, { useState } from "react";

const FilterBar = ({ options, onOptionSelect }) => {
  const [selectedOption, setSelectedOption] = useState("All");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onOptionSelect(option);
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4">
      {options.map((option, index) => (
        <button
          key={index}
          className={`px-4 py-2 rounded-md shadow-sm border text-sm focus:outline-none ${
            selectedOption === option
              ? "bg-blue-500 text-white py-2 px-4 rounded-md"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
          onClick={() => handleOptionClick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
