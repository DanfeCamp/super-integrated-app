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
import FilterBar from "@components/FilterBar";
import TextCard from "@components/TextCard";
import { AI_PROMPTS } from "@utils/constants";

const Home = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/apps/ai-prompts", title: "AI Prompts" },
  ];

  const AI_PROMPTS_TAGS = AI_PROMPTS.reduce((acc, current) => {
    if (!acc.some((item) => item.tag === current.tag)) {
      acc.push(current);
    }
    return acc;
  }, []).map((item) => item.tag);

  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleOptionSelect = (selectedOption) => {
    setSelectedFilter(selectedOption);
  };

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* Fitler Bar */}
        <div className="border rounded-lg p-2 sm:p-4">
          <FilterBar
            options={["All", ...AI_PROMPTS_TAGS]}
            onOptionSelect={handleOptionSelect}
          />
        </div>

        {/* AI Prompts */}
        {selectedFilter === "All" &&
          AI_PROMPTS_TAGS.map((tag) => {
            return (
              <div className="flex flex-col gap-4" key={tag}>
                <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                  <span className="text-gray-500">#</span> {tag}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-center">
                  {AI_PROMPTS.filter((prompt) => prompt.tag === tag)
                    .slice(0, 4)
                    .map((prompt, index) => {
                      return (
                        <TextCard
                          key={index}
                          title={prompt.title}
                          description={prompt.description}
                        />
                      );
                    })}
                </div>
              </div>
            );
          })}

        {selectedFilter !== "All" && (
          <div className="flex flex-col gap-4">
            <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
              <span className="text-gray-500">#</span> {selectedFilter}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-center">
              {AI_PROMPTS.filter((prompt) => prompt.tag === selectedFilter).map(
                (prompt, index) => {
                  return (
                    <TextCard
                      key={index}
                      title={prompt.title}
                      description={prompt.description}
                    />
                  );
                }
              )}
            </div>
          </div>
        )}
      </AppContainer>
    </Breadcrumb>
  );
};

export default Home;
