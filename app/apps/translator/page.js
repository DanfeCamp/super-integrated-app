"use client";

/**
 * External dependencies.
 */
import React, { useCallback, useState } from "react";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

/**
 * Internal dependencies.
 */
import Breadcrumb from "@components/Breadcrumb";
import AppContainer from "@components/AppContainer";
import { LANGUAGES } from "@utils";

const Home = () => {
  const options = LANGUAGES.map((option) => {
    return {
      value: option.value,
      label: option.title,
      lowerCaseLabel: option.title.toLowerCase(),
    };
  });

  const [isCopying, setIsCopying] = useState(false);
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [suggestions, setSuggestions] = useState(options);
  const [selectedOption, setSelectedOption] = useState({
    label: "",
    value: "",
  });

  const handleCopyTranslatedText = async () => {
    setIsCopying(true);
    await navigator.clipboard.writeText(translatedText);
    setTimeout(() => {
      setIsCopying(false);
    }, 1000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, language: selectedOption.value }),
    });

    const data = await response.json();

    if (response.ok) {
      setTranslatedText(data.translatedText);
    } else {
      setTranslatedText(`Error: ${data.error}`);
    }
  };

  const handleSelectChange = useCallback((selected) => {
    setSelectedOption({
      label: selected?.label ?? "",
      value: selected?.value ?? "",
    });
  }, []);

  // Filter the suggestion manually as no built-in method was found
  // which allows for limiting the number of suggestions.
  const handleInputChange = useCallback((input) => {
    const searchInput = input.toLowerCase();
    const filteredOptions = options
      .filter((option) => {
        return option.lowerCaseLabel.includes(searchInput);
      })
      .slice(0, 5);

    setSuggestions(filteredOptions.length ? filteredOptions : []);
  }, []);

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

  return (
    <Breadcrumb>
      <AppContainer>
        {/* Translator */}
        <div className="flex items-center justify-center">
          <div className="max-w-xl w-full p-4 sm:p-8 rounded-md border shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-center">Translator</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Text
                </label>
                <textarea
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language Code
                </label>
                <Select
                  value={selectedOption}
                  onChange={handleSelectChange}
                  onInputChange={handleInputChange}
                  instanceId="select-box-language"
                  className="w-full text-sm"
                  escapeClearsValue={true}
                  options={suggestions}
                  classNamePrefix="react-select"
                  placeholder="Search language..."
                  noOptionsMessage={({ inputValue }) => {
                    return inputValue === ""
                      ? "Try typing language name"
                      : "Language not available";
                  }}
                  styles={customStyles}
                  maxMenuHeight={400}
                  menuPosition="fixed"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
              >
                Translate
              </button>
            </form>
            {translatedText && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">Translated Text:</h2>
                  <button
                    title={isCopying ? "Copied" : "Copy"}
                    className="border rounded-md py-1 px-2"
                    onClick={handleCopyTranslatedText}
                  >
                    {isCopying ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      <FontAwesomeIcon icon={faCopy} />
                    )}
                  </button>
                </div>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                  {translatedText}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Usage */}
        <div className="w-full flex flex-col gap-4 sm:gap-6">
          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
            Usage
          </h1>
          <ul className="leading-relaxed text-base list-disc">
            <li className="ml-4">
              Enter your text in the "<code>Original Text</code>" input field.
            </li>
            <li className="ml-4">
              Select the desired language from the dropdown menu.
            </li>
            <li className="ml-4">
              Click the "<code>Translate</code>" button to convert the text.
            </li>
            <li className="ml-4">
              View the translated text in the "<code>Translated Text</code>"
              section.
            </li>
            <li className="ml-4">
              Click the copy icon on the right hand side of "
              <code>Translated Text</code>" to copy the translated text.
            </li>
            <li className="ml-4">
              Repeat the process for additional translations.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default Home;
