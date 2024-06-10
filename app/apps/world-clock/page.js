"use client";

/**
 * External dependencies.
 */
import React, { useEffect, useState } from "react";
import Select from "react-select";

/**
 * Internal dependencies.
 */
import {
  Breadcrumb,
  AppContainer,
  DynamicComponent,
  AnalogClock,
} from "@components";
import { TIMEZONES } from "@constants";

const Home = () => {
  const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [selectedOption, setSelectedOption] = useState({
    value: currentTimezone,
    label: currentTimezone,
  });
  const [suggestions, setSuggestions] = useState([]);
  const [time, setTime] = useState("Loading...");

  const maxNumberOfSuggestion = 5;
  const date = new Date();
  date.setHours(12); // Set hours to 12 for noon
  date.setMinutes(0); // Set minutes to 0
  date.setSeconds(0); // Set seconds to 0
  const [clock, setClock] = useState(date);

  const options = TIMEZONES.map((option) => {
    const timeZone = `${option.place}, ${option.country} (${option.timeZone})`;
    const _timeZone = timeZone.toLowerCase();

    return {
      value: option.timeZone,
      label: timeZone,
      _label: _timeZone,
    };
  });

  // Style for suggestions dropdown.
  const customStyles = {
    menu: (provided) => ({
      ...provided,
      "& ::-webkit-scrollbar": {
        height: "100%",
        width: "5px",
        marginLeft: "5px",
      },
      "& ::-webkit-scrollbar-thumb": {
        backgroundColor: "var(--nav-color)",
      },
    }),
  };

  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
    setTimeForTimeZone(selected.value);
  };

  const handleInputChange = (input) => {
    const searchInput = input.toLowerCase();
    const filteredOptions = options
      .filter((option) => {
        return option._label.includes(searchInput);
      })
      .slice(0, maxNumberOfSuggestion);

    setSuggestions(filteredOptions.length ? filteredOptions : []);
  };

  const setTimeForTimeZone = (timeZone) => {
    const now = new Date();
    const options = {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);
    setTime(formatter.format(now));
    setClock(new Date(new Date().toLocaleString("en-US", { timeZone })));
  };

  useEffect(() => {
    const intervalRef = setInterval(() => {
      setTimeForTimeZone(selectedOption.value);
    }, 1000);

    return () => clearInterval(intervalRef);
  }, [selectedOption.value]);

  return (
    <Breadcrumb>
      <AppContainer>
        {/* Clocks */}
        <div className="flex flex-col gap-6 max-w-lg w-full mx-auto border border-gray-300 rounded-md shadow-sm px-4 py-6">
          <div className="text-center text-xl sm:text-2xl">
            <h2>{selectedOption.value}</h2>
          </div>

          <div className="border border-gray-300 rounded-md px-2 py-4 flex flex-col gap-6 justify-center items-center">
            {/* Clock */}
            <DynamicComponent>
              <AnalogClock time={clock} />
            </DynamicComponent>
            <time className="text-xl sm:text-2xl">{time}</time>
          </div>

          {/* Timezones */}
          <Select
            value={selectedOption}
            onChange={handleSelectChange}
            onInputChange={handleInputChange}
            instanceId="select-box"
            className="w-full text-sm"
            // isClearable={true}
            escapeClearsValue={true}
            options={suggestions}
            classNamePrefix="react-select"
            placeholder="Search timezone..."
            noOptionsMessage={({ inputValue }) => {
              return inputValue === ""
                ? "Try typing timezone"
                : "Timezone not found";
            }}
            styles={customStyles}
            maxMenuHeight={400}
            menuPosition="fixed"
          />
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              View the current time for your local time zone by default.
            </li>
            <li className="ml-4">
              Select a different time zone from the dropdown menu to see the
              current time in that location.
            </li>
            <li className="ml-4">
              Search for a time zone by typing in the search box. The dropdown
              will show suggestions based on your input.
            </li>
            <li className="ml-4">
              The displayed time updates every second to show the current time
              in the selected time zone.
            </li>
            <li className="ml-4">
              Use the formatted time in the 12-hour format with AM/PM notation.
            </li>
            <li className="ml-4">
              Switch between different time zones to compare the current time
              across multiple locations.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default Home;
