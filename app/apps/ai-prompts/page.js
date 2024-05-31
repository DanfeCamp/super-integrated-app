"use client";

/**
 * External dependencies.
 */
import React from "react";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";
import TextCard from "@components/TextCard";
import { AI_PROMPTS } from "@utils/constants";

const AIPrompts = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/ai-prompts", title: "AI Prompts" },
  ];

  const AI_PROMPTS_TAGS = AI_PROMPTS.reduce((acc, current) => {
    if (!acc.some((item) => item.tag === current.tag)) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* AI Prompts */}
        {AI_PROMPTS_TAGS.map((item) => {
          return (
            <div className="flex flex-col gap-4 sm:gap-6 py-4" key={item.tag}>
              <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                <span className="text-gray-500">#</span> {item.tag}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-center items-center">
                {AI_PROMPTS.filter((prompt) => prompt.tag === item.tag).map(
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
          );
        })}
      </AppContainer>
    </Breadcrumb>
  );
};

export default AIPrompts;
