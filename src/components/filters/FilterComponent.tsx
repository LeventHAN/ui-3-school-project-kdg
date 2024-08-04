export default function FilterComponent() {
  return (
    <>
      <Modal
        keepMounted
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openFilterModal}
        onClose={handleCloseFilterModal}
        className="flex items-center justify-center"
      >
        <Box>
          <h2 id="transition-modal-title">Filter Data</h2>
          <div className="bg-white grid p-12 rounded-md space-y-2 gap-2 grid-flow-row grid-cols-2">
            <div className="grid grid-cols-1 p-4">
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
                {/* MenuItems for Category */}
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
                {/* MenuItems for Target Group */}
              </Select>
            </div>
            <div className="grid grid-cols-1 p-4">
              <FormLabel id="minLength-label">Minimum Length</FormLabel>
              <Slider
                value={filterCriteria.minLength}
                onChange={(e) => {
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
                onChange={(e) => {
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
          </div>
          <div className="flex justify-center mt-2">
            <Button variant="contained" onClick={handleCloseFilterModal}>
              Apply Filters
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}
