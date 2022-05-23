import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  useClerk,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import { SearchIcon } from "@heroicons/react/solid";
import { Menu, Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navigation() {
  const { signOut } = useClerk();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { isSignedIn, user } = useUser();
  const [
    isUserRedirectToSignInActive,
    setIsUserRedirectToSignInActivePayNowSelected,
  ] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [locationOrZipInput, setLocationOrZipInput] = useState("");
  const [locationRadiusInput, setLocationRadiusInput] = useState(0);
  const [categoryInput, setCategoryInput] = useState("");
  const [subcategoryInput, setSubcategoryInput] = useState("");

  if (!isLoaded || !userId || !isSignedIn) {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 grid grid-cols-3 p-6 bg-white shadow-sm md:px-10 md:py-8 lg:pl-20">
      {/* Left Navbar */}
      <div className="relative flex items-center h-12 my-auto select-none">
        <Link href="/">
          <a>
            <Image
              src="/safeanzeigen-logo-text.png"
              alt="Safeanzeigen Logo Image"
              layout="fill"
              objectFit="contain"
              objectPosition="left"
              className="cursor-pointer"
            />
          </a>
        </Link>
      </div>
      {/* Middle Navbar */}
      <div
        className={`flex items-center border-2 select-none md:shadow-sm xs:ml-2 ${
          searchInput ? "rounded-tl-lg rounded-tr-lg" : "rounded-lg"
        }`}
      >
        <input
          className="flex-grow pl-6 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-transparent outline-none xs:pl-4 focus:outline-none focus:border-transparent focus:ring-0"
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Was suchen Sie?"
        />
        <SearchIcon className="hidden h-8 p-2 text-white bg-orange-400 rounded-full cursor-pointer hover:bg-orange-500 md:inline-flex md:mx-3" />
      </div>
      {/* Right Navbar */}
      <Popover
        as="header"
        className={({ open }) =>
          classNames(
            open ? "fixed inset-0 z-21 overflow-y-auto" : "",
            "bg-white lg:static lg:overflow-y-visible py-2"
          )
        }
      >
        {({ open }) => (
          <>
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
                <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                  {/* Mobile Button & Screen Reader Accessibility */}
                  <Popover.Button className="inline-flex items-center justify-center p-2 -mx-2 focus:outline-none focus:ring-transparent text-[#9ca3af]cursor-pointer hover:bg-gray-200 border-gray-200 border-2 rounded-lg">
                    <span className="sr-only">Navigation öffnen</span>
                    {open ? (
                      <XIcon className="block w-6 h-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>

                {/* Desktop View */}
                <SignedIn>
                  <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-12">
                    {/* CHAT ICON */}
                    <a
                      href="#"
                      className="flex-shrink-0 p-1 ml-5 rounded-full hover:text-gray-500 focus:outline-none focus:ring-transparent text-[#9ca3af]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor-pointer w-9 h-9"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </a>

                    {/* USER DROPDOWN */}
                    <Menu
                      as="div"
                      className="relative flex-shrink-0 ml-5 select-none"
                    >
                      <div>
                        <Menu.Button className="flex bg-white rounded-full focus:outline-none hover:ring-2 hover:ring-offset-0 hover:ring-gray-400">
                          <span className="sr-only">Nutzermenü öffnen</span>
                          <img
                            className="w-10 h-10 rounded-full"
                            src={`https://source.boringavatars.com/beam/300/${userId}${userId}${userId}?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f`}
                            alt="Benutzeridentifizierender Avatar"
                          />
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
                        <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            <p className="block px-4 py-2 text-sm font-bold text-gray-700 select-none">
                              Hallo, {user?.firstName}
                            </p>
                          </Menu.Item>
                          <Menu.Item>
                            <Link href="/favoriten">
                              <p className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100">
                                Deine Favoriten
                              </p>
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <Link href="/angebote">
                              <p className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100">
                                Deine Angebote
                              </p>
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <Link href="/profil">
                              <p className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100">
                                Dein Profil
                              </p>
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <Link href="/">
                              <p
                                onClick={() => signOut()}
                                className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                              >
                                Ausloggen
                              </p>
                            </Link>
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    {/* Inserieren Button */}
                    <div className="hidden select-none lg:flex lg:items-center lg:justify-end xl:col-span-12">
                      <Link href="/inserieren">
                        <button className="inline-flex items-center px-4 py-2 ml-6 text-sm font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 pr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 4v16m8-8H4"
                            />{" "}
                          </svg>
                          Inserieren
                        </button>
                      </Link>
                    </div>
                  </div>
                </SignedIn>

                <SignedOut>
                  {isUserRedirectToSignInActive ? <RedirectToSignIn /> : ""}
                  <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-12">
                    <button
                      onClick={() =>
                        setIsUserRedirectToSignInActivePayNowSelected(true)
                      }
                      className="inline-flex items-center px-4 py-2 ml-6 text-sm font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent"
                    >
                      Jetzt Loslegen!
                    </button>
                  </div>
                </SignedOut>
              </div>
            </div>
            {console.log("USER", user)}

            {/* Mobile View */}
            <Popover.Panel as="nav" className="lg:hidden" aria-label="Global">
              <div className="max-w-3xl px-2 pt-2 pb-3 mx-auto space-y-1 sm:px-4">
                <Link href="/favoriten">
                  <p className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50">
                    Deine Favoriten
                  </p>
                </Link>
                <Link href="/angebote">
                  <p className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50">
                    Deine Angebote
                  </p>
                </Link>
                <Link href="/profil">
                  <p className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50">
                    Dein Profil
                  </p>
                </Link>
                <Link href="/">
                  <p
                    onClick={() => signOut()}
                    className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50"
                  >
                    Ausloggen
                  </p>
                </Link>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center max-w-3xl px-4 mx-auto sm:px-6">
                  <div className="flex-shrink-0">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={`https://source.boringavatars.com/beam/300/${userId}${userId}${userId}?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f`}
                      alt="Nutzeridentifizierender Avatar"
                    />
                  </div>
                  <div className="ml-3">
                    {/* TODO: GRAB DATA FROM USER TO DISPLAY INFO */}
                    <div className="text-base font-medium text-gray-800">
                      Hallo, {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.primaryPhoneNumber?.phoneNumber}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.emailAddresses[0]?.emailAddress}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex-shrink-0 p-1 ml-auto bg-white rounded-full hover:text-gray-500 focus:outline-none focus:ring-transparent text-[#9ca3af]"
                  >
                    {/* CHAT ICON */}
                    <Link href="/chat">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="cursor-pointer w-9 h-9"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </Link>
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
      {/* <div className="flex flex-col col-span-3 mx-auto">
          <div className="h-10 w-96 bg-gray-50">Test</div>
        </div> */}
      {/* Searchbox Detail Component */}
      {/* <div className="sticky top-0 z-20 grid grid-cols-1 p-6 bg-white shadow-sm md:px-10 md:py-8 lg:pl-20">
         
        </div> */}
      <div className="flex items-center"></div>
      {searchInput && (
        <div className="flex items-center justify-center h-full bg-gray-200 rounded-bl-lg rounded-br-lg select-none md:shadow-sm xs:ml-2">
          <div className="flex-col my-4">
            <div className="flex">
              <input
                className="flex-grow pl-6 text-sm text-gray-700 placeholder-gray-400 bg-transparent bg-gray-100 border-transparent rounded-full outline-none xs:pl-4 focus:outline-none focus:border-transparent focus:ring-0"
                type="text"
                value={locationOrZipInput}
                onChange={(event) => setLocationOrZipInput(event.target.value)}
                placeholder="Ort oder PLZ"
              />
              <div>GEOLOCATION ICON</div>
            </div>

            <div>Test</div>
            <div>Test</div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
