"use client";

/**
 * External dependencies.
 */
import Link from "next/link";
import { Breadcrumbs } from "@material-tailwind/react";

const Breadcrumb = ({ paths, children }) => {
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