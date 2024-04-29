"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const FAQAccordion = () => {
  const [open, setOpen] = useState(0);

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  return (
    <div>
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 my-4 sm:my-6">
        FAQ
      </h2>

      {/* FAQ */}
      <div className="w-full">
        {/* FAQ: 1 */}
        <Accordion open={open === 1} icon={<Icon id={1} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(1)}
            className="text-base font-semibold"
          >
            What is Super Integrated App?
          </AccordionHeader>
          <AccordionBody>
            Super Integrated App is an all-in-one integrated website that brings
            together a variety of tools to simplify digital tasks. It offers a
            comprehensive suite of utilities, including quotes, jokes, timers,
            sitemap compilation, cookie details, QR code generation, PDF
            generation, image editing, file conversion, and more, all accessible
            from one platform.
          </AccordionBody>
        </Accordion>
        {/* FAQ: 2 */}
        <Accordion open={open === 2} icon={<Icon id={2} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(2)}
            className="text-base font-semibold"
          >
            How can I use the tools on Super Integrated App?
          </AccordionHeader>
          <AccordionBody>
            Using the tools on Super Integrated App is simple and intuitive. You
            can navigate to the desired tool from the{" "}
            <Link href="/apps" className="underline text-blue-800">
              apps menu
            </Link>{" "}
            to select the desired tool then use it.
          </AccordionBody>
        </Accordion>

        {/* FAQ: 3 */}
        <Accordion open={open === 3} icon={<Icon id={3} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(3)}
            className="text-base font-semibold"
          >
            Is Super Integrated App free to use?
          </AccordionHeader>
          <AccordionBody>
            Yes, Super Integrated App is entirely free to use. There are no
            subscription fees or hidden charges associated with accessing and
            utilizing its tools.
          </AccordionBody>
        </Accordion>

        {/* FAQ: 4 */}
        <Accordion open={open === 4} icon={<Icon id={4} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(4)}
            className="text-base font-semibold"
          >
            Is my data secure on Super Integrated App?
          </AccordionHeader>
          <AccordionBody>
            Absolutely. Super Integrated App prioritizes the security and
            privacy of its user's data. We do not collect any data about users
            that hinders user's privacy.
          </AccordionBody>
        </Accordion>

        {/* FAQ: 5 */}
        <Accordion open={open === 5} icon={<Icon id={5} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(5)}
            className="text-base font-semibold"
          >
            Do I need to create an account to use Super Integrated App?
          </AccordionHeader>
          <AccordionBody>
            No, creating an account is not required to access and use the tools
            on Super Integrated App.
          </AccordionBody>
        </Accordion>

        {/* FAQ: 6 */}
        <Accordion open={open === 6} icon={<Icon id={6} open={open} />}>
          <AccordionHeader
            onClick={() => handleOpen(6)}
            className="text-base font-semibold"
          >
            Can I use Super Integrated App on mobile devices?
          </AccordionHeader>
          <AccordionBody>
            Yes, Super Integrated App is optimized for mobile devices, allowing
            users to access and use its tools conveniently from smartphones and
            tablets.
          </AccordionBody>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQAccordion;
