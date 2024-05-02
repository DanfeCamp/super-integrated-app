"use client";

import React from "react";
import Link from "next/link";
import { ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";

const ClickableList = ({ title, icon, link, categories }) => {
  return (
    <Link href={link}>
      <ListItem>
        <ListItemPrefix>
          <span className="h-12 w-12 text-2xl rounded-full border flex justify-center items-center p-2">
            {icon}
          </span>
        </ListItemPrefix>
        <div>
          <Typography variant="h6" color="blue-gray">
            {title}
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            {categories.join(", ")}
          </Typography>
        </div>
      </ListItem>
    </Link>
  );
};

export default ClickableList;
