"use client";

/**
 * External dependencies.
 */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import Link from "next/link";

/**
 * Internal dependencies.
 */
import { Breadcrumb, AppContainer } from "@components";
import { CURRENCY } from "@constants";

const Home = () => {
  const [updatedTime, setUpdatedTime] = useState("");
  const [rates, setRates] = useState({});
  const [form, setForm] = useState({
    amountOne: 0,
    amountTwo: 0,
    currencyOne: {
      value: "USD",
      label: "United States Dollar (USD)",
    },
    currencyTwo: {
      value: "USD",
      label: "United States Dollar (USD)",
    },
    suggestionsOne: CURRENCY,
    suggestionsTwo: CURRENCY,
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

  const handleInputOneChange = (input) => {
    const searchInput = input.toUpperCase();
    const filteredOptions = CURRENCY.filter((option) => {
      return option.label.toUpperCase().includes(searchInput);
    }).slice(0, 5);

    setForm((prev) => {
      return {
        ...prev,
        suggestionsOne: filteredOptions.length ? filteredOptions : [],
      };
    });
  };

  const handleAmountChangeOne = (e) => {
    const amount = e.target.value;
    setForm((prev) => ({
      ...prev,
      amountOne: amount,
    }));
    updateAmount(2, amount, form.currencyOne.value, form.currencyTwo.value);
  };

  const handleCurrencyOneChange = (selected) => {
    const currency = {
      label: selected?.label ?? "",
      value: selected?.value ?? "",
    };
    setForm((prev) => ({
      ...prev,
      currencyOne: currency,
    }));
    updateAmount(
      1,
      parseFloat(form.amountTwo),
      currency.value,
      form.currencyTwo.value
    );
  };

  const handleInputTwoChange = (input) => {
    const searchInput = input.toUpperCase();
    const filteredOptions = CURRENCY.filter((option) => {
      return option.label.toUpperCase().includes(searchInput);
    }).slice(0, 5);

    setForm((prev) => {
      return {
        ...prev,
        suggestionsTwo: filteredOptions.length ? filteredOptions : [],
      };
    });
  };

  const handleAmountChangeTwo = (e) => {
    const amount = e.target.value;
    setForm((prev) => ({
      ...prev,
      amountTwo: amount,
    }));
    updateAmount(1, amount, form.currencyOne.value, form.currencyTwo.value);
  };

  const handleCurrencyTwoChange = (selected) => {
    const currency = {
      label: selected?.label ?? "",
      value: selected?.value ?? "",
    };
    setForm((prev) => ({
      ...prev,
      currencyTwo: currency,
    }));
    updateAmount(
      2,
      parseFloat(form.amountOne),
      form.currencyOne.value,
      currency.value
    );
  };

  const updateAmount = (fieldToUpdate, amount, currencyOne, currencyTwo) => {
    amount = parseFloat(amount);
    if (isNaN(amount)) {
      amount = 0;
    }

    if (fieldToUpdate === 1) {
      const amountTwoInUSD = amount / rates[currencyTwo];
      setForm((prev) => {
        return {
          ...prev,
          amountOne: (amountTwoInUSD * rates[currencyOne]).toFixed(2),
        };
      });
    }

    if (fieldToUpdate === 2) {
      const amountOneInUSD = amount / rates[currencyOne];
      setForm((prev) => {
        return {
          ...prev,
          amountTwo: (amountOneInUSD * rates[currencyTwo]).toFixed(2),
        };
      });
    }
  };

  useEffect(() => {
    const getCurrencyExchange = async () => {
      if (!updatedTime) {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");

        if (response.ok) {
          const json = await response.json();

          setUpdatedTime(json["time_last_update_utc"]);
          setRates(json["rates"]);
        }
      }
    };

    getCurrencyExchange();
  }, []);

  return (
    <Breadcrumb>
      <AppContainer>
        {/* Currency Converter */}
        <div className="flex items-center justify-center">
          <div className="max-w-xl w-full p-4 sm:p-8 rounded-md border shadow-sm">
            <h1 className="text-2xl font-bold text-center">
              Currency Converter
            </h1>

            <div className="w-full flex flex-col gap-10 my-10">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={form.amountOne}
                    onChange={handleAmountChangeOne}
                    required
                    className="w-full p-2 text-sm border border-gray-300 rounded outline-none focus:border focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <Select
                    value={form.currencyOne}
                    onChange={handleCurrencyOneChange}
                    onInputChange={handleInputOneChange}
                    instanceId="select-box-currency"
                    className="w-full text-sm"
                    escapeClearsValue={true}
                    options={form.suggestionsOne}
                    classNamePrefix="react-select"
                    placeholder="Search currency..."
                    noOptionsMessage={({ inputValue }) => {
                      return inputValue === ""
                        ? "Try typing currency name"
                        : "Currency not available";
                    }}
                    styles={customStyles}
                    maxMenuHeight={400}
                    menuPosition="fixed"
                  />
                </div>
              </div>

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={form.amountTwo}
                    onChange={handleAmountChangeTwo}
                    required
                    className="w-full p-2 text-sm border border-gray-300 rounded outline-none focus:border focus:border-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <Select
                    value={form.currencyTwo}
                    onChange={handleCurrencyTwoChange}
                    onInputChange={handleInputTwoChange}
                    instanceId="select-box-currency"
                    className="w-full text-sm"
                    escapeClearsValue={true}
                    options={form.suggestionsTwo}
                    classNamePrefix="react-select"
                    placeholder="Search currency..."
                    noOptionsMessage={({ inputValue }) => {
                      return inputValue === ""
                        ? "Try typing currency name"
                        : "Currency not available";
                    }}
                    styles={customStyles}
                    maxMenuHeight={400}
                    menuPosition="fixed"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-sm text-black title-font">
              Currency Rates as of:&nbsp;&nbsp;<code>{updatedTime}</code>
            </h2>
          </div>
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Users can enter the amount they want to convert in the "
              <code>Amount</code>" field.
            </li>
            <li className="ml-4">
              Users can choose the currency for the entered amount from the "
              <code>Currency</code>" dropdown.
            </li>
            <li className="ml-4">
              The converted amount will be calculated and updated "
              <code>Amount</code>" field.
            </li>
          </ul>
        </div>

        {/* Note */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Note
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              The currency rate is sourced from{" "}
              <Link
                href="https://www.exchangerate-api.com"
                target="_blank"
                className="underline text-blue-600"
              >
                Exchange Rate API
              </Link>
              .
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default Home;
