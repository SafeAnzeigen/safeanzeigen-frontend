import { Fragment, useState, useEffect } from "react";
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
import {
  SearchIcon,
  CheckIcon,
  SelectorIcon,
  ExclamationIcon,
} from "@heroicons/react/solid";
import {
  Menu,
  Popover,
  Transition,
  Combobox,
  Listbox,
} from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const kebabCase = (str) => {
  if (str.length < 2) {
    return str;
  } else {
    return str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .join("-")
      .toLowerCase();
  }
};

const createSearchPath = (
  searchInput,
  categoryInput,
  subcategoryInput,
  locationOrZipInput,
  locationRadiusInput
) => {
  let searchPath = "/suche/";
  if (searchInput) {
    searchPath = searchPath + kebabCase(searchInput);
  }

  if (categoryInput) {
    searchPath = searchPath + "-" + categoryInput;
  }

  if (subcategoryInput) {
    searchPath = searchPath + "-" + subcategoryInput;
  }

  if (locationOrZipInput) {
    searchPath = searchPath + "-" + kebabCase(locationOrZipInput);
  }

  if (locationRadiusInput) {
    searchPath = searchPath + "-" + locationRadiusInput;
  }
  return searchPath;
};

function Navigation() {
  const { signOut } = useClerk();
  const clerkAuth = useAuth();
  const { userId } = useAuth();
  const { user } = useUser();
  const [
    isUserRedirectToSignInActive,
    setIsUserRedirectToSignInActivePayNowSelected,
  ] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [locationOrZipInput, setLocationOrZipInput] = useState("");
  const [locationRadiusInput, setLocationRadiusInput] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSubcategory, setSelectedSubcategory] = useState();

  const resetSearchInputs = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setLocationRadiusInput(0);
    setLocationOrZipInput("");
    setSearchInput("");
  };

  const success = (position) => {
    console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const geoAPIURL = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    fetch(geoAPIURL)
      .then((res) => res.json())
      .then((data) => {
        console.log("GEO DATA", data);
        const locality = data?.locality;
        const postcode = data?.postcode;
        setLocationOrZipInput(data?.locality);
      });
  };

  const retrieveSubCategoriesBelongingToCategory = async (category_name) => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
        `/subcategories/categoryname/${category_name}`,
      {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${await clerkAuth.getToken()}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA GET SUBCATEGORIES", data);
        if (data?.subcategories) {
          setSubcategories(
            data?.subcategories.map((element) => ({
              subcategory_id: element.subcategory_id,
              name: element.name,
            }))
          );
        }
      })
      .catch((error) => {
        console.log("ERROR GET SUBCATEGORIES", error);
      });
  };

  const retrieveCategories = async () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/categories/`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${await clerkAuth.getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA GET CATEGORIES", data);
        if (data?.categories) {
          setCategories(
            data?.categories.map((element) => ({
              category_id: element.category_id,
              name: element.name,
            }))
          );
        }
      })
      .catch((error) => {
        console.log("ERROR GET CATEGORIES", error);
      });
  };

  const error = (position) => {
    console.log(position);
    alert("Bitte gebe das Recht frei deinen Standort zu nutzen");
  };

  /* if (!isLoaded || !userId || !isSignedIn) {
    return null;
  } */

  /*   if (isSignedIn && user) {
    console.log("CHECKING FOR MINIMUM PROFILE DATA", user);
  } */

  /*   const checkUserIsKnownToCustomBackend = () => {};

  const checkUserHasProvidedMinimumProfileData = (clerkUserObject) => {}; */
  /*  checkUserIsKnownToCustomBackend();
      checkUserHasProvidedMinimumProfileData(user); */
  /*  useEffect(() => {
    if (isSignedIn && user) {
      console.log("CHECKING FOR MINIMUM PROFILE DATA", user);
    }
  }, []); */

  useEffect(() => {
    retrieveCategories();
  }, []);

  useEffect(() => {
    retrieveSubCategoriesBelongingToCategory(selectedCategory);
  }, [selectedCategory]);

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
          placeholder="Wonach suchst du?"
        />

        {searchInput ? (
          <div onClick={() => resetSearchInputs()}>
            <Link
              href={{
                pathname: "/suche/[sid]",
                query: {
                  sid: searchInput,
                  search: searchInput,
                  category: selectedCategory,
                  subcategory: selectedSubcategory,
                  locality: locationOrZipInput,
                  radius: locationRadiusInput,
                },
              }}
              as={createSearchPath(
                searchInput,
                selectedCategory,
                selectedSubcategory,
                locationOrZipInput,
                locationRadiusInput
              )}
            >
              <SearchIcon className="hidden h-8 p-2 text-white bg-orange-400 rounded-full cursor-pointer hover:bg-orange-500 md:inline-flex md:mx-3" />
            </Link>
          </div>
        ) : (
          <SearchIcon className="hidden h-8 p-2 text-white bg-orange-400 rounded-full cursor-pointer hover:bg-orange-500 md:inline-flex md:mx-3" />
        )}
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
                {/*  {console.log("USER OBJECT", user)} */}
                {/* Desktop View */}
                <SignedIn>
                  <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-12">
                    {/* CHAT ICON */}
                    <Link href="/chat">
                      <div
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
                      </div>
                    </Link>

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
                  <div className="relative hidden lg:flex lg:items-center lg:justify-end xl:col-span-12 ">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-orange-500 opacity-75 -top-0.5 -right-0.5"></span>
                    <span className="absolute inline-flex rounded-full h-3 w-3 -top-0.5 -right-0.5 bg-orange-500"></span>
                    <button
                      onClick={() =>
                        setIsUserRedirectToSignInActivePayNowSelected(true)
                      }
                      className="inline-flex items-center px-4 py-2 ml-6 text-medium font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent"
                    >
                      Jetzt Loslegen!
                    </button>
                  </div>
                </SignedOut>
              </div>
            </div>

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
                <p
                  onClick={() =>
                    setIsUserRedirectToSignInActivePayNowSelected(true)
                  }
                  className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50"
                >
                  Registieren
                </p>
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
                  <Listbox
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                  >
                    <div className="relative mb-2">
                      <Listbox.Label>
                        <div className="pb-1 text-sm font-semibold text-gray-700">
                          Kategorie
                        </div>
                      </Listbox.Label>
                      <Listbox.Button
                        className="relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm !text-sm font-medium text-gray-600 bg-white"
                        style={{ height: "2.5rem", width: "14rem" }}
                      >
                        <span className="block truncate">
                          {selectedCategory}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <SelectorIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm !z-50">
                          {categories.map((category, index) => (
                            <Listbox.Option
                              key={index}
                              className={({ active }) =>
                                `relative select-none py-2 cursor-pointer pl-10 pr-4 font-bold ${
                                  active
                                    ? "bg-[#2f70e9] text-white"
                                    : "text-gray-900"
                                }`
                              }
                              value={category?.name}
                            >
                              {({ selected }) => (
                                <>
                                  <span cclassName={`block truncate font-bold`}>
                                    {category?.name}
                                  </span>
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                  <Listbox
                    value={selectedSubcategory}
                    onChange={setSelectedSubcategory}
                    className={`${!selectedCategory ? "invisible" : ""}`}
                  >
                    <div className="relative mt-1">
                      <Listbox.Label>
                        <div className="pb-1 text-sm font-semibold text-gray-700">
                          Subkategorie
                        </div>
                      </Listbox.Label>
                      <Listbox.Button
                        className="relative w-full py-2 pl-3 pr-10 text-left rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm !text-sm font-medium text-gray-600 bg-white"
                        style={{ height: "2.5rem" }}
                      >
                        <span className="block truncate">
                          {selectedSubcategory}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <SelectorIcon
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute w-56 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm !z-50">
                          {subcategories.map((subcategory, index) => (
                            <Listbox.Option
                              key={index}
                              className={({ active }) =>
                                `relative select-none py-2 cursor-pointer pl-10 pr-4 font-bold ${
                                  active
                                    ? "bg-[#2f70e9] text-white"
                                    : "text-gray-900"
                                }`
                              }
                              value={subcategory?.name}
                            >
                              {({ selected }) => (
                                <>
                                  <span cclassName={`block truncate font-bold`}>
                                    {subcategory?.name}
                                  </span>
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
              </div>
            </div>
            <div className="flex-col pt-2 mt-8 mb-4">
              <div className="flex">
                <input
                  className="pl-6 text-sm text-gray-700 placeholder-gray-400 bg-transparent !bg-white border-transparent rounded-md outline-none xs:pl-4 focus:outline-none focus:border-transparent focus:ring-0 w-4/6"
                  type="text"
                  value={locationOrZipInput}
                  onChange={(event) =>
                    setLocationOrZipInput(event.target.value)
                  }
                  placeholder="Stadt"
                />
                <div
                  onClick={() =>
                    navigator.geolocation.getCurrentPosition(success, error)
                  }
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
                {/*   <div
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
                </div> */}
              </div>
              <div className="grid items-center grid-cols-2">
                <div className="mt-6">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
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
            <Link
              href={{
                pathname: "/suche/[sid]",
                query: {
                  sid: searchInput,
                  search: searchInput,
                  category: selectedCategory,
                  subcategory: selectedSubcategory,
                  locality: locationOrZipInput,
                  radius: locationRadiusInput,
                },
              }}
              as={createSearchPath(
                searchInput,
                selectedCategory,
                selectedSubcategory,
                locationOrZipInput,
                locationRadiusInput
              )}
            >
              <button
                onClick={() => resetSearchInputs()}
                className="w-full h-10 mx-20 mb-4 mr-24 font-semibold text-white bg-orange-400 rounded-md"
              >
                Jetzt Entdecken
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navigation;
