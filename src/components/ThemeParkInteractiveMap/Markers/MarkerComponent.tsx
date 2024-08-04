import React from "react";
import { MarkerData } from "../../../model/PointOfInterest";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import PointOfInterestCard from "./PointOfInterestCard";

interface Props {
  markerData: MarkerData;
  related: boolean;
}

const MarkerComponent: React.FC<Props> = ({ markerData, related }) => {
  return (
    <Marker
      key={markerData.id}
      position={[
        markerData.coordinates[0].poiXCoordinate,
        markerData.coordinates[0].poiYCoordinate,
      ]}
      draggable={false}
      icon={L.icon({
        className: related ? "hue-rotate-90" : "hue-rotate-0",
        iconUrl: "https://cdn-icons-png.flaticon.com/512/7705/7705037.png",
        iconSize: [80, 80],
      })}
    >
      <Popup minWidth={90}>
        <PointOfInterestCard markerData={markerData} />
      </Popup>
    </Marker>
  );
};

export default MarkerComponent;
