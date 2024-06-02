"use client";

/**
 * External dependencies.
 */
import React, { useState } from "react";
import Link from "next/link";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";

const CookieDetails = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/cookie-details", title: "Cookie Details" },
  ];

  const initialForm = {
    cookieName: "",
    cookieDomain: "",
  };

  const [isSearching, setIsSearching] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [cookieDetails, setCookieDetails] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();

    setIsSearching(true);

    const response = await fetch("/api/cookie-details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cookieName: form.cookieName,
        cookieDomain: form.cookieDomain,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setCookieDetails(data.cookieDetails);
    } else {
      setCookieDetails([]);
    }

    setIsSearching(false);
  };

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* Search */}
        <form className="w-full flex flex-col gap-4 rounded-md p-4 border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="cookie-name">Cookie Name</label>
              <input
                type="text"
                value={form.cookieName}
                className="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 outline-none"
                placeholder="Enter cookie name"
                onChange={(e) =>
                  setForm((prev) => {
                    return {
                      ...prev,
                      cookieName: e.target.value,
                    };
                  })
                }
                onKeyDown={(event) => {
                  if (event.code === "Enter") {
                    handleSearch(event);
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="domain-name">Domain Name</label>
              <input
                type="url"
                value={form.cookieDomain}
                id="domain-name"
                className="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 outline-none"
                placeholder="Enter domain name"
                onChange={(e) =>
                  setForm((prev) => {
                    return {
                      ...prev,
                      cookieDomain: e.target.value,
                    };
                  })
                }
                onKeyDown={(event) => {
                  if (event.code === "Enter") {
                    handleSearch(event);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex gap-4">
              <button
                type="button"
                className="py-2 px-4 text-sm font-normal text-white bg-red-700 rounded-md border border-red-700 hover:shadow-md"
                onClick={() => {
                  setForm(initialForm);
                  setCookieDetails([]);
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                className="py-2 px-4 text-sm font-normal text-white bg-blue-700 rounded-md border border-blue-700 hover:shadow-md"
                onClick={handleSearch}
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </form>

        {/* Search Result */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cookieDetails.length > 0 &&
            cookieDetails.map((cookie, index) => {
              return (
                <div className="border shadow-sm p-4 rounded-md" key={index}>
                  <h4 className="text-base font-medium">
                    {`${cookie["Cookie / Data Key name"]} (${cookie["Domain"]})`}
                  </h4>
                  <hr className="my-2" />
                  <div className="flex flex-col gap-1 text-sm leading-tight">
                    <p>
                      <span className="font-semibold">Cookie Name: </span>
                      {cookie["Cookie / Data Key name"]}
                    </p>
                    <p>
                      <span className="font-semibold">Cookie Domain: </span>
                      {cookie["Domain"]}
                    </p>
                    <p>
                      <span className="font-semibold">Category: </span>
                      {cookie["Category"]}
                    </p>
                    <p>
                      <span className="font-semibold">Data Controller: </span>
                      {cookie["Data Controller"]}
                    </p>
                    <p>
                      <span className="font-semibold">Retention Period: </span>
                      {cookie["Retention period"]}
                    </p>
                    <p>
                      <span className="font-semibold">Platform: </span>
                      {cookie["Platform"]}
                    </p>
                    <p>
                      <span className="font-semibold">Description: </span>
                      {cookie["Description"]}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Users can search for cookie data using two distinct input fields:
              one for entering specific cookie names and the other for domain
              names associated with the cookies.
            </li>
            <li className="ml-4">
              Users have the flexibility to refine their search by utilizing
              either one or both of the input fields.
            </li>
            <li className="ml-4">
              Users can utilize the buttons: one designed to clear input fields
              and search results, while the other expedites the submission of
              user-provided data for searching.
            </li>
            <li className="ml-4">
              Search results are presented in visually appealing cards for
              clarity and ease of navigation for users.
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
              The displayed cookie data is sourced from{" "}
              <Link
                href="https://github.com/jkwakman/Open-Cookie-Database"
                traget="_blank"
                className="underline text-blue-600"
              >
                Open-Cookie-Database
              </Link>
              .
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default CookieDetails;
