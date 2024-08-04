import React from "react";
import IconButton from "@mui/material/IconButton";
import FilterList from "@mui/icons-material/FilterList";

interface FilterButtonProps {
  handleOpenFilterModal: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  handleOpenFilterModal,
}) => (
  <div className="col-start-6 col-span-1 flex justify-center items-center">
    <IconButton onClick={handleOpenFilterModal}>
      <FilterList color="info" className="" />
    </IconButton>
  </div>
);

export default FilterButton;
