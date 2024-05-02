"use client";

/**
 * External dependencies.
 */
import { Card, CardBody, Typography, ListItem } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

const AppCard = ({ title, link, description }) => {
  const router = useRouter();
  return (
    <Card
      className="w-full h-full border"
      onClick={() => router.push(link)}
      role="button"
    >
      <ListItem className="w-full h-full p-0">
        <CardBody>
          <Typography variant="h6" className="mb-2 text-gray-900">
            {title}
          </Typography>
          <Typography className="text-sm">{description}</Typography>
        </CardBody>
      </ListItem>
    </Card>
  );
};

export default AppCard;
