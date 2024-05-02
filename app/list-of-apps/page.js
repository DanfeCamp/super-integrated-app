import React from "react";

import Breadcrumb from "@components/Breadcrumb";
import ClickableList from "@components/ClickableList";
import { LIST_OF_APPS } from "@utils/constants";

const ListOfApps = () => {
  const paths = [{ link: "/list-of-apps", title: "Apps" }];

  return (
    <Breadcrumb paths={paths}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 justify-center items-center">
        {LIST_OF_APPS.sort((a, b) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
          return 0;
        }).map((app) => {
          return (
            <div key={app.title} className="w-full rounded-lg border">
              <ClickableList
                title={app.title}
                icon={app.icon}
                link={app.link}
                category={app.category}
              />
            </div>
          );
        })}
      </div>
    </Breadcrumb>
  );
};

export default ListOfApps;
