"use client";

/**
 * External dependencies.
 */
import { Card, CardBody, ListItem } from "@material-tailwind/react";

const TitleCard = ({ title }) => {
  return (
    <Card className="w-full h-full border shadow-sm" role="button">
      <ListItem className="p-0">
        <CardBody className="flex gap-2 p-4">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
            viewBox="0 0 24 24"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
            <path d="M22 4L12 14.01l-3-3"></path>
          </svg>
          <h2 className="text-gray-900 leading-tight font-medium">{title}</h2>
        </CardBody>
      </ListItem>
    </Card>
  );
};

export default TitleCard;
