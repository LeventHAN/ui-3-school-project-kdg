import React from "react";
import { MarkerData } from "../../model/PointOfInterest";

interface RelatedPointOfInterestsProps {
  poi: MarkerData;
}

const RelatedPointOfInterests: React.FC<RelatedPointOfInterestsProps> = ({
  poi,
}) => {
  return (
    <>
      <div className="mx-auto text-center mt-36">
        <div className="relative flex py-5 items-center mb-8">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Related Point of Interests
            </h2>
          </span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>

        <p className="mt-2 text-lg leading-8 text-gray-600">
          Just in case you want to visit more places ;)
        </p>
      </div>
      <div className="mx-auto mt-8 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {(poi.relatedPoi || poi.relatingToPoi) &&
          [...poi.relatedPoi, ...poi.relatingToPoi].map((p) => (
            <article
              key={p.id}
              className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
            >
              <img
                src={p.image}
                alt={p.name}
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <time className="mr-8">
                  {p.poiOpensDoorsAt} - {p.poiClosesDoorsAt}
                </time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg
                    viewBox="0 0 2 2"
                    className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                  >
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <div className="flex gap-x-2.5">
                    Queue: {p.currentQueueLength} min
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                <a href={`/poi/${p.id}`}>
                  <span className="absolute inset-0" />
                  {p.name}
                </a>
              </h3>
            </article>
          ))}
      </div>
    </>
  );
};

export default RelatedPointOfInterests;
