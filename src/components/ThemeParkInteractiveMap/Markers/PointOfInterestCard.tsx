import { Button, Chip, IconButton } from "@mui/material";
import {
  Delete,
  Edit,
  LockClockRounded,
  Search,
  SquareFoot,
  Timer,
  Visibility,
} from "@mui/icons-material";
import { MarkerData } from "../../../model/PointOfInterest";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { classNames, getColorByOpeningsTime } from "../../../utils/helpers";
import { deletePointOfInterest } from "../../../services/DataService";

interface Props {
  markerData: MarkerData;
}

const PointOfInterestCard: React.FC<Props> = ({ markerData }) => {
  const { session } = useContext(AuthContext);

  const handleDeleteClicked = async () => {
    const { status } = await deletePointOfInterest(markerData.id);
    if (status === 200) {
      alert("Point of interest deleted successfully!");
    } else {
      alert("Something went wrong, please try again later!");
    }

    window.location.reload();
  };

  return (
    <div
      key={markerData.id}
      className="col-span-1 flex flex-col divide-gray-200 rounded-lg text-center"
    >
      <div
        className="h-36 bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url('${markerData.image}')` }}
      >
        <h3 className="mt-4 text-xl font-bold text-gray-900 bg-white m-2 rounded-md">
          {markerData.name}
        </h3>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="col-span-1 rounded-lg text-center">
          <span className="relative items-center justify-center rounded-br-lg border border-transparent py-2 font-semibold space-y-2">
            <Chip
              className="mt-2 mr-2"
              label={`${markerData.poiOpensDoorsAt} : ${markerData.poiClosesDoorsAt}`}
              size="medium"
              variant="filled"
              icon={
                <LockClockRounded
                  color={getColorByOpeningsTime(markerData)}
                  className="h-5 w-5"
                />
              }
            />
            <Chip
              label={`Realtime queue: ${
                markerData.currentQueueLength || 0
              } min`}
              size="medium"
              variant="filled"
              icon={
                <Timer
                  color={
                    markerData.currentQueueLength <= 5
                      ? "success"
                      : markerData.currentQueueLength <= 15
                      ? "warning"
                      : "error"
                  }
                  className="h-5 w-5"
                />
              }
            />
            <Chip
              label={`Required min. length: ${
                markerData.requiredMinLength || 0
              }`}
              size="medium"
              color="default"
              variant="filled"
              className="mt-2"
              icon={<SquareFoot className="h-5 w-5 text-gray-400" />}
            />
          </span>
          <div
            className={classNames(
              session
                ? "mt-1 -mb-[3.5rem] space-x-1 ml-[60%] flex"
                : "mt-1 -mb-[3.5rem] space-x-1 ml-[90%] flex"
            )}
          >
            {session && session.user && (
              <>
                <div className="bg-white rounded-full w-12 h-12 ">
                  <IconButton
                    onClick={() => {
                      window.location.href =
                        window.location.origin +
                        `/admin/points-of-interest/${markerData.id}`;
                    }}
                    size="large"
                  >
                    <Edit color="warning" />
                  </IconButton>
                </div>
                <div className="bg-white rounded-full w-12 h-12 ">
                  <IconButton onClick={handleDeleteClicked} size="large">
                    <Delete color="error" />
                  </IconButton>
                </div>
              </>
            )}
            <div className="bg-white rounded-full w-12 h-12">
              <IconButton
                onClick={() => {
                  window.location.href =
                    window.location.origin + `/poi/${markerData.id}`;
                }}
                size="large"
              >
                <Visibility color="primary" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointOfInterestCard;
