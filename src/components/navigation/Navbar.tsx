import { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { SocketContext } from "../../context/SocketContext";
import { Menu, Popover, Transition } from "@headlessui/react";
import Auth from "../authentication/Auth";
import { classNames } from "../../utils/helpers";
import ThemeContext from "../../context/ThemeContext";

export default function Navbar() {
  const { supabase, session } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  async function signOut() {
    await supabase.auth.signOut();
    await socket.disconnect();
  }

  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <>
      {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
      <Popover
        as="header"
        className={({ open }: { open: boolean }) =>
          classNames(open ? "z-40 overflow-y-auto" : "")
        }
      >
        {({ open }: { open: boolean }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
                <div className="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" type="button">
                      <img
                        className="h-8 w-auto"
                        src="https://cdn-img1.imgworlds.com/assets/a9fd059a-f8ed-4616-a78f-a2fb6cd7a680.png"
                        alt="logo"
                      />
                    </Link>
                  </div>
                </div>
                <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6">
                  <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0">
                    <div className="w-full block rounded-md border-0 py-2.5 pl-10 pr-3 sm:text-sm sm:leading-6">
                      <div className="hidden lg:flex lg:gap-x-12">
                        <Link
                          to="/"
                          type="button"
                          className="text-sm font-semibold leading-6 text-gray-900"
                        >
                          Home
                        </Link>
                        {session && (
                          <Link
                            to="/admin/"
                            type="button"
                            className="text-sm font-semibold leading-6 text-gray-900"
                          >
                            Administration
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center md:absolute md:inset-y-0 md:right-0 lg:hidden">
                  {/* Mobile menu button */}
                  <Popover.Button className="relative -mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 ">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
                <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">
                  <div className="flex gap-x-4 mr-2">
                    <button
                      onClick={() => {
                        setTheme(theme === "SNOW" ? "SUMMER" : "SNOW");
                      }}
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      {theme === "SNOW" ? "Snow Mode" : "Summer Mode"}
                    </button>
                  </div>

                  {!session && <Auth />}
                  {session && (
                    <Menu as="div" className="relative ml-5 flex-shrink-0">
                      <div>
                        <Menu.Button className="relative flex rounded-full">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-auto rounded-full"
                            src={
                              session?.user?.user_metadata?.picture || "#broken"
                            }
                            alt={
                              session?.user?.user_metadata?.custom_claims
                                ?.global_name
                            }
                          />
                          <span className="h-8 w-auto mt-1 ml-2 font-medium">
                            {
                              session?.user?.user_metadata?.custom_claims
                                ?.global_name
                            }
                            <span className=" block text-[0.5rem] text-gray-500 font-extralight">
                              {session?.user?.user_metadata?.email}
                            </span>
                          </span>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                          <Menu.Item>
                            {({ active }: { active: boolean }) => (
                              <a
                                href="#"
                                className={classNames(
                                  active ? "bg-gray-500" : "",
                                  "block px-4 py-2 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-400"
                                )}
                                onClick={signOut}
                              >
                                Log out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  )}
                </div>
              </div>
            </div>

            <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
              <div className="border-t border-gray-200 pb-3 pt-4">
                {session && (
                  <div className="mx-auto flex max-w-3xl items-center px-4 sm:px-6">
                    <div className="flex-shrink-0">
                      {session && (
                        <img
                          className="h-8 w-auto rounded-full"
                          src={
                            session?.user?.user_metadata?.picture || "#broken"
                          }
                          alt={
                            session?.user?.user_metadata?.custom_claims
                              ?.global_name
                          }
                        />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {session?.user?.custom_claims?.global_name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {session?.user?.user_metadata?.full_name}
                      </div>
                    </div>
                  </div>
                )}
                {!session && <Auth />}
                <div className="mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4">
                  <a
                    href="https://github.com/LeventHAN"
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  >
                    Developed /w ❤️ by LeventHAN
                  </a>
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </>
  );
}
