"use client";

import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

const AppCard = ({ title, link, description }) => {
  const router = useRouter();
  return (
    <Card
      className="w-full h-full hover:cursor-pointer border"
      onClick={() => router.push(link)}
    >
      <CardBody className="">
        {/* <div className="w-full flex justify-center">
          <FontAwesomeIcon icon={icon} />
        </div> */}
        <Typography variant="h6" className="mb-2 text-gray-900">
          {title}
        </Typography>
        <Typography className="text-sm">{description}</Typography>
      </CardBody>
    </Card>
  );
};

export default AppCard;
