"use client";

/**
 * External dependencies.
 */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Select, Option } from "@material-tailwind/react";

/**
 * Internal dependencies.
 */
import { Breadcrumb, AppContainer } from "@components";

const Home = () => {
  const tags = ["Any", "Programming", "Knock-Knock"];
  const initialJoke = {
    type: "...",
    setup: "...",
    punchline: "...",
    id: 0,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState("any");
  const [joke, setJoke] = useState(initialJoke);

  const getJoke = async () => {
    setIsLoading(true);

    const response = await fetch("/api/jokes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tag: selectedTag }),
    });

    const data = await response.json();

    if (response.ok) {
      setJoke(data.joke);
    } else {
      setJoke(initialJoke);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getJoke();
  }, [selectedTag]);

  return (
    <Breadcrumb>
      <AppContainer>
        {/* Joke */}
        <div className="w-full sm:w-[450px] mx-auto p-4 sm:p-8 border shadow-sm rounded-md">
          <h2 className="">
            <span className="font-medium">Tags: </span>
            {joke.type}
          </h2>

          <div className="min-h-[220px] w-full flex items-center border-t border-b border-gray-300 mt-4 mb-6">
            <div className="w-full text-base flex flex-col gap-4">
              <p>
                <span className="font-medium">Setup: </span>
                {joke.setup}
              </p>
              <p>
                <span className="font-medium">Punchline: </span>
                {joke.punchline}
              </p>
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
              onClick={getJoke}
              className="p-2 w-full text-sm font-normal text-white bg-blue-700 rounded-md border border-blue-700 hover:shadow-md"
            >
              {isLoading ? "Loading..." : "New Joke"}
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
              The joke consists of a setup and a punchline.
            </li>
            <li className="ml-4">
              Users can click on the "<code>New Joke</code>" button to get a new
              joke.
            </li>
            <li className="ml-4">
              Users can choose <code>tag</code> to get the jokes of selected
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
              The displayed jokes are sourced from{" "}
              <Link
                href="https://github.com/15Dkatz/official_joke_api"
                target="_blank"
                className="underline text-blue-600"
              >
                official_joke_api
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
