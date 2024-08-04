import React from "react";
import IconButton from "@mui/material/IconButton";
import AddCircle from "@mui/icons-material/AddCircle";

interface AddNewPoiButtonProps {
  addNewPoi: () => void;
}

const AddNewPoiButton: React.FC<AddNewPoiButtonProps> = ({ addNewPoi }) => (
  <div className="h-14 w-14 col-start-1">
    <IconButton
      onClick={addNewPoi}
      disableRipple
      size="small"
      className="min-w-max "
    >
      <span className="hover:bg-gray-400 rounded-md p-2">
        <AddCircle scale={2} fontSize="large" />
        <span className="text-sm">Add new POI</span>
      </span>
    </IconButton>
  </div>
);

export default AddNewPoiButton;
