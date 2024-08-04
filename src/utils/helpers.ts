import { supabase } from "../context/AuthContext";
import { MarkerData } from "../model/PointOfInterest";

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  if (data && data.session) {
    return data.session.access_token;
  }
  return null;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const getColorByOpeningsTime = (
  markerData: MarkerData
):
  | "disabled"
  | "action"
  | "inherit"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  // Get the current time
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  // Parse the "HH:mm" strings into time objects
  const poiOpensTime = markerData.poiOpensDoorsAt.split(":");
  const poiClosesTime = markerData.poiClosesDoorsAt.split(":");
  const opensHours = parseInt(poiOpensTime[0], 10);
  const opensMinutes = parseInt(poiOpensTime[1], 10);
  const closesHours = parseInt(poiClosesTime[0], 10);
  const closesMinutes = parseInt(poiClosesTime[1], 10);

  // Define a threshold (in minutes) for nearly closing doors
  const nearlyClosingThreshold = 15; // You can adjust this as needed

  // Convert the times into minutes since midnight for easier comparison
  const currentMinutesSinceMidnight = currentHours * 60 + currentMinutes;
  const opensMinutesSinceMidnight = opensHours * 60 + opensMinutes;
  const closesMinutesSinceMidnight = closesHours * 60 + closesMinutes;

  // Check if the current time is between opens and closes
  const isBetween =
    currentMinutesSinceMidnight >= opensMinutesSinceMidnight &&
    currentMinutesSinceMidnight <= closesMinutesSinceMidnight;

  // Check if it's nearly closing doors
  const isNearlyClosing =
    closesMinutesSinceMidnight - currentMinutesSinceMidnight <=
      nearlyClosingThreshold &&
    currentMinutesSinceMidnight < closesMinutesSinceMidnight;

  return isBetween ? (isNearlyClosing ? "warning" : "success") : "error";
};

const checkValidUUID = (uuid: string) => {
  const uuidRegex =
    "^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$";
  const regex = new RegExp(uuidRegex, "ig");
  return regex.test(uuid) ? uuid : null;
};

export { getAccessToken, classNames, getColorByOpeningsTime, checkValidUUID };
