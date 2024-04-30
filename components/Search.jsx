"use client";

/**
 * External dependencies.
 */
import React, { useCallback, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";

/**
 * Internal dependencies.
 */
import { APPS } from "@utils";

const Search = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const router = useRouter();
  const maxNumberOfSuggestion = 5;
  const options = APPS.map((option) => {
    return {
      value: option.link,
      label: option.title,
      lowerCaseLabel: option.title.toLowerCase(),
    };
  });

  const handleSelectChange = (selected) => {
    if (selected?.value) {
      router.push(selected.value);
      setSelectedOption("");
    }
  };

  // Filter the suggestion manually as no built-in method was found
  // which allows for limiting the number of suggestions.
  const handleInputChange = useCallback((input) => {
    const searchInput = input.toLowerCase();
    const filteredOptions = options
      .filter((option) => {
        return option.lowerCaseLabel.includes(searchInput);
      })
      .slice(0, maxNumberOfSuggestion);

    setSuggestions(filteredOptions.length ? filteredOptions : []);
  }, []);

  // Style for suggestions dropdown.
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      ...{
        "& ::-webkit-scrollbar": {
          height: "100%",
          width: "5px",
          marginLeft: "5px",
        },
        "& ::-webkit-scrollbar-thumb": {
          backgroundColor: "var(--nav-color)",
        },
        "& ::-webkit-scrollbar-track, & ::-webkit-scrollbar-thumb": {
          borderRadius: "21px",
        },
      },
    }),
  };

  return (
    <div className="w-full min-w-60">
      <Select
        value={selectedOption}
        onChange={handleSelectChange}
        onInputChange={handleInputChange}
        instanceId="select-box"
        className="w-full"
        isClearable={true}
        escapeClearsValue={true}
        options={suggestions}
        classNamePrefix="react-select"
        placeholder="Search apps..."
        noOptionsMessage={({ inputValue }) => {
          return inputValue === "" ? "Try typing app name" : "App not found";
        }}
        styles={customStyles}
        maxMenuHeight={400}
      />
    </div>
  );
};

export default Search;
