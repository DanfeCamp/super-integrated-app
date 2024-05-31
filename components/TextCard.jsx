"use client";

/**
 * External dependencies.
 */
import { Card, CardBody } from "@material-tailwind/react";
import { useState } from "react";

const TextCard = ({ title, description }) => {
  const [isCopying, setIsCopying] = useState(false);

  return (
    <Card className="w-full h-full border shadow-sm">
      <CardBody className="flex flex-col justify-between h-full gap-4 p-4">
        <h2 className="text-gray-900 font-semibold text-lg text-center">
          {title}
        </h2>
        <p className="text-base text-center text-gray-900 leading-snug">
          {description}
        </p>
        <button
          class="bg-gray-200 rounded-full py-2 text-sm font-semibold text-gray-900 hover:shadow-sm"
          title="Copy the prompt"
          onClick={() => {
            navigator.clipboard.writeText(description);
            setIsCopying(true);
            setTimeout(() => {
              setIsCopying(false);
            }, 1000);
          }}
        >
          {isCopying ? "Copied!" : "Copy"}
        </button>
      </CardBody>
    </Card>
  );
};

export default TextCard;
