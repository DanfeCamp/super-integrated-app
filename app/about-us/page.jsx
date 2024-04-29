"use client";

import { Breadcrumbs } from "@material-tailwind/react";
import Link from "next/link";

import TeamMembers from "@components/TeamMembers";
import FAQAccordion from "@components/AboutUsFAQAccordion";

const AboutUs = () => {
  return (
    <>
      {/* Breadcrumbs */}
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
        <Link href="/about-us" className="opacity-80">
          <span>About Us</span>
        </Link>
      </Breadcrumbs>

      <div class="flex flex-col w-full">
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 my-4 sm:my-6">
          Super Integrated App
        </h1>
        <p class="leading-relaxed text-base">
          Super Integrated App (SIA) is a comprehensive web platform providing
          free access to a diverse set of tools, all available in one central
          location. Simplify your online experience by utilizing a range of
          tools designed to meet different needs. Explore the possibilities with
          SIA, where convenience meets functionality.
        </p>
      </div>

      {/* Team Members */}
      <TeamMembers />

      {/* Accordion for FAQ */}
      <FAQAccordion />
    </>
  );
};

export default AboutUs;
