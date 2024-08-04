import React, { useState } from "react";
import { Category, TargetGroup } from "../model/PointOfInterest";
import FilterContext, { IFilterCriteria } from "./FilterContext";

const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filterCriteria, setFilterCriteria] = useState<IFilterCriteria>({
    name: "",
    typeCategory: Category.ALL,
    targetGroup: TargetGroup.NO_FILTER,
    minLength: "",
    maxCurrentQueueLength: "",
    isOpen: "",
    tags: [],
  });

  return (
    <FilterContext.Provider value={{ filterCriteria, setFilterCriteria }}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;
