import { useContext, useEffect, useState } from "react";
import { checkValidUUID, classNames } from "../../utils/helpers";
import {
  Category,
  Coordinate,
  CreateMarkerDataInput,
  MarkerData,
  TargetGroup,
} from "../../model/PointOfInterest";
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePointOfInterestDetails } from "../../services/DataService";
import EditPoiForm from "./forms/EditPoiForm";
import { Button, CircularProgress } from "@mui/material";
import AddMarkerOnInteractiveMap from "./AddMarkerOnInteractiveMap";

enum Step {
  FillInData = "5%",
  SetMarkerOnMap = "50%",
  ConfirmDataAndMarker = "100%",
}

const markerEditSchema: z.ZodSchema<CreateMarkerDataInput> = z.object({
  name: z.string().min(1).max(160),
  category: z.nativeEnum(Category),
  image: z.string().min(1).max(160),
  description: z.string().min(1).max(255),
  tags: z.string().min(1).max(160),
  targetGroup: z.nativeEnum(TargetGroup),
  requiredMinLength: z.string().min(1).max(3),
  poiOpensDoorsAt: z
    .string()
    .refine(
      (val) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(val),
      "Time must be in format HH:MM"
    ),
  poiClosesDoorsAt: z
    .string()
    .refine(
      (val) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(val),
      "Time must be in format HH:MM"
    ),
  relatedToAttractionIds: z.array(z.string().min(1).max(160)).optional(),
});

export default function EditPoiComponent() {
  // check if user is authenticated if not return to /
  const { session } = useContext(AuthContext);

  const [currentStep, setCurrentStep] = useState<Step>(Step.FillInData);
  const [marker, setMarker] = useState<
    CreateMarkerDataInput & { coordinates: Coordinate[][] }
  >();

  const uuid = window.location.pathname.split("/")[3];

  const {
    pointOfInterest,
    isLoading,
    isError,
    isErrorEdit,
    isLoadingEdit,
    isSuccessEdit,
    editPoi,
  } = usePointOfInterestDetails(checkValidUUID(uuid));

  const [adminWantsToAddZone, setAdminWantsToAddZone] = useState<boolean>(true);

  useEffect(() => {
    if (pointOfInterest) {
      setAdminWantsToAddZone(pointOfInterest.coordinates.length > 1);
    }
  }, [pointOfInterest]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MarkerData>({
    resolver: zodResolver(markerEditSchema),
    defaultValues: {
      id: pointOfInterest?.id,
      name: pointOfInterest?.name,
      category: pointOfInterest?.category,
      image: pointOfInterest?.image,
      description: pointOfInterest?.description,
      tags: (pointOfInterest?.tags as string[])?.join(","),
      targetGroup: pointOfInterest?.targetGroup,
      requiredMinLength: pointOfInterest?.requiredMinLength?.toString(),
      poiOpensDoorsAt: pointOfInterest?.poiOpensDoorsAt,
      poiClosesDoorsAt: pointOfInterest?.poiClosesDoorsAt,
    },
  });

  if (isLoading || isLoadingEdit) {
    return <CircularProgress size={120} />;
  }

  if (isError || isErrorEdit) {
    return <p>Something went wrong...</p>;
  }

  if (!session) {
    return <div>You are not authenticated to see this page</div>;
  }

  const moveToNextStep = () => {
    setCurrentStep((prev) => {
      switch (prev) {
        case Step.FillInData:
          return Step.SetMarkerOnMap;
        case Step.SetMarkerOnMap:
          return Step.ConfirmDataAndMarker;
        case Step.ConfirmDataAndMarker: {
          return Step.FillInData;
        }
      }
    });
  };

  const goBackToStepOne = () => {
    setCurrentStep(Step.FillInData);
  };

  function onSubmit(marker: CreateMarkerDataInput) {
    setMarker({
      ...marker,
      coordinates: pointOfInterest?.coordinates || [[]],
    });
    moveToNextStep();
  }

  const handleMarkerCoordinatesChange = (coordinates: Coordinate[][]) => {
    setMarker((prev) => {
      if (prev) {
        return { ...prev, coordinates };
      }
    });

    console.log(marker);
  };

  const editThePoi = () => {
    if (marker && pointOfInterest) {
      editPoi({
        ...marker,
        id: pointOfInterest.id,
        currentQueueLength: pointOfInterest.currentQueueLength,
      });
    }
  };

  return (
    <>
      <div className="p-4">
        <div>
          <p className="text-2xl font-extrabold text-gray-900">
            Edit Point of Interest - {pointOfInterest?.name}
          </p>
          <div className="mt-6" aria-hidden="true">
            <div className="overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-indigo-600"
                style={{ width: `${currentStep}` }}
              />
            </div>
            <div className="mt-6 hidden grid-cols-3 text-sm font-medium text-gray-600 sm:grid">
              <div
                className={
                  currentStep === Step.FillInData ? "text-indigo-600" : ""
                }
              >
                Edit in the Point of Interest data
              </div>
              <div
                className={classNames(
                  currentStep === Step.SetMarkerOnMap ? "text-indigo-600" : "",
                  "text-center"
                )}
              >
                Edit the location on the map for the new POI
              </div>
              <div
                className={classNames(
                  currentStep === Step.ConfirmDataAndMarker
                    ? "text-indigo-600"
                    : "",
                  "text-right"
                )}
              >
                Confirm the data and location
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 mt-6">
          {currentStep === Step.FillInData && pointOfInterest && (
            <>
              <div className="bg-gray-50 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <EditPoiForm
                  onSubmit={onSubmit}
                  handleSubmit={handleSubmit}
                  control={control}
                  errors={errors}
                  watch={watch}
                  pointOfInterest={pointOfInterest}
                  setAdminWantsToAddZone={setAdminWantsToAddZone}
                  adminWantsToAddZone={adminWantsToAddZone}
                />
              </div>
            </>
          )}
          {currentStep === Step.SetMarkerOnMap && marker && (
            <AddMarkerOnInteractiveMap
              currentMarkerCoordinates={
                [marker.coordinates] as never as Coordinate[][]
              }
              marker={marker}
              setCurrentMarkerCoordinates={handleMarkerCoordinatesChange}
              moveToNextStep={moveToNextStep}
              showPolygonsInsteadOfMarkers={adminWantsToAddZone}
            />
          )}
          {currentStep === Step.ConfirmDataAndMarker && marker && (
            <div>
              <div className="bg-gray-50 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 mb-2">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Confirm Data and Marker
                </h2>
                <div className="mt-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">
                      Point of Interest Details
                    </h3>
                    <ul className="list-disc pl-6">
                      <li>
                        <span className="font-semibold">Name:</span>{" "}
                        {marker.name}
                      </li>
                      <li>
                        <span className="font-semibold">Category:</span>{" "}
                        {Category[marker.category]}
                      </li>
                      <li>
                        <span className="font-semibold">Description:</span>{" "}
                        {marker.description}
                      </li>
                      <li>
                        <span className="font-semibold">Working hours:</span>{" "}
                        {marker.poiOpensDoorsAt} : {marker.poiClosesDoorsAt}
                      </li>
                      <li>
                        <span className="font-semibold">Tags:</span>{" "}
                        {marker.tags}
                      </li>
                      <li>
                        <span className="font-semibold">
                          Required Minimum Length:
                        </span>{" "}
                        {marker.requiredMinLength}
                      </li>
                      <li>
                        <span className="font-semibold">Target group:</span>{" "}
                        {TargetGroup[marker.targetGroup]}
                      </li>
                      <li>
                        <span className="font-semibold">Image URL:</span>{" "}
                        {marker.image}
                        <span className="block">Preview of the image:</span>
                        <img
                          src={marker.image}
                          alt="preview"
                          className="w-32 h-32 object-cover"
                        />
                      </li>
                    </ul>
                  </div>
                  {marker && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">
                        Location Details
                      </h3>
                      <ul className="list-disc pl-6">
                        {marker.coordinates.map((c, i) => (
                          <li key={i}>
                            <span className="font-semibold">
                              Polygon {i + 1}:
                            </span>{" "}
                            {c.map((c, i) => (
                              <span key={i}>
                                {c.poiXCoordinate} : {c.poiYCoordinate}
                              </span>
                            ))}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button onClick={goBackToStepOne}>Go Back to Step 1</Button>
                <Button variant="contained" onClick={editThePoi}>
                  Confirm and Create POI
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
