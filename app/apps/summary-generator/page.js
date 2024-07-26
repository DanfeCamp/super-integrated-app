"use client";

/**
 * External dependencies.
 */
import React, { useState } from "react";

/**
 * Internal dependencies.
 */
import { Breadcrumb, AppContainer, WorkInProgress } from "@components";

const Home = () => {
  return (
    <Breadcrumb>
      <AppContainer>
        {/* Summary Generator */}
        <WorkInProgress />

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4"></li>
            <li className="ml-4"></li>
            <li className="ml-4"></li>
            <li className="ml-4"></li>
            <li className="ml-4"></li>
            <li className="ml-4"></li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default Home;
