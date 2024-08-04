import React from "react";
import { MarkerData } from "../../../model/PointOfInterest";
import { Polygon, Popup } from "react-leaflet";
import PointOfInterestCard from "../Markers/PointOfInterestCard";

interface Props {
  markerData: MarkerData;
  related: boolean;
}

const PolygonComponent: React.FC<Props> = ({ markerData, related }) => {
  const loadPolygonZones = (zoneMarkerData: MarkerData) => {
    const mappedPolygonZones = zoneMarkerData.coordinates.map((coordinates) => {
      return [coordinates.poiYCoordinate, coordinates.poiXCoordinate] as [
        number,
        number
      ];
    });
    return [...mappedPolygonZones];
  };

  return (
    <Polygon
      pathOptions={{ color: related ? "green" : "red", pmIgnore: false }}
      positions={loadPolygonZones(markerData)}
    >
      <Popup minWidth={90}>
        <PointOfInterestCard markerData={markerData} />
      </Popup>
    </Polygon>
  );
};

export default PolygonComponent;
