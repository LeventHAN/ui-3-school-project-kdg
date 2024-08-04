import { createContext } from "react";

export interface IFilterCriteria {
  name: string;
  typeCategory: string;
  targetGroup: string;
  minLength: string;
  maxCurrentQueueLength: string;
  isOpen: string;
  tags: string[];
}

export interface IFilterContext {
  filterCriteria: IFilterCriteria;
  setFilterCriteria: (filterCriteria: IFilterCriteria) => void;
}

export default createContext<IFilterContext>({
  filterCriteria: {
    name: "",
    typeCategory: "",
    targetGroup: "",
    minLength: "",
    maxCurrentQueueLength: "",
    isOpen: "",
    tags: [],
  },
  setFilterCriteria: () => {},
});
