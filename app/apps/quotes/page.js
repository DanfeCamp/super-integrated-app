"use client";

/**
 * External dependencies.
 */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Select, Option } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";

const Home = () => {
  const tags = [
    "Any",
    "Finance",
    "Funny",
    "Happiness",
    "Love",
    "Motivation",
    "Sigma",
    "Wisdom",
  ];

  const initialQuote = {
    quote: "",
    author: "",
    tags: [],
  };

  const [selectedTag, setSelectedTag] = useState("any");
  const [quote, setQuote] = useState(initialQuote);
  const [isLoading, setIsLoading] = useState(false);

  const getQuote = async () => {
    setIsLoading(true);

    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag: selectedTag }),
    });

    const data = await response.json();

    if (response.ok) {
      setQuote(data.quote);
    } else {
      setQuote(initialQuote);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getQuote();
  }, [selectedTag]);

  return (
    <Breadcrumb>
      <AppContainer>
        {/* Quote */}
        <div className="w-full sm:w-[450px] mx-auto p-4 sm:p-8 border shadow-sm rounded-md">
          <h2 className="">
            <span className="font-medium">Tags: </span>
            {quote.tags.length > 0 ? quote.tags.join(", ") : "general"}
          </h2>

          <div className="min-h-[280px] w-full flex items-center border-t border-b border-gray-300 mt-4 mb-6">
            <div className="w-full text-base sm:text-lg font-medium">
              <FontAwesomeIcon icon={faQuoteLeft} size="lg" />
              <span className="px-2">{quote?.quote}</span>
              <FontAwesomeIcon icon={faQuoteRight} size="lg" />
              <div className="w-full flex justify-end font-normal text-sm mt-4">
                - {quote.author !== "" ? quote.author : "Someone"}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 sm:space-x-4 gap-6">
            <Select
              label="Select Tag"
              className="hover:shadow-md"
              value={selectedTag}
              onChange={(val) => setSelectedTag(val)}
            >
              {tags &&
                tags.map((tag) => {
                  const _tag = tag.toLowerCase();
                  return (
                    <Option value={_tag} key={_tag}>
                      {tag}
                    </Option>
                  );
                })}
            </Select>
            <button
              onClick={getQuote}
              className="p-2 text-sm font-normal text-white bg-blue-700 rounded-md border border-blue-700 hover:shadow-md"
            >
              {isLoading ? "Loading..." : "New Quote"}
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
              The quote is displayed in the middle section and the author's name
              just below it.
            </li>
            <li className="ml-4">
              The tags associated with the current quote will be displayed at
              the top of the card.
            </li>
            <li className="ml-4">
              Users can click on the "<code>New Quote</code>" button to get a
              new quote.
            </li>
            <li className="ml-4">
              Users can choose <code>tag</code> to get the quotes of selected
              tag.
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
              The displayed quotes are sourced from{" "}
              <Link
                href="https://github.com/nirajgiriXD/garden-of-quotes"
                traget="_blank"
                className="underline text-blue-600"
              >
                Garden Of Quotes
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
