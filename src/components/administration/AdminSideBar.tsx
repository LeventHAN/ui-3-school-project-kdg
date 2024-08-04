import React, { useContext, useEffect } from "react";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, HomeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ArrowLeftCircleIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import CurrentTabContext from "../../context/CurrentTabContext";
import { classNames } from "../../utils/helpers";

const AdminSideBar: React.FC = () => {
  const { session } = useContext(AuthContext);
  const { currentTab, setCurrentTab } = useContext(CurrentTabContext);
  const isActive = (tabToCheck: string) => {
    return currentTab === tabToCheck;
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (session && currentTab)
    return (
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="https://cdn-img1.imgworlds.com/assets/a9fd059a-f8ed-4616-a78f-a2fb6cd7a680.png"
                        alt="Theme Park Exam"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            <li key="menu-item-1 text-sm">
                              <Link
                                to={"/"}
                                className={`text-sm text-white group flex gap-x-3 rounded-md p-2 leading-6 font-semibold`}
                              >
                                <ArrowLeftCircleIcon
                                  className="h-4 w-4 shrink-0"
                                  aria-hidden="true"
                                />
                                Go back to website
                              </Link>
                            </li>
                            <li key="menu-item-1">
                              <Link
                                onClick={() => setCurrentTab("dashboard")}
                                to={"/admin/"}
                                className={classNames(
                                  isActive("dashboard")
                                    ? "bg-gray-500 text-white"
                                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <HomeIcon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                Dashboard
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://cdn-img1.imgworlds.com/assets/a9fd059a-f8ed-4616-a78f-a2fb6cd7a680.png"
                alt="ThemeParkExam"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    <li key="menu1">
                      <Link
                        to={"/"}
                        className={` text-white group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`}
                      >
                        <ArrowLeftCircleIcon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        Go back to website
                      </Link>
                    </li>
                    <li key="menu2">
                      <Link
                        onClick={() => setCurrentTab("dashboard")}
                        to={"/admin/"}
                        className={classNames(
                          isActive("dashboard")
                            ? "bg-gray-500 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <HomeIcon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        Dashboard
                      </Link>
                    </li>
                    <li key="menu3">
                      <Link
                        onClick={() => setCurrentTab("add-poi")}
                        to={"/admin/points-of-interest/new"}
                        className={classNames(
                          isActive("add-poi")
                            ? "bg-gray-500 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <PlusCircleIcon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        Add new Point of Interest
                      </Link>
                    </li>
                  </ul>
                </li>
                {session && (
                  <li className="-mx-6 mt-auto">
                    <a
                      href="#"
                      className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                    >
                      <img
                        className="h-8 w-8 rounded-full bg-gray-800"
                        src={session?.user?.user_metadata?.avatar_url}
                        alt=""
                      />
                      <span className="col-span-full">
                        {session?.user?.user_metadata?.full_name}
                        <span className="block text-sm">
                          {session?.user?.email}
                        </span>
                      </span>
                    </a>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            Dashboard
          </div>
          <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800">
            <img
              className="h-8 w-8 rounded-full bg-gray-800"
              src={session?.user?.user_metadata?.avatar_url}
              alt=""
            />
            <span>{session?.user?.email}</span>
          </div>
        </div>
      </div>
    );
};

export default AdminSideBar;
