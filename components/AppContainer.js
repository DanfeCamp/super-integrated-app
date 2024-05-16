import React from "react";

const AppContainer = ({ children }) => {
  return <div className="flex flex-col gap-4 sm:gap-8 w-full">{children}</div>;
};

export default AppContainer;
