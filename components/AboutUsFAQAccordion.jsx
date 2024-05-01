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

const qna = [
  {
    question: "Can I use Super Integrated App on mobile devices?",
    answer:
      "Yes, Super Integrated App is optimized for mobile devices, allowing users to access and use its tools conveniently from smartphones and tablets.",
  },
  {
    question: "How can I use the tools on Super Integrated App?",
    answer:
      "Using the tools on Super Integrated App is simple and intuitive. You can navigate to the desired tool from the apps menu to select the desired tool then use it.",
  },
  {
    question: "Is Super Integrated App free to use?",
    answer:
      "Yes, Super Integrated App is entirely free to use. There are no subscription fees or hidden charges associated with accessing and utilizing its tools.",
  },
  {
    question: "Is my data secure on Super Integrated App?",
    answer:
      "Absolutely. Super Integrated App prioritizes the security and privacy of its user's data. We do not collect any data about users that hinders user's privacy.",
  },
  {
    question: "Do I need to create an account to use Super Integrated App?",
    answer:
      " No, creating an account is not required to access and use the tools on Super Integrated App.",
  },
];

const AboutUsFAQAccordion = () => {
  const [open, setOpen] = useState(-1);

  const handleOpen = (value) => setOpen(open === value ? -1 : value);

  return (
    <div className="w-full">
      {qna.map((item, index) => {
        return (
          <Accordion
            key={index}
            open={open === index}
            icon={<Icon id={index} open={open} />}
          >
            <AccordionHeader
              onClick={() => handleOpen(index)}
              className="text-base font-semibold"
            >
              {item.question}
            </AccordionHeader>
            <AccordionBody>{item.answer}</AccordionBody>
          </Accordion>
        );
      })}
    </div>
  );
};

export default AboutUsFAQAccordion;
