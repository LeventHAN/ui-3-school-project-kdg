import { useContext } from "react";
import ThemeParkInteractiveMap from "./ThemeParkInteractiveMap";
import ThemeContext from "../../context/ThemeContext";

const ThemePark = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div>
      <div
        className="overflow-hidden relative items-center isolate px-6 py-12 sm:px-24 xl:py- flex flex-col h-full min-h-screen bg-center bg-cover bg-clip-border"
        style={{
          backgroundBlendMode: "color-dodge",
          backgroundImage: `linear-gradient(to right, rgba(111, 246, 252, 0.92), rgba(111, 19, 93, 0.90)), url('https://i.pinimg.com/originals/49/48/6f/49486fe0d689ead689894cd569f01f47.gif')`,
        }}
      >
        <div className={`${theme === "SNOW" ? "snow" : ""}`}>
          <ThemeParkInteractiveMap />
        </div>
      </div>
    </div>
  );
};

export default ThemePark;
