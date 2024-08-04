import { createContext } from "react";

export interface IThemeContext {
  theme: string;
  setTheme: (theme: string) => void;
}

export default createContext<IThemeContext>({
  theme: "SUMMER",
  setTheme: () => {},
});
