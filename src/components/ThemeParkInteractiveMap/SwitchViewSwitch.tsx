import "../../styles/interactiveMapStyles.css";
import "leaflet/dist/leaflet.css";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { Switch } from "@headlessui/react";
import { classNames } from "../../utils/helpers";
import { MapIcon, QueueListIcon } from "@heroicons/react/24/outline";

interface SwitchViewSwitchProps {
  isMapView: boolean;
  switchView: () => void;
}

const SwitchViewSwitch: React.FC<SwitchViewSwitchProps> = ({
  isMapView,
  switchView,
}) => (
  <div className="col-start-12 col-span-1 justify-self-start">
    <Switch
      checked={isMapView}
      onChange={switchView}
      className="relative bg-gray-500 inline-flex h-12 w-24 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out"
    >
      <span className="sr-only">Use switch for map view or card view</span>
      <span
        className={classNames(
          isMapView ? "translate-x-16" : "-translate-x-3",
          "-mt-1 pointer-events-none relative inline-block h-14 w-14 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        )}
      >
        <span
          className={classNames(
            isMapView
              ? "opacity-0 duration-100 ease-out"
              : "opacity-100 duration-200 ease-in",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
          )}
          aria-hidden="true"
        >
          <QueueListIcon className="h-24 w-24 text-gray-600 p-2" />
        </span>
        <span
          className={classNames(
            isMapView
              ? "opacity-100 duration-200 ease-in"
              : "opacity-0 duration-100 ease-out",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
          )}
          aria-hidden="true"
        >
          <MapIcon className="h-24 w-24 text-gray-600 p-2" />
        </span>
      </span>
    </Switch>
  </div>
);

export default SwitchViewSwitch;
