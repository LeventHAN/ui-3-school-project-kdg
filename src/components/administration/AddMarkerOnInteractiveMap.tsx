import { MapContainer, Marker, ImageOverlay, Polygon } from "react-leaflet";
import "../../styles/interactiveMapStyles.css";
import "leaflet/dist/leaflet.css";
import { useRef, useState } from "react";
import { Map } from "leaflet";
import L from "leaflet";
import themeParkImg from "../../assets/theme-park.png";
import { Button } from "@mui/material";
import {
  Coordinate,
  CreateMarkerDataInput,
  MarkerData,
} from "../../model/PointOfInterest";

const imageUrl = themeParkImg;

export default function AddMarkerOnInteractiveMap({
  currentMarkerCoordinates,
  setCurrentMarkerCoordinates,
  moveToNextStep,
  showPolygonsInsteadOfMarkers,
  marker,
}: {
  currentMarkerCoordinates: Coordinate[][];
  setCurrentMarkerCoordinates: (marker: Coordinate[][]) => void;

  moveToNextStep: () => void;
  showPolygonsInsteadOfMarkers: boolean;
  marker?: CreateMarkerDataInput & { coordinates: Coordinate[][] };
}) {
  const markerRefs = useRef([]);
  const mapContainerRef = useRef<Map>();

  const [allowDrawZone, setAllowDrawZone] = useState(true);
  const [allowZoneRemove, setAllowZoneRemove] = useState(false);

  const readyToMoveToNextStep = () => {
    const geoJsonLayers = mapContainerRef.current?.pm
      .getGeomanLayers(true)
      .toGeoJSON();

    if (geoJsonLayers && geoJsonLayers.type === "FeatureCollection") {
      if (geoJsonLayers.features[0].geometry.type === "Polygon") {
        const geometry = geoJsonLayers.features[0].geometry as {
          type: string;
          coordinates: number[][][];
        };
        const arrayOfCoordinates = geometry.coordinates;
        const mappedArray = arrayOfCoordinates.map((c) => {
          return c.map((coordinates) => {
            return {
              poiXCoordinate: coordinates[0],
              poiYCoordinate: coordinates[1],
            };
          });
        });
        setCurrentMarkerCoordinates(mappedArray);
      }

      if (geoJsonLayers.features[0].geometry.type === "Point") {
        const geometry = geoJsonLayers.features[0].geometry;
        const arrayOfCoordinates = geometry.coordinates;
        const mappedArray = [
          [
            {
              poiXCoordinate: arrayOfCoordinates[1],
              poiYCoordinate: arrayOfCoordinates[0],
            },
          ],
        ] as Coordinate[][];
        setCurrentMarkerCoordinates(mappedArray);
      }
    }

    moveToNextStep();
  };

  const addControls = () => {
    if (mapContainerRef.current) {
      mapContainerRef.current?.zoomControl.addTo(mapContainerRef.current);
      mapContainerRef.current.pm.addControls({
        drawMarker: false,
        drawCircle: false,
        cutPolygon: false,
        customControls: false,
        dragMode: false,
        drawText: false,
        drawRectangle: false,
        drawCircleMarker: false,
        drawPolyline: false,
        rotateMode: false,
        editMode: true,
        removalMode: true,

        drawPolygon: allowDrawZone || !!marker,
        editControls: allowZoneRemove || !!marker,
      });

      mapContainerRef.current.pm.setGlobalOptions({ editable: true });

      mapContainerRef.current.on("pm:create", (e) => {
        const geoJsonLayers = mapContainerRef.current?.pm
          .getGeomanLayers(true)
          .toGeoJSON();
        if (e.layer && e.layer.pm) {
          const shape = e;

          shape.layer.pm.enable();

          if (
            geoJsonLayers &&
            geoJsonLayers.type === "FeatureCollection" &&
            geoJsonLayers.features.length === 1
          ) {
            setAllowDrawZone(false);
            setAllowZoneRemove(true);
          }

          mapContainerRef
            .current!.pm.getGeomanLayers()
            .map((layer) =>
              layer.bindPopup(
                `This will be replaced by the POI details after creation.`
              )
            );

          shape.layer.on("pm:remove", () => {
            setAllowDrawZone(true);
            setAllowZoneRemove(false);
          });
        }
      });
    }
  };

  if (showPolygonsInsteadOfMarkers) {
    addControls();
  }

  const renderMarkers = currentMarkerCoordinates[0].map((data, index) => (
    <Marker
      key={index}
      position={[data.poiXCoordinate, data.poiYCoordinate]}
      draggable={true}
      icon={L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/7705/7705037.png",
        iconSize: [80, 80],
      })}
      ref={(ref) => {
        if (ref) markerRefs.current[index] = ref as never;
      }}
    />
  ));

  function setBounds(): void {
    if (mapContainerRef.current)
      mapContainerRef.current.fitBounds([
        [-0.6, -0.8],
        [-0.35, -0.8],
      ]);
  }

  return (
    <>
      <Button variant="contained" onClick={readyToMoveToNextStep}>
        Save the POI location
      </Button>
      <MapContainer
        className="markercluster-map sm:min-h-[900px] sm:min-w-[1200px] min-w-[120px] mt-2"
        maxBounds={[
          [-0.1, -0.1],
          [0.55, 0.56],
        ]}
        whenReady={setBounds}
        center={[0.2, 0.2]}
        zoom={11}
        minZoom={11}
        zoomAnimation={true}
        zoomDelta={1}
        maxZoom={14}
        dragging={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        attributionControl={true}
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
          attribution="KdG Exam"
        />
        {!showPolygonsInsteadOfMarkers && renderMarkers}
        {showPolygonsInsteadOfMarkers && marker && (
          <Polygon
            pathOptions={{ color: "blue", pmIgnore: false }}
            positions={marker.coordinates.map((c) => [
              c.poiYCoordinate,
              c.poiXCoordinate,
            ])}
          ></Polygon>
        )}
      </MapContainer>
    </>
  );
}
