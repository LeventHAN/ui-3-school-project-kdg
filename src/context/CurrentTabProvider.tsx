import React from "react";
import { useLocalStorage } from "usehooks-ts";
import CurrentTabContext from "./CurrentTabContext";

const CurrentTabProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTab, setCurrentTab] = useLocalStorage<string>(
    "currentTab",
    "dashboard"
  );

  return (
    <CurrentTabContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </CurrentTabContext.Provider>
  );
};

export default CurrentTabProvider;
