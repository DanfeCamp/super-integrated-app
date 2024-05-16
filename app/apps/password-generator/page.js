"use client";

/**
 * External dependencies.
 */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faArrowsRotate, faCheck } from "@fortawesome/free-solid-svg-icons";

/**
 * Internal dependencies.
 */
import AppContainer from "@components/AppContainer";
import Breadcrumb from "@components/Breadcrumb";
import Checkbox from "@components/Checkbox";

const CheckBox = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      viewBox="0 0 20 20"
      fill="currentColor"
      stroke="currentColor"
      stroke-width="1"
    >
      <path
        fill-rule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
};

const PasswordGenerator = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/password-generator", title: "Password Generator" },
  ];
  const minimumNumberOfCharacter = 4;
  const maximumNumberOfCharacter = 32;

  const [icon, setIcon] = useState(faCopy);
  const [password, setPassword] = useState("");
  const [hasUppercase, setHasUppercase] = useState(true);
  const [hasLowercase, setHasLowercase] = useState(true);
  const [hasNumbers, setHasNumbers] = useState(true);
  const [hasSymbols, setHasSymbols] = useState(true);
  const [numberOfCharacters, setNumberOfCharacters] = useState(12);

  const onChangePasswordLength = (e) => {
    setNumberOfCharacters(e.target.value);
    generatePassword();
  };

  const onChangeUppercase = () => {
    setHasUppercase((prev) => !prev);
    if (!hasLowercase && !hasNumbers && !hasSymbols) {
      // If no other option is selected, keep this one true
      setHasUppercase(true);
    }
    generatePassword();
  };

  const onChangeLowercase = () => {
    setHasLowercase((prev) => !prev);
    if (!hasUppercase && !hasNumbers && !hasSymbols) {
      // If no other option is selected, keep this one true
      setHasLowercase(true);
    }
    generatePassword();
  };

  const onChangeNumbers = () => {
    setHasNumbers((prev) => !prev);
    if (!hasUppercase && !hasLowercase && !hasSymbols) {
      // If no other option is selected, keep this one true
      setHasNumbers(true);
    }
    generatePassword();
  };

  const onChangeSymbols = () => {
    setHasSymbols((prev) => !prev);
    if (!hasUppercase && !hasLowercase && !hasNumbers) {
      // If no other option is selected, keep this one true
      setHasSymbols(true);
    }
    generatePassword();
  };

  const copyToClipboard = () => {
    setIcon(faCheck);
    navigator.clipboard.writeText(password);
    setTimeout(() => {
      setIcon(faCopy);
    }, 2000);
  };

  const generatePassword = () => {
    const characters = [];

    if (hasUppercase) {
      characters.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    if (hasLowercase) {
      characters.push("abcdefghijklmnopqrstuvwxyz");
    }

    if (hasNumbers) {
      characters.push("0123456789");
    }

    if (hasSymbols) {
      characters.push("!@#$%^&*()-_=+[{]}|;:,<.>/?");
    }

    let generatedPassword = "";

    // Ensure at least one character set is selected
    if (characters.length > 0) {
      for (let i = 0; i < numberOfCharacters; i++) {
        const randomCharacterSet =
          characters[Math.floor(Math.random() * characters.length)];
        generatedPassword += randomCharacterSet.charAt(
          Math.floor(Math.random() * randomCharacterSet.length)
        );
      }
      setPassword(generatedPassword);
    }
  };

  useEffect(() => {
    generatePassword();
  }, []);

  return (
    <Breadcrumb paths={paths}>
      <AppContainer>
        {/* Customize Password */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Password Length */}
          <div className="rounded-md border shadow-sm p-4 flex flex-col gap-4 sm:gap-8">
            <div className="flex justify-between items-center align-middle">
              <div>
                <h2 className="text-xl sm:text-2xl font-medium mb-2">
                  Password Length
                </h2>
                <label htmlFor="price-range" className="block text-gray-800">
                  Select the length for your password.
                </label>
              </div>
              <input
                type="number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-1.5 m-0"
                placeholder="12"
                min={`${minimumNumberOfCharacter}`}
                max={`${maximumNumberOfCharacter}`}
                value={numberOfCharacters}
                onChange={onChangePasswordLength}
              />
            </div>

            {/* Range Slider */}
            <input
              type="range"
              id="price-range"
              className="w-full accent-blue-600"
              min={`${minimumNumberOfCharacter}`}
              max={`${maximumNumberOfCharacter}`}
              value={`${numberOfCharacters}`}
              onChange={onChangePasswordLength}
            />

            {/* Min and Max Value */}
            <div className="flex justify-between text-gray-800">
              <span>{minimumNumberOfCharacter}</span>
              <span>{maximumNumberOfCharacter}</span>
            </div>
          </div>

          {/* Password Recipe */}
          <div className="rounded-md border shadow-sm p-4 flex flex-col gap-4 sm:gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-medium mb-2">
                Password Recipe
              </h2>
              <label htmlFor="price-range" className="block text-gray-800">
                Select what to include in your password.
              </label>
            </div>
            <div className="flex justify-between flex-wrap">
              {/* Uppercase */}
              <Checkbox
                id="uppercase"
                title="Uppercase"
                value={hasUppercase}
                setValue={onChangeUppercase}
              />

              {/* Lowercase */}
              <Checkbox
                id="lowercase"
                title="Lowercase"
                value={hasLowercase}
                setValue={onChangeLowercase}
              />

              {/* Numbers */}
              <Checkbox
                id="numbers"
                title="Numbers"
                value={hasNumbers}
                setValue={onChangeNumbers}
              />

              {/* Symbols */}
              <Checkbox
                id="symbols"
                title="Symbols"
                value={hasSymbols}
                setValue={onChangeSymbols}
              />
            </div>
          </div>
        </div>

        {/* Generated Password */}
        <div className="rounded-md border shadow-sm w-full p-4 text-lg">
          <code className="text-xl sm:text-2xl break-words">{password}</code>
        </div>

        {/* Buttons */}
        <div className="flex justify-end">
          <div className="flex gap-4">
            <button
              className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-lg py-2 px-4 rounded-lg bg-blue-600 text-white hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
              type="button"
              onClick={copyToClipboard}
            >
              <FontAwesomeIcon icon={icon} />
            </button>
            <button
              className="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-lg py-2 px-4 rounded-lg bg-blue-600 text-white hover:shadow-lg focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
              type="button"
              onClick={generatePassword}
            >
              <FontAwesomeIcon icon={faArrowsRotate} />
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
              The Password Generator app allows users to create secure and
              customizable passwords based on their preferences.
            </li>
            <li className="ml-4">
              The Password Generator app allows users to create secure and
              customizable passwords based on their preferences.
            </li>
            <li className="ml-4">
              Longer passwords generally offer better security but should be
              balanced with usability.
            </li>
            <li className="ml-4">
              Check or uncheck the options for including numbers, uppercase
              letters, lowercase letters, and symbols in the password.
            </li>
            <li className="ml-4">
              Including a variety of character sets enhances the complexity and
              security of the password.
            </li>
            <li className="ml-4">
              Click the "
              <FontAwesomeIcon
                icon={faArrowsRotate}
                className="inline h-4 w-4"
              />
              " button to create a password based on the selected length and
              character sets.
            </li>
            <li className="ml-4">
              The generated password will be displayed in the text field.
            </li>
            <li className="ml-4">
              Click the "
              <FontAwesomeIcon icon={faCopy} className="inline h-4 w-4" />"
              button next to the generated password to copy it to the clipboard
              for easy usage.
            </li>
            <li className="ml-4">
              If the generated password does not meet your requirements or
              preferences, click the "
              <FontAwesomeIcon
                icon={faArrowsRotate}
                className="inline h-4 w-4"
              />
              " button again to generate a new one.
            </li>
            <li className="ml-4">
              Aim for a balance between password length and complexity for
              optimal security and usability.
            </li>
          </ul>
        </div>
      </AppContainer>
    </Breadcrumb>
  );
};

export default PasswordGenerator;
