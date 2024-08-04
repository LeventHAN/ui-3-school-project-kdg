import { MapContainer, Marker, ImageOverlay } from "react-leaflet";
import "../../styles/interactiveMapStyles.css";
import "leaflet/dist/leaflet.css";
import { useRef, useState } from "react";
import { Map } from "leaflet";
import L from "leaflet";
import themeParkImg from "../../assets/theme-park.png";
import { Button } from "@mui/material";
import { MarkerData } from "../../model/PointOfInterest";
import PolygonComponent from "../ThemeParkInteractiveMap/Polygon/PolygonComponent";
import MarkerComponent from "../ThemeParkInteractiveMap/Markers/MarkerComponent";

const imageUrl = themeParkImg;

interface OnePoiWithItsRelatedPoisOnMapProps {
  pointOfInterest: MarkerData;
}

export default function OnePoiWithItsRelatedPoisOnMap({
  pointOfInterest,
}: OnePoiWithItsRelatedPoisOnMapProps) {
  const mapContainerRef = useRef<Map>();

  function setBounds(): void {
    if (mapContainerRef.current)
      mapContainerRef.current.fitBounds([
        [-0.6, -0.8],
        [-0.35, -0.8],
      ]);
  }

  return (
    <>
      <div className="mt-24 text-center">
        <div className="relative flex py-5 items-center mb-8">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-gray-400">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Or view them in our map view
            </h2>
          </span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <p className="mt-6 text-sm leading-8">
          <span className="font-bold text-red-500">RED</span> marker/zone is for
          the current POI <br />
          <span className="font-bold text-green-500">GREEN</span> marker/zone is
          for the related POIs
        </p>
        {pointOfInterest && (
          <MapContainer
            className="markercluster-map sm:min-h-[900px] sm:min-w-[1200px] min-w-[120px] mt-2"
            maxBounds={[
              [-1, -0.1],
              [1, 0.5],
            ]}
            whenReady={setBounds}
            center={[0.2, 0.2]}
            zoom={11}
            minZoom={11}
            zoomAnimation={true}
            zoomDelta={1}
            maxZoom={14}
            dragging={true}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            attributionControl={false}
            zoomControl={true}
            ref={(mapRef) => {
              if (mapRef) mapContainerRef.current = mapRef;
            }}
          >
            <ImageOverlay
              bounds={[
                [-0.1, -0.11],
                [0.5, 0.55],
              ]}
              url={imageUrl}
              attribution="POI with related POIs only"
            />
            {pointOfInterest.coordinates.length > 1 && (
              <div key={"poly_" + pointOfInterest.id}>
                <PolygonComponent
                  markerData={pointOfInterest}
                  related={false}
                />
              </div>
            )}
            {pointOfInterest.coordinates.length === 1 && (
              <div key={"marker_" + pointOfInterest.id}>
                <MarkerComponent markerData={pointOfInterest} related={false} />
              </div>
            )}

            {[
              ...pointOfInterest.relatedPoi,
              ...pointOfInterest.relatingToPoi,
            ].map((allP) => (
              <>
                {allP.coordinates.length > 1 && (
                  <div key={"poly_" + allP.id}>
                    <PolygonComponent markerData={allP} related />
                  </div>
                )}
                {allP.coordinates.length === 1 && (
                  <div key={"marker_" + allP.id}>
                    <MarkerComponent markerData={allP} related />
                  </div>
                )}
              </>
            ))}
          </MapContainer>
        )}
      </div>
    </>
  );
}
