import { MapContainer, ImageOverlay } from "react-leaflet";
import "../../styles/interactiveMapStyles.css";
import "leaflet/dist/leaflet.css";
import { useContext, useEffect, useRef, useState } from "react";
import { Map } from "leaflet";
import { ClockIcon } from "@heroicons/react/20/solid";
import themeParkImg from "../../assets/theme-park.png";
import { CircularProgress } from "@mui/material";
import { usePointOfInterests } from "../../services/DataService";
import MarkerComponent from "./Markers/MarkerComponent";
import PointOfInterestCard from "./Markers/PointOfInterestCard";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { classNames } from "../../utils/helpers";
import CurrentTabContext from "../../context/CurrentTabContext";
import PolygonComponent from "./Polygon/PolygonComponent";
import FilterContext from "../../context/FilterContext";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import ThemeContext from "../../context/ThemeContext";
import AddNewPoiButton from "./AddNewPoiButton";
import FilterButton from "./FilterButton";
import SwitchViewSwitch from "./SwitchViewSwitch";
import FilterModal from "./FilterModal";

const imageUrl = themeParkImg;

export default function ThemeParkInteractiveMap() {
  const { session } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { setCurrentTab } = useContext(CurrentTabContext);
  const { theme } = useContext(ThemeContext);
  const mapContainerRef = useRef<Map>();
  const [isMapView, setIsMapView] = useState(true);

  const [openFilterModal, setOpenFilterModal] = useState(false);
  const { filterCriteria, setFilterCriteria } = useContext(FilterContext);

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
    refetch();
  };

  const handleFilterChange = (event: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = event.target;
    setFilterCriteria({
      ...filterCriteria,
      [name]: value,
    });
  };

  const { pointOfInterests, isLoading, isError, refetch } =
    usePointOfInterests(filterCriteria);

  useEffect(() => {
    function onQueueUpdate() {
      refetch();
    }

    socket.on("poi:queueUpdate", onQueueUpdate);

    return () => {
      socket.off("poi:queueUpdate", onQueueUpdate);
    };
  }, []);

  const addControls = () => {
    if (mapContainerRef.current) {
      mapContainerRef.current?.zoomControl.addTo(mapContainerRef.current);
    }
  };

  const removeControls = () => {
    mapContainerRef.current?.zoomControl.remove();
  };

  const switchView = () => {
    setIsMapView(!isMapView);
    !isMapView ? addControls() : removeControls();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <CircularProgress
          size={150}
          className="flex items-center justify-center"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center">
          <ClockIcon className="w-16 h-16 text-gray-400" />
          <p className="text-gray-400">Something went wrong...</p>
        </div>
      </div>
    );
  }

  function setBounds(): void {
    if (mapContainerRef.current) {
      mapContainerRef.current.fitBounds([
        [-0.6, -0.8],
        [-0.35, -0.8],
      ]);
    }
  }

  const addNewPoi = () => {
    setCurrentTab("add-poi");
    window.location.href = "/admin/points-of-interest/new";
  };

  return (
    <>
      {theme === "SNOW" && (
        <div className="snowmanContainer">
          <div className="snowCap">
            <div className="blackRec"></div>
            <div className="greyRec"></div>
            <div className="blackRec"></div>
          </div>
          <div className="snowTop">
            <div className="eye"></div>
            <div className="eye"></div>
          </div>
          <div className="snowScarf"></div>
          <div className="snowBottom"></div>
        </div>
      )}
      <div className=" pt-3 pb-2 rounded-lg">
        <div className="grid grid-cols-12">
          {session?.user && <AddNewPoiButton addNewPoi={addNewPoi} />}
          <FilterButton handleOpenFilterModal={handleOpenFilterModal} />
          <SwitchViewSwitch isMapView={isMapView} switchView={switchView} />
          <FilterModal
            openFilterModal={openFilterModal}
            handleCloseFilterModal={handleCloseFilterModal}
            setFilterCriteria={setFilterCriteria}
            handleFilterChange={handleFilterChange}
            filterCriteria={filterCriteria}
          />
        </div>

        <MapContainer
          className={classNames(
            theme === "SNOW" ? "snow" : "",
            "markercluster-map min-h-[80vh] max-h-[80vh] min-w-[70vw] overflow-y-scroll mt-2"
          )}
          maxBounds={[
            [-0.1, -0.1],
            [0.55, 0.56],
          ]}
          whenReady={setBounds}
          center={[0.2, 0.2]}
          zoom={11}
          minZoom={11}
          maxZoom={12}
          zoomAnimation={true}
          zoomDelta={1}
          dragging={true}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          attributionControl={true}
          zoomControl={true}
          ref={(mapRef) => {
            if (mapRef) mapContainerRef.current = mapRef;
          }}
        >
          {pointOfInterests && !isMapView && (
            <>
              <div className=" min-h-[80vh] max-h-[80vh] min-w-[70vw] overflow-y-scroll grid grid-cols-1 p-4 md:grid-cols-2 xl:grid-cols-3 justify-items-center">
                {pointOfInterests.map((data, index) => (
                  <div
                    key={index + `_cards`}
                    className="max-h-[290px] max-w-sm border-2 m-4 p-2 rounded-lg cursor-pointer bg-white"
                  >
                    <PointOfInterestCard markerData={data} />
                  </div>
                ))}
              </div>
            </>
          )}
          {pointOfInterests && isMapView && (
            <>
              <ImageOverlay
                bounds={[
                  [-0.1, -0.11],
                  [0.5, 0.55],
                ]}
                url={imageUrl}
                attribution="KdG Exam"
              />
              {pointOfInterests
                ?.filter((md) => md.coordinates.length > 1)
                .map((markerData, index) => (
                  <div key={index + `_polygons`}>
                    <PolygonComponent markerData={markerData} related={false} />
                  </div>
                ))}
              {pointOfInterests
                .filter((md) => md.coordinates.length === 1)
                .map((data, index) => (
                  <div key={index + `_markers`}>
                    <MarkerComponent markerData={data} related={false} />
                  </div>
                ))}
            </>
          )}
        </MapContainer>
      </div>
    </>
  );
}
