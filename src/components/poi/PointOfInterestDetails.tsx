import React from "react";
import { usePointOfInterestDetails } from "../../services/DataService";
import { checkValidUUID } from "../../utils/helpers";
import { CircularProgress } from "@mui/material";
import RelatedPointOfInterests from "./RelatedPointOfInterests";
import OnePoiWithItsRelatedPoisOnMap from "./OnePoiWithItsRelatedPoisOnMap";

const PointOfInterestDetails: React.FC = () => {
  // get the uuid from the url
  const uuid = window.location.pathname.split("/")[2];

  const { pointOfInterest, isLoading, isError } = usePointOfInterestDetails(
    checkValidUUID(uuid)
  );

  if (isLoading) {
    return (
      <div className="overflow-hidden relative items-center isolate px-6 py-[30vh] flex flex-col min-h-full bg-center bg-cover bg-clip-border">
        <CircularProgress size={120} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="overflow-hidden relative items-center isolate px-6 py-[30vh] flex flex-col min-h-full bg-center bg-cover bg-clip-border">
        <p className="text-gray-400">Something went wrong...</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="h-full min-h-screen"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(36, 45, 60, 0.8)), url('https://i.pinimg.com/originals/49/48/6f/49486fe0d689ead689894cd569f01f47.gif')",
          backgroundSize: "cover",
        }}
      >
        <div className="relative isolate">
          <svg
            className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                width={200}
                height={200}
                x={"56%"}
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x={"56%"} y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
            />
          </svg>
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-x-44 lg:px-2  bg-white p-4">
            <div>
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {pointOfInterest && (
                  <>
                    {/* Image section */}
                    <div className="mt-12 xl:mx-auto xl:max-w-7xl xl:px-8">
                      <img
                        src={pointOfInterest.image}
                        alt={pointOfInterest.name}
                        className="aspect-[5/2] w-full object-cover xl:rounded-3xl"
                      />
                    </div>

                    {/* Values section */}
                    <div className="mx-auto mt-12 max-w-7xl px-6 lg:px-8">
                      <div className="mx-auto  lg:mx-0">
                        <div className="relative flex py-5 items-center mb-8">
                          <span className="flex-shrink mx-4 text-gray-400">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                              {pointOfInterest.name}
                            </h2>
                          </span>
                          <div className="flex-grow border-t border-gray-400"></div>
                        </div>

                        <p className="mt-6 text-lg leading-8 text-gray-900">
                          {pointOfInterest.description}
                        </p>
                      </div>
                      <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                        <div>
                          <dt className="font-semibold text-gray-900">
                            Working hours
                          </dt>
                          <dd className="mt-1 text-gray-600">
                            {pointOfInterest.poiOpensDoorsAt} -{" "}
                            {pointOfInterest.poiClosesDoorsAt}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-gray-900 flex">
                            Current Queue
                          </dt>

                          <dd className="mt-1 text-gray-600">
                            {pointOfInterest.currentQueueLength} min
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-gray-900">
                            Required minimum length
                          </dt>
                          <dd className="mt-1 text-gray-600">
                            {pointOfInterest.requiredMinLength} cm
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-gray-900">
                            Category
                          </dt>
                          <dd className="mt-1 text-gray-600">
                            {pointOfInterest.category}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-gray-900">Tags</dt>
                          <dd className="mt-1 text-gray-600">
                            {(pointOfInterest.tags as string[]).join(", ")}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-gray-900">
                            Target Groups
                          </dt>
                          <dd className="mt-1 text-gray-600">
                            {pointOfInterest.targetGroup}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <RelatedPointOfInterests poi={pointOfInterest} />
                    <OnePoiWithItsRelatedPoisOnMap
                      pointOfInterest={pointOfInterest}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PointOfInterestDetails;
