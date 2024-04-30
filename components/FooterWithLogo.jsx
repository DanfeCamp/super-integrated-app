"use client";

import { Typography } from "@material-tailwind/react";
import Link from "next/link";

const FooterWithLogo = () => {
  return (
    <footer className="w-full bg-white mt-8 sm:mt-4">
      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-center md:justify-between">
        <Link href="/" className="hidden sm:inline-block">
          <img src="/img/logo.png" alt="logo" className="w-6" />
        </Link>
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              as="a"
              href="/categories"
              color="blue-gray"
              className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-medium transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Categories
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="/about-us"
              color="blue-gray"
              className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-medium transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              About Us
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="/contact-us"
              color="blue-gray"
              className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-medium transition-colors hover:text-blue-500 focus:text-blue-500"
            >
              Contact Us
            </Typography>
          </li>
        </ul>
      </div>
      <hr className="my-2 sm:my-4 border-blue-gray-50" />
      <Typography
        color="blue-gray"
        className="text-center block antialiased font-sans text-sm leading-normal"
      >
        Made with ❤️ by{" "}
        <a href="https://danfecamp.com" className="underline" target="_blank">
          DanfeCamp
        </a>
      </Typography>
    </footer>
  );
};

export default FooterWithLogo;
