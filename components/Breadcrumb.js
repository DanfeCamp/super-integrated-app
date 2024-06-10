"use client";

/**
 * External dependencies.
 */
import Link from "next/link";
import { Breadcrumbs } from "@material-tailwind/react";
import { useEffect, useState } from "react";

const Breadcrumb = ({ children }) => {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const url = window.location.href;
    const path = new URL(url).pathname;
    const parts = path.split("/").filter((part) => part !== "");

    // Generate the slug array
    const slugs = [];
    for (let i = 0; i < parts.length; i++) {
      let slug = "/" + parts.slice(0, i + 1).join("/");
      slugs.push(slug);
    }

    const _paths = slugs.map((slug) => {
      const parts = slug.split("/");
      const lastPart = parts[parts.length - 1];

      const formatted = lastPart
        .split("-")
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");

      return {
        link: slug,
        title: formatted,
      };
    });

    setPaths(_paths);
  }, []);

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <Breadcrumbs>
        <Link href="/" className="opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </Link>

        {paths.map((path) => {
          return (
            <Link key={path.link} href={path.link} className="opacity-80">
              <span>{path.title}</span>
            </Link>
          );
        })}
      </Breadcrumbs>
      <div>{children}</div>
    </div>
  );
};

export default Breadcrumb;
