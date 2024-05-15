"use client";

import React, { useState } from "react";

import Breadcrumb from "@components/Breadcrumb";
import SitemapPreview from "./sitemapPreview";

const SitemapCompiler = () => {
  const paths = [
    { link: "/apps", title: "Apps" },
    { link: "/sitemap-compiler", title: "Sitemap Compiler" },
  ];

  const [text, setText] = useState("");
  const [urls, setUrls] = useState([]);

  const isValidUrl = (urlString) => {
    try {
      // Attempt to create a URL object
      new URL(urlString);
      return true;
    } catch (error) {
      // If there's an error, the URL is invalid
      return false;
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setUrls(() => {
      const lines = e.target.value.split("\n");
      return lines.filter((line) => line.trim() !== "" && isValidUrl(line));
    });
  };

  const generateSitemapContent = () => {
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap +=
      '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">\n';
    urls.forEach((url) => {
      sitemap += `   <url>\n      <loc>${url}</loc>\n   </url>\n`;
    });
    sitemap += "</urlset>";
    return sitemap;
  };

  const downloadSitemap = () => {
    const sitemap = generateSitemapContent();
    const file = new Blob([sitemap], {
      type: "text/xml",
    });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "sitemap.xml";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Breadcrumb paths={paths}>
      <div>
        <div className="grid md:grid-cols-2 gap-4">
          <textarea
            className="flex min-h-[360px] max-h-[500px] overflow-y-scroll sia-scrollbar sia-scrollbar-light w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            onChange={handleTextChange}
            value={text}
          ></textarea>
          <SitemapPreview urls={urls} />
        </div>
        <div className="mt-4 sm:mt-8 flex justify-end">
          <button
            class="align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-blue-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            type="button"
            onClick={downloadSitemap}
          >
            Download
          </button>
        </div>
      </div>

      {/* Usage */}
      <div className="w-full flex flex-col gap-4 sm:gap-6 mt-4 sm:mt-8">
        <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
          Usage
        </h1>
        <ul className="leading-relaxed text-base list-disc">
          <li className="ml-4">
            The Sitemap Compiler app allows users to generate a sitemap XML file
            from the URLs they input.
          </li>
          <li className="ml-4">
            Users can input URLs into the dedicated textarea field.
          </li>
          <li className="ml-4">
            Only valid URLs are included in the generated sitemap XML file.
            Invalid URLs are automatically excluded.
          </li>
          <li className="ml-4">
            As users enter URLs into the textarea, they can simultaneously view
            a live preview of the sitemap generated.
          </li>
          <li className="ml-4">
            Once satisfied with the compiled sitemap, users can easily download
            the sitemap file.
          </li>
          <li className="ml-4">
            The generated sitemap XML file is named <code>sitemap.xml</code>,
            adhering to standard sitemap naming conventions.
          </li>
        </ul>
      </div>
    </Breadcrumb>
  );
};

export default SitemapCompiler;
