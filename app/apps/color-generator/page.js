"use client";

/**
 * External dependencies.
 */
import React, { useState, useEffect } from "react";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";

const ColorGenerator = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/color-generator", title: "Color Generator" },
  ];

  const defaultColor = "#25b596";

  const [color, setColor] = useState(defaultColor);
  const [palette, setPalette] = useState([]);

  const generatePalette = () => {
    setPalette((prev) => {
      const _palette = [...prev, color];
      localStorage.setItem("color-generator", JSON.stringify(_palette));
      return _palette;
    });
  };

  const randomPalette = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    setColor(randomColor);
  };

  const resetPalette = () => {
    setColor(defaultColor);
    setPalette([]);
    localStorage.setItem("color-generator", JSON.stringify([]));
  };

  const handlePalleteClicked = async (e, col) => {
    await navigator.clipboard.writeText(col);
    const text = e.target.parentNode.querySelector(".color-code");
    text.innerText = "Copied!";
    setTimeout(() => {
      text.innerText = col;
    }, 1000);
  };

  useEffect(() => {
    const _palette = JSON.parse(localStorage.getItem("color-generator")) ?? [];
    if (_palette.length) {
      setColor(_palette[_palette.length - 1]);
    }
    setPalette(_palette);
  }, []);

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* Color Generator */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 sm:gap-8 p-4 border rounded-md shadow-sm">
            {/* Color Picker */}
            <h1 className="font-medium title-font text-gray-900 text-xl">
              Color Generator
            </h1>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-28"
            />

            {/* Buttons */}
            <div className="flex justify-end">
              <div className="flex gap-2 sm:gap-4">
                <button
                  className="px-2.5 sm:px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                  onClick={resetPalette}
                >
                  Reset
                </button>
                <button
                  className="px-2.5 sm:px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                  onClick={randomPalette}
                >
                  Generate
                </button>
                <button
                  className="px-2.5 sm:px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                  onClick={generatePalette}
                >
                  Add to Gallery
                </button>
              </div>
            </div>
          </div>

          {/* Color Paletters */}
          <div className="flex flex-col gap-4 sm:gap-8 p-4 border rounded-md shadow-sm">
            <div>
              <h1 className="font-medium title-font text-gray-900 text-xl">
                Color Gallery
              </h1>
            </div>
            <div className="flex flex-wrap gap-4">
              {palette.map((col, index) => (
                <div
                  key={index}
                  className="cursor-pointer"
                  onClick={(e) => handlePalleteClicked(e, col)}
                >
                  <div
                    className="w-28 h-28 rounded shadow-sm"
                    style={{ backgroundColor: col }}
                  />
                  <p className="text-center mt-2 color-code">{col}</p>
                </div>
              ))}
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
              Users can click on the color input box to open the color picker.
            </li>
            <li className="ml-4">
              Users can choose their desired color using the color picker. The
              selected color will appear in the color input box.
            </li>
            <li className="ml-4">
              Users can click the "<code>Generate</code>" button to generate a
              random color palette.
            </li>
            <li className="ml-4">
              Users can click the "<code>Add to Palette</code>" button to add
              the selected color to the "<code>Color Gallery</code>".
            </li>
            <li className="ml-4">
              Each time a new color is added, it will appear as a new square
              block in the "<code>Color Gallery</code>".
            </li>
            <li className="ml-4">
              Users can repeat the process of selecting colors and adding them
              to the palette.
            </li>
            <li className="ml-4">
              Users can click on the color palette in the "
              <code>Color Gallery</code>" to copy the color code.
            </li>
            <li className="ml-4">
              Users can click the "<code>Reset</code>" button to reset the "
              <code>Color Generator</code>" and "<code>Color Gallery</code>".
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default ColorGenerator;
