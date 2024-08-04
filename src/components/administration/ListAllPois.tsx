import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import ThemeParkInteractiveMap from "../ThemeParkInteractiveMap/ThemeParkInteractiveMap";

export default function ListAllPois() {
  // check if user is authenticated if not return to /
  const { session } = useContext(AuthContext);

  if (!session) {
    return <div>You are not authenticated to see this page</div>;
  }

  return (
    <>
      <div className="p-4">
        <div>
          <p className="text-2xl font-extrabold text-gray-900">
            List of all point of interests
          </p>
        </div>
        <div className="p-4 mt-6 flex flex-col items-center justify-center">
          <ThemeParkInteractiveMap />
        </div>
      </div>
    </>
  );
}
