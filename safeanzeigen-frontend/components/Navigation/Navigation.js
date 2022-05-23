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
import { SearchIcon, CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { Menu, Popover, Transition, Combobox } from "@headlessui/react";
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

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSubcategory, setSelectedSubcategory] = useState();

  const categories = [
    { id: 1, categoryName: "Elektronik" },
    { id: 2, categoryName: "Schmuck" },
    { id: 3, categoryName: "Garten" },
    { id: 4, categoryName: "Haushalt" },
  ];

  const subcategories = [
    { id: 1, subcategoryName: "Apple" },
    { id: 2, subcategoryName: "Samsung" },
    { id: 3, subcategoryName: "HTC" },
    { id: 4, subcategoryName: "Sony" },
  ];

  const filteredCategories =
    query === ""
      ? categories
      : categories.filter((category) => {
          return category.categoryName
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  const filteredSubcategories =
    query === ""
      ? subcategories
      : subcategories.filter((subcategory) => {
          return subcategory.subcategoryName
            .toLowerCase()
            .includes(query.toLowerCase());
        });

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
          className="flex-grow text-lg text-gray-700 placeholder-gray-400 bg-transparent border-transparent outline-none pl- xs:pl-4 focus:outline-none focus:border-transparent focus:ring-0"
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
        <div className="bg-gray-200 rounded-bl-lg rounded-br-lg select-none md:shadow-sm xs:ml-2">
          <div className="grid grid-cols-2 ">
            <div className="grid items-center justify-center grid-flow-col grid-rows-3 gap-4 mt-3">
              <div className="col-span-3 row-span-3 mb-4">
                <div>
                  {/* <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-0 focus:ring-transparent"
                >
                  Kategorie auswählen
                </button> */}
                  <Combobox
                    as="div"
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                  >
                    <Combobox.Label className="block text-sm font-medium text-gray-700">
                      Kategorie auswählen
                    </Combobox.Label>
                    <div className="relative mt-1">
                      <Combobox.Input
                        className="w-full py-2 pl-3 pr-10 text-gray-600 bg-white border border-white rounded-md shadow-sm focus:outline-none focus:ring-transparent sm:text-sm"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(category) => category?.categoryName}
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                        <SelectorIcon
                          className="w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Combobox.Button>

                      {filteredCategories.length > 0 && (
                        <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredCategories.map((category) => (
                            <Combobox.Option
                              key={category.id}
                              value={category}
                              className={({ active }) =>
                                classNames(
                                  "relative cursor-pointer select-none py-2 pl-8 pr-4",
                                  active
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-900"
                                )
                              }
                            >
                              {({ active, selected }) => (
                                <>
                                  <span
                                    className={classNames(
                                      "block truncate",
                                      selected && "font-semibold"
                                    )}
                                  >
                                    {category.categoryName}
                                  </span>

                                  {selected && (
                                    <span
                                      className={classNames(
                                        "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                        active
                                          ? "text-white"
                                          : "text-indigo-600"
                                      )}
                                    >
                                      <CheckIcon
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      )}
                    </div>
                  </Combobox>
                  <Combobox
                    as="div"
                    value={selectedSubcategory}
                    onChange={setSelectedSubcategory}
                    className={`mt-4  ${!selectedCategory ? "invisible" : ""}`}
                  >
                    <Combobox.Label className="block text-sm font-medium text-gray-700">
                      Subkategorie auswählen
                    </Combobox.Label>
                    <div className="relative mt-1">
                      <Combobox.Input
                        className="w-full py-2 pl-3 pr-10 text-gray-600 bg-white border border-white rounded-md shadow-sm focus:outline-none focus:ring-transparent sm:text-sm"
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(subcategory) =>
                          subcategory?.subcategoryName
                        }
                      />
                      <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2 rounded-r-md focus:outline-none">
                        <SelectorIcon
                          className="w-5 h-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Combobox.Button>

                      {filteredSubcategories.length > 0 && (
                        <Combobox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredSubcategories.map((subcategory) => (
                            <Combobox.Option
                              key={subcategory.id}
                              value={subcategory}
                              className={({ active }) =>
                                classNames(
                                  "relative select-none py-2 pl-8 pr-4 cursor-pointer",
                                  active
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-900"
                                )
                              }
                            >
                              {({ active, selected }) => (
                                <>
                                  <span
                                    className={classNames(
                                      "block truncate",
                                      selected && "font-semibold"
                                    )}
                                  >
                                    {subcategory.subcategoryName}
                                  </span>

                                  {selected && (
                                    <span
                                      className={classNames(
                                        "absolute inset-y-0 left-0 flex items-center pl-1.5",
                                        active
                                          ? "text-white"
                                          : "text-indigo-600"
                                      )}
                                    >
                                      <CheckIcon
                                        className="w-5 h-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  )}
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </Combobox.Options>
                      )}
                    </div>
                  </Combobox>
                </div>
              </div>
            </div>
            <div className="flex-col pt-2 mt-8 mb-4">
              <div className="flex">
                <input
                  className="flex-grow pl-6 text-sm text-gray-700 placeholder-gray-400 bg-transparent !bg-white border-transparent rounded-md outline-none xs:pl-4 focus:outline-none focus:border-transparent focus:ring-0"
                  type="text"
                  value={locationOrZipInput}
                  onChange={(event) =>
                    setLocationOrZipInput(event.target.value)
                  }
                  placeholder="Ort oder PLZ"
                />
                <div
                  className="mr-2 text-gray-500 cursor-pointer hover:text-orange-500"
                  title="Meinen Standort nutzen"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 my-1 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div
                  className="mt-1 mr-4 cursor-pointer hover:text-orange-500"
                  title="Ort auf der Karte markieren"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="grid items-center grid-cols-2">
                <div className="mt-6">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={locationRadiusInput}
                    onChange={(event) =>
                      setLocationRadiusInput(event.target.value)
                    }
                    className="bg-orange-400 range"
                  />
                  <div className="flex justify-between w-full px-2 text-xs">
                    <div className="flex flex-col">
                      <span>|</span>
                    </div>
                    <div className="flex flex-col">
                      <span>|</span>
                    </div>{" "}
                    <div className="flex flex-col items-center">
                      <span>|</span>
                    </div>{" "}
                    <div className="flex flex-col items-end">
                      <span>|</span>
                    </div>{" "}
                    <div className="flex flex-col items-end">
                      <span>|</span>
                    </div>
                  </div>
                  <div className="flex justify-between w-full px-2 text-xs">
                    <div className="flex flex-col">
                      <span className="text-orange-600">0km</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-orange-600">50km</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-orange-600">100km</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-orange-600">150km</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-orange-600">200km</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3 ml-2 text-sm font-bold text-orange-600">
                  +{locationRadiusInput} km Radius
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center pl-1">
            <button className="w-full h-8 mx-20 mb-4 mr-24 font-semibold text-white bg-orange-400 rounded-md">
              Jetzt Entdecken
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
