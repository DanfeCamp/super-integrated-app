"use client";

/**
 * External dependencies.
 */
import React, { useState } from "react";
import { Select, Option } from "@material-tailwind/react";

/**
 * Internal dependencies.
 */
import { Breadcrumb, AppContainer } from "@components";

const Home = () => {
  const formats = ["DOCX", "ODT", "PDF"];

  const [file, setFile] = useState(null);
  const [format, setFormat] = useState("pdf");
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files[0].size < 104857600) {
        setFile(files[0]);
        setFileName(files[0].name);
      }
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (files[0].size < 104857600) {
        setFile(files[0]);
        setFileName(files[0].name);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !fileName) return;
    if (fileName.endsWith(format)) return;

    setIsLoading(true);

    try {
      const data = new FormData();
      data.set("file", file);
      data.set("format", format);

      const res = await fetch("/api/document-converter", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        const base64File = json.file;
        const _filename = json.filename;

        // Decode base64 string to binary data
        const byteCharacters = atob(base64File);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/octet-stream",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", _filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      // Fail silently.
    }
    setIsLoading(false);
  };

  return (
    <Breadcrumb>
      <AppContainer>
        {/* Document Converter */}
        <div className="flex flex-col items-center justify-center min-h-[300px] px-4 py-8 sm:py-12 border rounded-md shadow-sm">
          <h1 className="sm:text-4xl text-3xl mb-8">Document Converter</h1>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg flex flex-col gap-6"
          >
            <div
              className={`flex items-center justify-center w-full h-64 border-2 ${
                isDragging ? "border-blue-500" : "border-gray-300"
              } border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-full"
              >
                <div className="flex flex-col items-center justify-center text-center py-5 px-4">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>{" "}
                    <span className="hidden lg:inline-block">
                      or drag and drop
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    TEXT, MD, DOCX, ODT, HTML or PDF (MAX: 100MB)
                  </p>
                  {fileName && (
                    <p className="mt-2 text-sm text-green-500">
                      Selected file: {fileName}
                    </p>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept=".doc, .docx, .pdf, .odt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Options */}
            <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 gap-4">
              <Select
                label="Select Document Format"
                className="hover:shadow-md"
                value={format}
                onChange={(val) => setFormat(val)}
              >
                {formats.map((item) => {
                  const _item = item.toLowerCase();
                  return (
                    <Option value={_item} key={_item}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
              <button
                type="submit"
                className="w-full py-2 px-4 text-sm text-white bg-blue-500 rounded-lg hover:shadow-md focus:outline-none"
              >
                {isLoading ? "Converting..." : "Convert"}
              </button>
            </div>
          </form>
        </div>

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
