import {
  FormLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormWatch,
} from "react-hook-form";
import {
  Category,
  CreateMarkerDataInput,
  TargetGroup,
} from "../../../model/PointOfInterest";
import { usePointOfInterests } from "../../../services/DataService";

export default function AddNewMarkerForm({
  onSubmit,
  control,
  handleSubmit,
  errors,
  setAdminWantsToAddZone,
  watch,
}: {
  onSubmit: (marker: CreateMarkerDataInput) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<CreateMarkerDataInput, any>;
  handleSubmit: UseFormHandleSubmit<CreateMarkerDataInput, undefined>;
  errors: FieldErrors<CreateMarkerDataInput>;
  setAdminWantsToAddZone: (value: boolean) => void;
  watch: UseFormWatch<CreateMarkerDataInput>;
}) {
  const { pointOfInterests } = usePointOfInterests();

  const watchCategory = watch("category");

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          if (watchCategory !== Category.ATTRACTION) {
            data.relatedToAttractionIds = [];
          }
          onSubmit(data);
        })}
        style={{
          padding: "2.5rem",
        }}
      >
        <FormLabel className="mb-4">
          Enter the details to create a new Point of interest
        </FormLabel>

        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              style={{
                display: "flex",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            />
          )}
        />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel id="category-label">Category</FormLabel>
              <Select
                {...field}
                labelId="category-label"
                id="category"
                error={!!errors.category}
              >
                <MenuItem value={Category.ATTRACTION}>Attraction</MenuItem>
                <MenuItem value={Category.TOILET}>Toilet</MenuItem>
                <MenuItem value={Category.RESTAURANT}>Restaurant</MenuItem>
                <MenuItem value={Category.FOODTRUCK}>Food Truck</MenuItem>
                <MenuItem value={Category.LOCKER}>Locker</MenuItem>
                <MenuItem value={Category.SHOP}>Shop</MenuItem>
                <MenuItem value={Category.OTHER}>Other</MenuItem>
              </Select>
              {errors.category && (
                <FormHelperText error>{errors.category.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
        {watchCategory === Category.ATTRACTION && pointOfInterests && (
          <div className="mt-2">
            <Controller
              name="relatedToAttractionIds"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <FormLabel id="relatedToAttraction-label">
                    Related attractions
                  </FormLabel>
                  <Select
                    multiple
                    {...field}
                    labelId="relatedToAttraction-label"
                    id="relatedToAttraction"
                    error={!!errors.targetGroup}
                  >
                    {pointOfInterests
                      .filter((p) => p.category === Category.ATTRACTION)
                      .map((poi) => (
                        <MenuItem value={poi.id}>{poi.name}</MenuItem>
                      ))}
                  </Select>
                  {errors.targetGroup && (
                    <FormHelperText error>
                      {errors.targetGroup.message}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </div>
        )}
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Image"
              error={!!errors.image}
              helperText={errors.image?.message}
              style={{
                display: "flex",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
              style={{
                display: "flex",
                marginBottom: "1rem",
              }}
            />
          )}
        />
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tags (seperated by commas)"
              error={!!errors.tags}
              helperText={errors.tags?.message}
              style={{
                display: "flex",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            />
          )}
        />
        <Controller
          name="targetGroup"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel id="targetGroup-label">Target Group</FormLabel>
              <Select
                {...field}
                labelId="targetGroup-label"
                id="targetGroup"
                error={!!errors.targetGroup}
              >
                <MenuItem value={TargetGroup.ALL}>ALL</MenuItem>
                <MenuItem value={TargetGroup.ADULTS}>Adults</MenuItem>
                <MenuItem value={TargetGroup.PRESCHOOLERS}>
                  Preschoolers
                </MenuItem>
                <MenuItem value={TargetGroup.TEENS}>Teens</MenuItem>
              </Select>
              {errors.targetGroup && (
                <FormHelperText error>
                  {errors.targetGroup.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
        <Controller
          name="requiredMinLength"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              inputProps={{
                type: "number",
                min: 0,
                max: 160,
              }}
              label="Required Min Length"
              error={!!errors.requiredMinLength}
              helperText={errors.requiredMinLength?.message}
              style={{
                display: "flex",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            />
          )}
        />
        <Controller
          name="poiOpensDoorsAt"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              inputProps={{
                type: "time",
              }}
              label="POI Opens Doors At"
              error={!!errors.poiOpensDoorsAt}
              helperText={errors.poiOpensDoorsAt?.message}
              style={{
                display: "flex",
                marginBottom: "1rem",
              }}
            />
          )}
        />
        <Controller
          name="poiClosesDoorsAt"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              inputProps={{
                type: "time",
              }}
              label="POI Closes Doors At"
              error={!!errors.poiClosesDoorsAt}
              helperText={errors.poiClosesDoorsAt?.message}
              style={{
                display: "flex",
                marginBottom: "1rem",
              }}
            />
          )}
        />
        <FormControlLabel
          control={
            <Checkbox
              onChange={(e) => setAdminWantsToAddZone(e.target.checked)}
              color="primary"
            />
          }
          label="Add a zone instead of marker (no icon only polygons)"
          style={{
            display: "flex",
            marginBottom: "1rem",
          }}
        />

        <button className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Create Point of Interest
        </button>
      </form>
    </>
  );
}
