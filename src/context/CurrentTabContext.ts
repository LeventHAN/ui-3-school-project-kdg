import { createContext } from "react";

export interface ICurrentTabContext {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default createContext<ICurrentTabContext>({
  currentTab: "dashboard",
  setCurrentTab: () => {},
});
