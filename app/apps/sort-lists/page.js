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

const SortLists = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/sort-lists", title: "Sort Lists" },
  ];
  const [text, setText] = useState("");
  const [sortedText, setSortedText] = useState("");
  const [copyText, setCopyText] = useState("Copy");

  const handleTextChange = (e) => {
    setText(e.target.value);
    setSortedText(
      e.target.value
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
        .sort()
        .join("\n")
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sortedText);
    setCopyText("Copied!");
    setTimeout(() => {
      setCopyText("Copy");
    }, 1000);
  };

  const downloadSortedList = () => {
    const file = new Blob([sortedText], {
      type: "text/plain",
    });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "sorted-list.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* Sort Lists */}
        <div>
          <div className="grid md:grid-cols-2 gap-4">
            <textarea
              className="p-4 flex min-h-[360px] max-h-[500px] overflow-y-scroll sia-scrollbar sia-scrollbar-light w-full rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onChange={handleTextChange}
              value={text}
              placeholder={`B\nC\nA`}
            ></textarea>
            <textarea
              className="p-4 flex min-h-[360px] max-h-[500px] overflow-y-scroll sia-scrollbar sia-scrollbar-light w-full rounded-md border border-input bg-gray-200 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={sortedText}
              placeholder={`A\nB\nC`}
              disabled
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-4">
            <div className="flex gap-4 sm:gap-8">
              <button
                className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-blue-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                type="button"
                onClick={copyToClipboard}
              >
                {copyText}
              </button>
              <button
                className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-blue-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                type="button"
                onClick={downloadSortedList}
              >
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Users can input a list of items into the text area. They can paste
              or type the list directly into the text area.
            </li>
            <li className="ml-4">
              Once the list is entered, the app automatically sorts the items
              alphabetically or numerically, depending on the content.
            </li>
            <li className="ml-4">
              Users can see the sorted list displayed live in the app interface.
            </li>
            <li className="ml-4">
              Users have the option to copy the sorted list to their clipboard
              with a single click.
            </li>
            <li className="ml-4">
              Users can download the sorted list as a text file{" "}
              <code>sorted-list.txt</code> by clicking on a download button.
            </li>
            <li className="ml-4">
              The app can handle various types of content within the list, such
              as words, numbers, or a combination of both.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default SortLists;
