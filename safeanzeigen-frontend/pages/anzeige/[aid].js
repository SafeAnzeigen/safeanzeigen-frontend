import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/clerk-react";
import { HomeIcon } from "@heroicons/react/solid";

import Head from "next/head";
import Footer from "../../components/Footer/Footer";
import Navigation from "../../components/Navigation/Navigation";

let sliderCounter = 0;

export default function Anzeige({
  adName,
  categoryName,
  subcategoryName,
  dateOfCreation,
  viewCount,
  location,
  price,
  priceType,
  imageURLArray,
  description,
  nameOfOwner,
  adID,
}) {
  const { asPath } = useRouter();
  const { user } = useUser();
  const router = useRouter();
  const { aid } = router.query;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef();
  const adImages = [
    "https://images.unsplash.com/photo-1604579278540-db35e2fa658a?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2308",
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287",
    "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1328",
  ];

  const retrieveSpecificAdvertisement = async (user, adid) => {
    setIsfetchingData(true);
    console.log("id xxxx", adid);
    /* fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
        `/advertisements/clerkuserid/${user?.id}`,
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
        setIsfetchingData(false);
        console.log("DATA GET OFFERS", data);
        if (data?.advertisements) {
          setOfferedAdvertisements([...data?.advertisements]);
        }
      })
      .catch((error) => {
        setIsfetchingData(false);
        console.log("ERROR DATA GET OFFERS", error);
      }); */
  };

  const handleOnPreviousImageClick = () => {
    sliderCounter = (sliderCounter + 1) % adImages.length;
    setCarouselIndex(sliderCounter);
    carouselRef.current.classList.add("carousel-flash-animation");
  };

  const handleOnNextImageClick = () => {
    const adImagesLength = adImages.length;
    sliderCounter = (carouselIndex + adImagesLength - 1) % adImagesLength;
    setCarouselIndex(sliderCounter);
    carouselRef.current.classList.add("carousel-flash-animation");
  };

  const removeAnimation = () => {
    carouselRef.current.classList.remove("carousel-flash-animation");
  };

  useEffect(() => {
    window.onscroll = function () {};
    carouselRef.current.addEventListener("animationend", removeAnimation);
    retrieveSpecificAdvertisement(user, aid);
  }, []);

  const copyToClipboard = async (textToCopy) => {
    await navigator.clipboard.writeText(textToCopy);
    alert("Der Link wurde zum Teilen für dich kopiert.");
  };

  categoryName = "Test";
  subcategoryName = "Test2";
  const testText =
    "Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.";

  return (
    <div className="h-full bg-gray-50">
      <Head>
        <title>
          Safeanzeigen - Wir bringen Ihre Kleinanzeigen mit Sicherheit groß
          raus!
        </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="theme-color" content="#2f70e9" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
      </Head>
      {/* Navigation */}
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-screen">
            <div className="flex mb-4" aria-label="Breadcrumb">
              <ol
                role="list"
                className="flex px-6 space-x-4 bg-white rounded-md shadow"
              >
                <li className="flex">
                  <div className="flex items-center">
                    <Link href="/">
                      <HomeIcon
                        className="flex-shrink-0 w-5 h-5 text-gray-400 cursor-pointer hover:text-orange-500"
                        aria-hidden="true"
                      />
                    </Link>
                    <span className="sr-only">Home</span>
                  </div>
                </li>
                {categoryName && (
                  <li className="flex">
                    <div className="flex items-center">
                      <svg
                        className="flex-shrink-0 w-6 h-full text-gray-200"
                        viewBox="0 0 24 44"
                        preserveAspectRatio="none"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                      </svg>
                      <a
                        href={`/suche/${categoryName}`}
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-orange-500"
                      >
                        {categoryName}
                      </a>
                    </div>
                  </li>
                )}
                {subcategoryName && (
                  <li className="flex">
                    <div className="flex items-center">
                      <svg
                        className="flex-shrink-0 w-6 h-full text-gray-200"
                        viewBox="0 0 24 44"
                        preserveAspectRatio="none"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                      </svg>
                      <a
                        href={`/suche/${subcategoryName}`}
                        className="ml-4 text-sm font-medium text-gray-500 hover:text-orange-500"
                      >
                        {subcategoryName}
                      </a>
                    </div>
                  </li>
                )}
              </ol>
            </div>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
              <div>
                <div ref={carouselRef} className="relative select-none">
                  {/* <div className="aspect-w-16 aspect-h-9"> */}
                  <img
                    src={adImages[carouselIndex]}
                    alt=""
                    layout="fill"
                    style={{
                      objectFit: "cover",
                      height: "800px",
                      width: "800px",
                    }}
                    className="rounded-xl"
                  />

                  {/*  </div> */}

                  <div className="absolute flex items-center justify-between w-full px-3 transform -translate-y-1/2 top-1/2">
                    <button onClick={() => handleOnPreviousImageClick()}>
                      <div className="p-2 bg-orange-400 rounded-full hover:bg-orange-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </div>
                    </button>
                    <button onClick={() => handleOnNextImageClick()}>
                      <div className="p-2 bg-orange-400 rounded-full hover:bg-orange-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="flex p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span className="mx-2 text-gray-900">{"viewCount"}</span>
                  </div>
                  <div className="flex p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="mx-2 text-gray-900">{"heartCount"}</span>
                  </div>
                </div>
                <div>
                  <h2 className="mt-2 text-3xl font-bold text-center text-orange-500 break-words sm:text-4xl">
                    KLEINANZEIGEN NAME XY
                  </h2>
                  <div className="px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center">
                    <div className="flex items-center justify-center mt-2 text-5xl font-extrabold text-gray-900">
                      <span className="mt-1 mr-3 text-xl font-medium text-gray-500">
                        {"FIX"}
                      </span>
                      <span className="text-3xl">{"45,00"}</span>
                      <span className="mt-1 ml-3 text-xl font-medium text-gray-500">
                        EURO
                      </span>
                    </div>
                    <div className="mt-6">
                      <div className="rounded-md shadow">
                        <a
                          href="#"
                          className="flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md hover:bg-[#2962cd]"
                        >
                          Kontakt aufnehmen
                        </a>
                      </div>
                      <div className="mt-4 rounded-md shadow">
                        <a
                          href="#"
                          className="flex items-center justify-center px-5 py-3 text-base font-medium text-gray-700 bg-white border-gray-300 rounded-md hover:bg-gray-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                          Favorisieren / Entfavorisieren
                        </a>
                      </div>

                      <div className="mt-4 rounded-md shadow ">
                        <span
                          onClick={() => {
                            typeof window !== "undefined"
                              ? copyToClipboard(window.location)
                              : "";
                          }}
                          className="flex items-center justify-center px-5 py-3 text-base font-medium text-gray-700 bg-white border-gray-300 rounded-md cursor-pointer hover:bg-gray-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                          </svg>
                          Teilen
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden bg-white sm:rounded-lg lg:ml-10">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-orange-500">
                    Anbieter
                  </h3>
                  <p className="max-w-2xl mt-1 text-sm text-gray-500">
                    Informationen zum Anbieter
                  </p>
                </div>
                <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {"Vorname"} {"Nachname"}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Mitglied seit
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {"Registrationsdatum"}
                      </dd>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-orange-500">
                        Anzeige
                      </h3>
                      <p className="max-w-2xl mt-1 text-sm text-gray-500">
                        Informationen zur Anzeige
                      </p>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Veröffentlicht
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {"Veröffentlichungsdatum"}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Telefonnummer
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {"0123456789"}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Adresse
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {"Landstraße 1, 12345 Berlin"}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Anzeigen-ID
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {"AdId"}
                      </dd>
                    </div>
                    <div className="h-full px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-orange-500">
                        Beschreibung
                      </h3>
                      <div className="grow-wrap">
                        <textarea
                          readOnly
                          autoResizeEnabled={true}
                          spellCheck="false"
                          rows={testText.split("\n").length}
                          name="comment"
                          id="comment"
                          className="block w-full mt-1 font-semibold text-gray-700 rounded-md cursor-default resize-none sm:text-sm focus:border-gray-700 focus:ring-0 h-96"
                          value={testText}
                        />
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
