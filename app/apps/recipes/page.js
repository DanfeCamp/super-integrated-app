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
import { RECIPES } from "@utils/constants";

const Recipes = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/recipes", title: "Recipes" },
  ];

  const RECIPE_TAGS = RECIPES.reduce((acc, current) => {
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
            options={["All", ...RECIPE_TAGS]}
            onOptionSelect={handleOptionSelect}
          />
        </div>

        {/* Recipes */}
        <div></div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default Recipes;
