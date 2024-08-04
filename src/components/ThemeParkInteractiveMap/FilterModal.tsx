import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { Category, TargetGroup } from "../../model/PointOfInterest";
import { useTags } from "../../services/DataService";
import { IFilterCriteria } from "../../context/FilterContext";

interface FilterModalProps {
  openFilterModal: boolean;
  handleCloseFilterModal: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFilterCriteria: (filterCriteria: IFilterCriteria) => void;
  handleFilterChange: (event: {
    target: { name: string; value: string };
  }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filterCriteria: any;
}

const FilterModal: React.FC<FilterModalProps> = ({
  openFilterModal,
  handleCloseFilterModal,
  setFilterCriteria,
  handleFilterChange,
  filterCriteria,
}) => {
  const { tags, isLoadingTags, isErrorTags } = useTags();

  return (
    <Modal
      keepMounted
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openFilterModal}
      onClose={() => {}}
      className="flex items-center justify-center"
    >
      <Box>
        <h2 id="transition-modal-title">Filter Data</h2>
        <div className="bg-white grid p-12 rounded-md space-y-2 gap-2 grid-flow-row grid-cols-2">
          <div className="grid grid-cols-1 p-4 mt-2">
            <FormLabel id="name-label">Point of Interest Name</FormLabel>
            <TextField
              name="name"
              variant="outlined"
              onChange={handleFilterChange}
              value={filterCriteria.name}
            />
          </div>
          <div className="grid grid-cols-1 p-4">
            <FormLabel id="category-label">Type Category</FormLabel>
            <Select
              value={filterCriteria.typeCategory}
              onChange={(e) => {
                setFilterCriteria({
                  ...filterCriteria,
                  typeCategory: e.target.value as Category,
                });
              }}
              labelId="category-label"
              id="typeCategory"
            >
              {Object.keys(Category).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 p-4">
            <FormLabel id="targetGroup-label">Target Group</FormLabel>
            <Select
              value={filterCriteria.targetGroup}
              onChange={(e) => {
                setFilterCriteria({
                  ...filterCriteria,
                  targetGroup: e.target.value as TargetGroup,
                });
              }}
              labelId="targetGroup-label"
              id="targetGroup"
            >
              {Object.keys(TargetGroup).map((key) => (
                <MenuItem key={key} value={key}>
                  {key === "NO_FILTER" ? "No Filter" : key}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-1 p-4">
            <FormLabel id="minLength-label">Minimum Length</FormLabel>
            <Slider
              value={filterCriteria.minLength}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => {
                setFilterCriteria({
                  ...filterCriteria,
                  minLength: e.target.value as number,
                });
              }}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              valueLabelFormat={(value) => `${value} cm`}
              min={0}
              max={160}
            />
            <Typography id="range-slider" gutterBottom>
              Minimum Length Range (in minutes)
            </Typography>
          </div>
          <div className="grid grid-cols-1 p-4">
            <FormLabel id="maxCurrentQueueLength-label">
              Maximum Current Queue Length
            </FormLabel>
            <Slider
              value={filterCriteria.maxCurrentQueueLength}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => {
                setFilterCriteria({
                  ...filterCriteria,
                  maxCurrentQueueLength: e.target.value as number,
                });
              }}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              valueLabelFormat={(value) => `${value} minutes`}
              min={0}
              step={5}
              max={30}
            />
            <Typography id="range-slider" gutterBottom>
              Maximum Current Queue Length
            </Typography>
          </div>
          <div className="grid grid-cols-1 p-4">
            <FormLabel id="tags-label">Tag</FormLabel>
            {isLoadingTags && <CircularProgress />}
            {isErrorTags && (
              <p>Something went wrong, we cant filter on tags this time...</p>
            )}
            {tags && (
              <Select
                multiple
                value={filterCriteria.tags || []}
                onChange={(e: SelectChangeEvent<string[]>) => {
                  setFilterCriteria({
                    ...filterCriteria,
                    tags: e.target.value as string[],
                  });
                }}
              >
                {tags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
          <div className="grid grid-cols-1 p-4">
            <FormLabel id="tags-label">Tag</FormLabel>
            {isLoadingTags && <CircularProgress />}
            {isErrorTags && (
              <p>Something went wrong, we cant filter on tags this time...</p>
            )}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filterCriteria.isOpen === "0"}
                    onChange={(e) => {
                      setFilterCriteria({
                        ...filterCriteria,
                        isOpen: e.target.checked ? "0" : "",
                      });
                    }}
                  />
                }
                label="Show Only Closed POI's"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filterCriteria.isOpen === "1"}
                    onChange={(e) => {
                      setFilterCriteria({
                        ...filterCriteria,
                        isOpen: e.target.checked ? "1" : "",
                      });
                    }}
                  />
                }
                label="Show Only Open POI's"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filterCriteria.isOpen === ""}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={() => {
                      setFilterCriteria({
                        ...filterCriteria,
                        isOpen: "",
                      });
                    }}
                  />
                }
                label="Show Open or Closed POI's"
              />
            </FormGroup>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <Button variant="contained" onClick={handleCloseFilterModal}>
            Apply Filters
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default FilterModal;
