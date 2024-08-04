import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SocketContext } from "../../context/SocketContext";
import { ArrowRightCircleIcon } from "@heroicons/react/20/solid";
import ThemeParkHeroImg from "../../assets/theme-park-hero.png";
import ThemeContext from "../../context/ThemeContext";

export default function LandingPage() {
  const { socket } = useContext(SocketContext);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isErrored, setIsErrored] = useState(false);
  const { theme } = useContext(ThemeContext);

  const [randomValue, setRandomValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // max 100 min 0 the steps should be per 10
      const randomValue = Math.floor(Math.random() * 100) + 0;
      setRandomValue(randomValue);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setIsErrored(false);
    }

    function onDisconnect() {
      setIsConnected(false);
      setIsErrored(false);
    }

    function onConnectionError() {
      setIsErrored(true);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("connect_error", onConnectionError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectionError);
    };
  }, []);
  return (
    <div
      className="h-full min-h-screen"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(36, 45, 60, 0.8)), url('https://i.pinimg.com/originals/49/48/6f/49486fe0d689ead689894cd569f01f47.gif')",
        backgroundSize: "cover",
      }}
    >
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
      <div className={`relative isolate ${theme === "SNOW" ? "snow" : ""}`}>
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
              width={200}
              height={200}
              x={randomValue + "%"}
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg
            x={randomValue + "%"}
            y={-1}
            className="overflow-visible fill-gray-50"
          >
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
          />
        </svg>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-44 lg:px-2 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
            <div className="flex">
              <div className="relative flex items-center gap-x-4 rounded-full px-4 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                <span className="font-semibold text-yellow-800">PROMOTION</span>
                <span className="h-4 w-px bg-gray-900/10" aria-hidden="true" />
                <a href="#" className="flex items-center gap-x-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  -10% OFF FAMILY WEEK
                </a>
              </div>
            </div>
            <h1 className="mt-10 max-w-lg text-2xl font-bold tracking-tight text-yellow-800 sm:text-6xl">
              THEME PARK: <br />
              <span className="ml-4 bg-gradient-to-r from-blue-500 to-pink-500 text-transparent bg-clip-text">
                🎢IMG🌟 BOUELVARD
              </span>
            </h1>
            <p className="mt-6 text-mnd leading-8 text-yellow-800 font-extrabold">
              Get ready for a thrill-packed adventure like no other at IMG
              Boulevard <br />
              Where Imagination Meets Reality! 🎢🌟
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to={"/theme-park"}
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Check out our new interactive park
                <ArrowRightCircleIcon className="w-6" />
              </Link>
            </div>
          </div>
          <div className="">
            <img
              src={ThemeParkHeroImg}
              alt="Theme Park Hero"
              className="h-[600px] w-auto object-cover hidden lg:flex"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
