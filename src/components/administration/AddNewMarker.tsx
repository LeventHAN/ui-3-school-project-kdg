import { useContext, useState } from "react";
import { classNames } from "../../utils/helpers";
import AddNewMarkerForm from "./forms/AddNewMarkerForm";
import { createPointOfInterest } from "../../services/DataService";
import {
  Category,
  Coordinate,
  CreateMarkerDataInput,
  TargetGroup,
} from "../../model/PointOfInterest";
import AddMarkerOnInteractiveMap from "./AddMarkerOnInteractiveMap";
import { AuthContext } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@mui/material";

enum Step {
  FillInData = "5%",
  SetMarkerOnMap = "50%",
  ConfirmDataAndMarker = "100%",
}

const markerCreateSchema: z.ZodSchema<CreateMarkerDataInput> = z.object({
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
  relatedToAttractionIds: z.array(z.string().min(1).max(160)),
});

export default function AddNewMarker() {
  // check if user is authenticated if not return to /
  const { session } = useContext(AuthContext);

  const [currentStep, setCurrentStep] = useState<Step>(Step.FillInData);
  const [marker, setMarker] = useState<CreateMarkerDataInput>();

  const [adminWantsToAddZone, setAdminWantsToAddZone] =
    useState<boolean>(false);

  const [markerCoordinates, setMarkerCoordinates] = useState<Coordinate[][]>([
    [
      {
        poiXCoordinate: 0.08,
        poiYCoordinate: 0.0,
      },
    ],
  ]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateMarkerDataInput>({
    resolver: zodResolver(markerCreateSchema),
    defaultValues: {
      name: "",
      category: Category.ATTRACTION,
      image: "",
      description: "",
      tags: [],
      relatedToAttractionIds: [],
      targetGroup: TargetGroup.ALL,
      requiredMinLength: 0,
      poiOpensDoorsAt: new Date().toISOString().substring(11, 16),
      poiClosesDoorsAt: new Date().toISOString().substring(11, 16),
    },
  });

  if (!session) {
    return <div>You are not authenticated to see this page</div>;
  }

  const createThePoi = async () => {
    if (marker) {
      const { status, data } = await createPointOfInterest({
        ...marker,
        coordinates: markerCoordinates,
        currentQueueLength: 0,
      });
      if (status === 200) {
        alert("POI created successfully");
        if (data.id) window.location.href = `/admin/pointOfInterest/${data.id}`;
      } else {
        alert("Something went wrong");
        console.error(data);
      }
    }
  };
  const moveToNextStep = () => {
    setCurrentStep((prev) => {
      switch (prev) {
        case Step.FillInData:
          return Step.SetMarkerOnMap;
        case Step.SetMarkerOnMap:
          return Step.ConfirmDataAndMarker;
        case Step.ConfirmDataAndMarker: {
          createThePoi();
          return Step.FillInData;
        }
      }
    });
  };

  const goBackToStepOne = () => {
    setCurrentStep(Step.FillInData);
  };

  async function onSubmit(marker: CreateMarkerDataInput) {
    moveToNextStep();
    setMarker(marker);
  }

  return (
    <>
      <div className="p-4">
        <div>
          <p className="text-2xl font-extrabold text-gray-900">
            Add new POI to the map
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
                Fill in the Point of Interest data
              </div>
              <div
                className={classNames(
                  currentStep === Step.SetMarkerOnMap ? "text-indigo-600" : "",
                  "text-center"
                )}
              >
                Set a location on the map for the new POI
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
          {currentStep === Step.FillInData && (
            <>
              <div className="bg-gray-50 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <AddNewMarkerForm
                  onSubmit={onSubmit}
                  handleSubmit={handleSubmit}
                  control={control}
                  errors={errors}
                  watch={watch}
                  setAdminWantsToAddZone={setAdminWantsToAddZone}
                />
              </div>
            </>
          )}
          {currentStep === Step.SetMarkerOnMap && (
            <AddMarkerOnInteractiveMap
              currentMarkerCoordinates={markerCoordinates}
              setCurrentMarkerCoordinates={setMarkerCoordinates}
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
                  {markerCoordinates && markerCoordinates[0] && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">
                        Location Details
                      </h3>
                      <ul className="list-disc pl-6">
                        <li>
                          <span className="font-semibold">X Coordinate:</span>{" "}
                          {markerCoordinates[0].poiXCoordinate}
                        </li>
                        <li>
                          <span className="font-semibold">Y Coordinate:</span>{" "}
                          {markerCoordinates[0].poiYCoordinate}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button onClick={goBackToStepOne}>Go Back to Step 1</Button>
                <Button variant="contained" onClick={createThePoi}>
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
