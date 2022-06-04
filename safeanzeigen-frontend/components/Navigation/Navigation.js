import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
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
import { Menu, Popover, Transition, Listbox } from "@headlessui/react";
import { SearchIcon, SelectorIcon } from "@heroicons/react/solid";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import CookieBanner from "../GeneralComponents/Cookies/CookieBanner";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const kebabCase = (string) =>
  string?.length < 2
    ? string
    : string
        ?.match(
          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .join("-")
        .toLowerCase();

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

function umlautConverter(word) {
  word = word.toLowerCase();
  word = word.replace(/ä/g, "ae");
  word = word.replace(/ö/g, "oe");
  word = word.replace(/ü/g, "ue");
  word = word.replace(/ß/g, "ss");
  word = word.replace(/ /g, "-");
  word = word.replace(/\./g, "");
  word = word.replace(/,/g, "");
  word = word.replace(/\(/g, "");
  word = word.replace(/\)/g, "");
  return word;
}

export default function Navigation() {
  const router = useRouter();
  const { pathname } = useRouter();
  const ISSERVER = typeof window === "undefined";

  const { user } = useUser();
  const { userId } = useAuth();
  const clerkAuth = useAuth();
  const { signOut } = useClerk();
  const [isUserRedirectToSignInActive, setIsUserRedirectToSignInActive] =
    useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [locationOrZipInput, setLocationOrZipInput] = useState("");
  const [locationRadiusInput, setLocationRadiusInput] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState();

  const [showSearchBar, setShowSearchBar] = useState(false);

  const resetSearchInputs = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setLocationRadiusInput(0);
    setLocationOrZipInput("");
    setSearchInput("");
    if (!ISSERVER && localStorage.getItem("suche") !== null) {
      /*  console.log("DELETED LOCALSTORAGE"); */
      localStorage.removeItem("suche");
    }
  };

  const checkUserHasProvidedMinimumProfileData = (userData) =>
    userData?.firstName &&
    userData?.lastName &&
    userData?.phoneNumbers[0]?.phoneNumber &&
    userData?.phoneNumbers[0]?.verification?.status === "verified" &&
    userData?.emailAddresses[0]?.emailAddress;

  const success = (position) => {
    /* console.log("POSITION", position); */
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const geoAPIURL = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    fetch(geoAPIURL)
      .then((res) => res.json())
      .then((data) => {
        /* console.log("GEO DATA", data); */
        const locality = data?.locality;
        const postcode = data?.postcode;
        setLocationOrZipInput(data?.locality);
      });
  };

  const retrieveSubCategoriesBelongingToCategory = async (category_name) => {
    if (category_name) {
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
              data?.subcategories?.map((element) => ({
                subcategory_id: element?.subcategory_id,
                name: element?.name,
              }))
            );
          }
        })
        .catch((error) => {
          console.log("ERROR GET SUBCATEGORIES", error);
        });
    }
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
            data?.categories?.map((element) => ({
              category_id: element?.category_id,
              name: element?.name,
            }))
          );
        }
      })
      .catch((error) => {
        console.log("ERROR GET CATEGORIES", error);
      });
  };

  const error = (position) => {
    /* console.log(position); */
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
    if (user && user?.id) {
      if (
        !checkUserHasProvidedMinimumProfileData(user) &&
        pathname !== "/onboarding" &&
        pathname !== "/profil"
      ) {
        router.push("/onboarding");
      }
    }
    retrieveCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      retrieveSubCategoriesBelongingToCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (
      !pathname.includes("/suche") &&
      !ISSERVER &&
      localStorage.getItem("suche") !== null
    ) {
      localStorage.removeItem("suche");
    }
  });

  return (
    <header
      className={`sticky top-0 z-20 grid grid-rows-2 bg-white ${
        searchInput || showSearchBar ? "shadow-sm" : "shadow-none"
      } md:p-6 md:grid-rows-none md:grid-cols-1 lg:grid-cols-3 md:px-10 md:py-0 lg:pl-20 md:mt-8`}
    >
      {/* Left Navbar */}
      <div className="relative items-center hidden h-16 my-auto select-none md:flex md:h-12 md:mb-4">
        <Link href="/">
          <a className="flex items-center ">
            <Image
              src="/safeanzeigen-logo-text.png"
              alt="Safeanzeigen Logo Image"
              layout="fill"
              objectFit="contain"
              objectPosition="left"
              className="relative transform cursor-pointer left-1/2 md:translate-x-[18rem] z-50 translate-x-[5rem] lg:translate-x-[5rem]"
            />
          </a>
        </Link>
      </div>
      {/* Middle Navbar */}
      <div
        className={`mt-4 md:mt-0 flex justify-between items-center border-2 select-none md:shadow-sm xs:ml-2 ${
          searchInput ? "rounded-tl-lg rounded-tr-lg" : "rounded-lg"
        }`}
      >
        {searchInput && (
          <div onClick={() => setSearchInput("")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 ml-4 cursor-pointer hover:text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
        <input
          onClick={() => {
            if (pathname.includes("/suche/")) {
              router.push("/");
            }
          }}
          className="w-full text-lg text-gray-700 placeholder-gray-400 bg-transparent border-transparent outline-none mt-4flex-grow pl- xs:pl-4 focus:outline-none focus:border-transparent focus:ring-0"
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
                  radius: locationOrZipInput ? locationRadiusInput : "",
                },
              }}
              as={createSearchPath(
                searchInput,
                selectedCategory,
                selectedSubcategory,
                locationOrZipInput,
                locationOrZipInput ? locationRadiusInput : ""
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
      <div className="order-first lg:order-none">
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
                  <div className="md:hidden">
                    <Link href="/">
                      <a className="flex items-center ">
                        <Image
                          src="/safeanzeigen-logo-text.png"
                          alt="Safeanzeigen Logo Image"
                          layout="fill"
                          objectFit="contain"
                          objectPosition="left"
                          className="relative transform cursor-pointer left-1/2 translate-x-[7rem]"
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                    {/* Mobile Button & Screen Reader Accessibility */}
                    <Popover.Button className="inline-flex items-center justify-center p-2 -mx-2 focus:outline-none focus:ring-transparent text-[#9ca3af] cursor-pointer hover:bg-gray-200 border-gray-200 border-2 rounded-lg z-50">
                      <span className="sr-only">Navigation öffnen</span>
                      {open ? (
                        <XIcon className="block w-6 h-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          onClick={() => resetSearchInputs()}
                          className="block w-6 h-6"
                          aria-hidden="true"
                        />
                      )}
                    </Popover.Button>
                  </div>

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
                              <p
                                onClick={() => signOut()}
                                className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                              >
                                Ausloggen
                              </p>
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
                              />
                            </svg>{" "}
                            Inserieren
                          </button>
                        </Link>
                      </div>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    {isUserRedirectToSignInActive && <RedirectToSignIn />}
                    <div className="relative hidden lg:flex lg:items-center lg:justify-end xl:col-span-12 ">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-orange-500 opacity-75 -top-0.5 -right-0.5"></span>
                      <span className="absolute inline-flex rounded-full h-3 w-3 -top-0.5 -right-0.5 bg-orange-500"></span>
                      <button
                        onClick={() => setIsUserRedirectToSignInActive(true)}
                        className="inline-flex items-center px-4 py-2 ml-6 text-medium font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent"
                      >
                        Jetzt Loslegen!
                      </button>
                    </div>
                  </SignedOut>
                </div>
              </div>

              {/* Mobile View */}
              <SignedOut>
                <Popover.Panel
                  as="nav"
                  className="z-50 lg:hidden"
                  aria-label="Global"
                >
                  <div className="max-w-3xl px-2 pt-2 pb-3 mx-auto space-y-1 sm:px-4">
                    <Link href="/login">
                      <p className="block px-3 py-2 text-base font-medium rounded-md cursor-pointer bg-[#2f70e9] text-white hover:bg-[#2962cd]">
                        Jetzt Loslegen!
                      </p>
                    </Link>
                  </div>
                </Popover.Panel>
              </SignedOut>
              <SignedIn>
                <Popover.Panel
                  as="nav"
                  className="lg:hidden !z-50"
                  aria-label="Global"
                >
                  <div className="max-w-3xl px-2 pt-2 pb-3 mx-auto space-y-1 sm:px-4 !z-50">
                    <Link href="/inserieren">
                      <p className="flex px-3 py-2 text-base font-medium text-white rounded-md cursor-pointer hover:bg-[#2962cd] bg-[#2f70e9] !z-50">
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
                      </p>
                    </Link>
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
                      <p className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50 !z-50">
                        Dein Profil
                      </p>
                    </Link>
                    <p
                      onClick={() => signOut()}
                      className="block px-3 py-2 text-base font-medium text-gray-900 rounded-md cursor-pointer hover:bg-gray-100 bg-gray-50 !z-50"
                    >
                      Ausloggen
                    </p>
                  </div>
                  <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center max-w-3xl px-4 mx-auto sm:px-6">
                      <div className="flex-shrink-0">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={`https://source.boringavatars.com/beam/300/${userId}${userId}${userId}?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f`}
                          alt="Benutzeridentifizierender Avatar"
                        />
                      </div>
                      <div className="ml-3">
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
              </SignedIn>
            </>
          )}
        </Popover>
      </div>

      <div
        className={`flex items-center ${
          searchInput || showSearchBar ? "bg-gray-200" : "bg-white"
        } md:bg-white`}
      ></div>
      {(searchInput || showSearchBar) && (
        <div className="bg-gray-200 rounded-bl-lg rounded-br-lg select-none md:shadow-sm xs:ml-2">
          <div className="grid md:grid-cols-2 ">
            <div className="grid items-center justify-center grid-flow-col grid-rows-3 gap-4 mt-3 md:mt-1">
              <div className="col-span-3 row-span-3 mb-4">
                <div>
                  <div>
                    <Listbox
                      value={selectedCategory}
                      onChange={(category) => {
                        setSelectedCategory(category);
                        setSelectedSubcategory();
                      }}
                    >
                      <div className="relative mb-2">
                        <Listbox.Label>
                          <div className="pb-1 text-sm font-semibold text-gray-700">
                            Kategorie
                          </div>
                        </Listbox.Label>
                        <Listbox.Button
                          className="w-56 md:w-24 lg:w-24 relative py-2 pl-3 pr-10 text-left rounded-lg shadow-md cursor-default focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm !text-sm font-medium text-gray-600 bg-white xl:w-56"
                          style={{ height: "2.5rem" }}
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
                          <Listbox.Options className="absolute md:w-24 w-56 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm !z-40">
                            {categories
                              ?.sort((a, b) => a?.name.localeCompare(b?.name))
                              ?.map((category, index) => (
                                <Listbox.Option
                                  key={index}
                                  className={({ active }) =>
                                    `relative select-none py-2 cursor-pointer md:pl-3 pl-10 pr-4 font-bold ${
                                      active
                                        ? "bg-[#2f70e9] text-white"
                                        : "text-gray-900"
                                    }`
                                  }
                                  value={category?.name}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate font-bold`}
                                      >
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
                  </div>
                  <div>
                    {" "}
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
                          <Listbox.Options className="absolute w-56 py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm !z-30">
                            {subcategories
                              ?.sort((a, b) => a?.name.localeCompare(b?.name))
                              ?.map((subcategory, index) => (
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
                                      <span
                                        className={`block truncate font-bold`}
                                      >
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
            </div>
            <div className="flex flex-col pt-2 mx-auto mb-4 md:mt-8 flex-center">
              <div className="flex justify-center md:justify-start">
                <input
                  className="ml-5 w-4/6 pl-8 md:pl-6 md:ml-0 font-semibold shadow-md text-sm text-gray-700 placeholder-gray-400 bg-transparent !bg-white border-transparent rounded-md outline-none xs:pl-4 focus:outline-none focus:border-transparent focus:ring-0 md:w-4/6"
                  type="text"
                  value={locationOrZipInput}
                  onChange={(event) =>
                    setLocationOrZipInput(umlautConverter(event.target.value))
                  }
                  placeholder="Stadt"
                />
                <div
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(success, error);
                  }}
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
              </div>
              <div className="flex flex-col grid-cols-2 mx-4 mt-4 md:items-center md:mx-0 md:flex-none md:mt-0 md:grid">
                <div className="px-4 md:px-0 md:mt-6">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={locationRadiusInput}
                    onChange={(event) =>
                      setLocationRadiusInput(event.target.value)
                    }
                    className="bg-orange-400 shadow-md range"
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

                <div className="flex justify-center order-first ml-2 text-sm font-bold text-center text-orange-600 md:ml-4 md:text-left text- md:order-none md:mb-3 md:flex-col">
                  <div>{`+${locationRadiusInput?.toString()} km`}</div>
                  <div className="ml-1">Radius</div>
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
                  radius: locationOrZipInput ? locationRadiusInput : "",
                },
              }}
              as={createSearchPath(
                searchInput,
                selectedCategory,
                selectedSubcategory,
                locationOrZipInput,
                locationOrZipInput ? locationRadiusInput : ""
              )}
            >
              <button
                onClick={() => resetSearchInputs()}
                className="w-7/12 h-10 mx-8 mb-4 font-semibold text-white bg-orange-400 rounded-md md:w-full md:mx-0 lg:mx-20 lg:mr-24"
              >
                Jetzt Entdecken
              </button>
            </Link>
          </div>
        </div>
      )}
      <CookieBanner />
    </header>
  );
}
