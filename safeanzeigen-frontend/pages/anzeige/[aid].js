import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/clerk-react";
import { format, parseISO, getUnixTime } from "date-fns";
import { HomeIcon } from "@heroicons/react/solid";

import Navigation from "../../components/Navigation/Navigation";
import Footer from "../../components/Footer/Footer";

let sliderCounter = 0;

export default function Anzeige() {
  const router = useRouter();
  const { aid } = router.query;
  const { user } = useUser();
  const clerkAuth = useAuth();
  const carouselRef = useRef();

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [adImages, setAdImages] = useState([]);
  const [advertisementInfoObject, setAdvertisementInfoObject] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [isAlreadyInConversation, setIsAlreadyInConversation] = useState(false);

  const checkIfAdvertisementIsLiked = async (userData, aid) => {
    if (userData?.id && aid) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/favorites/clerkuserid/${userData?.id}`,
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
          console.log("DATA IS ADVERTISEMENT LIKED", data);
          if (data?.favorites) {
            setIsLiked(
              data?.favorites?.filter(
                (element) => element?.fk_advertisement_id === aid
              )?.length > 0
            );
          }
        })
        .catch((error) => {
          console.log("ERROR DATA IS ADVERTISEMENT LIKED", error);
        });
    }
  };

  const checkIfAdvertisementIsInConversation = async (userData, aid) => {
    if (userData?.id && aid) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/chats/${userData?.id}`,
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
          console.log("DATA IS ALREADY IN CHAT", data);
          if (data?.chats?.filter((chat) => chat?.ad_id === aid).length) {
            console.log("TRIGGERED SET ALREADY IN CONVO");
            setIsAlreadyInConversation(true);
          }
        })
        .catch((error) => {
          console.log("ERROR DATA IS ALREADY IN CHAT", error);
        });
    }
  };

  const retrieveSpecificAdvertisement = (aid) => {
    if (aid) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/advertisements/public/${aid}`,
        {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA GET SPECIFIC ADVERTISEMENT", data);
          if (data?.advertisement) {
            if (!data?.advertisement?.is_active) {
              router.push("/");
            }
            setAdvertisementInfoObject(data?.advertisement);
            let tempAdImagesArray = [];
            if (data?.advertisement?.article_image_1) {
              tempAdImagesArray.push(data?.advertisement?.article_image_1);
            }
            if (data?.advertisement?.article_image_2) {
              tempAdImagesArray.push(data?.advertisement?.article_image_2);
            }
            if (data?.advertisement?.article_image_3) {
              tempAdImagesArray.push(data?.advertisement?.article_image_3);
            }
            if (data?.advertisement?.article_image_4) {
              tempAdImagesArray.push(data?.advertisement?.article_image_4);
            }
            if (data?.advertisement?.article_image_5) {
              tempAdImagesArray.push(data?.advertisement?.article_image_5);
            }
            setAdImages(tempAdImagesArray);
          }
        })
        .catch((error) => {
          console.log("ERROR DATA GET SPECIFIC ADVERTISEMENT", error);
        });
    }
  };

  const createConversationRoom = async (adObject, userData) => {
    if (Object.keys(adObject)?.length) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/chats`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${await clerkAuth.getToken()}`,
        },
        body: JSON.stringify({
          ad_conversation_room_id:
            adObject?.advertisement_id +
            "+" +
            (Math.random() + 1).toString(36).substring(7),
          ad_id: adObject?.advertisement_id,
          ad_title: adObject?.title,
          ad_price: adObject?.price,
          ad_price_type: adObject?.price_type,
          room_creator_clerk_user_id: userData?.id,
          created_at_timestamp: getUnixTime(new Date()),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA ADD CHAT", data);
          if (data?.chat_id) {
            router.push("/chat");
          }
        })
        .catch((error) => {
          console.log("ERROR ADD CHAT", error);
        });
    }
  };

  const removeLikeOfAdForUser = async (aid) => {
    if (aid) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/favorites/${aid}`, {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${await clerkAuth.getToken()}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA DELETE FAVORITE", data);
          if (data?.newFavoriteArray) {
            checkIfAdvertisementIsLiked(user, aid);
          }
        })
        .catch((error) => {
          console.log("ERROR DELETE FAVORITE", error);
        });
    }
  };

  const addFavoriteForUser = async (aid, userData) => {
    if (aid && userData?.id) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/favorites/`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${await clerkAuth.getToken()}`,
        },
        body: JSON.stringify({
          clerk_user_id: userData?.id,
          fk_advertisement_id: aid,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA ADD FAVORITE", data);
          if (data?.newFavoriteArray) {
            if (data?.newFavoriteArray?.length > 0) {
              checkIfAdvertisementIsLiked(user, aid);
            }
          }
        })
        .catch((error) => {
          console.log("ERROR ADD FAVORITE", error);
        });
    }
  };

  const increaseViewCount = (aid) => {
    if (aid) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/advertisements/increaseviewcount/${aid}`,
        {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA INCREASE VIEWCOUNT", data);
        })
        .catch((error) => {
          console.log("ERROR DATA INCREASE VIEWCOUNT", error);
        });
    }
  };

  const handleOnPreviousImageClick = () => {
    sliderCounter = (sliderCounter + 1) % adImages?.length;
    setCarouselIndex(sliderCounter);
    carouselRef.current.classList.add("carousel-flash-animation");
  };

  const handleOnNextImageClick = () => {
    const adImagesLength = adImages?.length;
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
  }, []);

  useEffect(() => {
    if (Object.keys(advertisementInfoObject)?.length === 0 && aid) {
      retrieveSpecificAdvertisement(aid);
      increaseViewCount(aid);
    }
  }, [aid]);

  useEffect(() => {
    if (user?.id && aid) {
      checkIfAdvertisementIsLiked(user, aid);
      checkIfAdvertisementIsInConversation(user, aid);
    }
  }, [user]);

  const copyToClipboard = async (textToCopy) => {
    await navigator.clipboard.writeText(textToCopy);
    alert("Der Link wurde zum Teilen für dich kopiert.");
  };

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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

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
                  </div>
                </li>
                {advertisementInfoObject?.category_name && (
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
                      <Link
                        href={{
                          pathname: "/suche/[sid]",
                          query: {
                            sid: advertisementInfoObject?.category_name,
                            category: advertisementInfoObject?.category_name,
                          },
                        }}
                        as={"/suche/" + advertisementInfoObject?.category_name}
                      >
                        <div className="ml-4 text-sm font-medium text-gray-500 cursor-pointer hover:text-orange-500">
                          {advertisementInfoObject?.category_name}
                        </div>
                      </Link>
                    </div>
                  </li>
                )}
                {advertisementInfoObject?.subcategory_name && (
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
                      <Link
                        href={{
                          pathname: "/suche/[sid]",
                          query: {
                            sid: advertisementInfoObject?.subcategory_name,
                            category: advertisementInfoObject?.category_name,
                            subcategory:
                              advertisementInfoObject?.subcategory_name,
                          },
                        }}
                        as={
                          "/suche/" +
                          `${advertisementInfoObject?.category_name}-${advertisementInfoObject?.subcategory_name}`
                        }
                      >
                        <div className="ml-4 text-sm font-medium text-gray-500 cursor-pointer hover:text-orange-500">
                          {advertisementInfoObject?.subcategory_name}
                        </div>
                      </Link>
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
                    alt="Bild der Kleinanzeige"
                    layout="fill"
                    style={{
                      objectFit: "cover",
                      height: "800px",
                      width: "800px",
                    }}
                    className="border-2 border-gray-200/75 rounded-xl"
                  />

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
                <div className="flex justify-end mt-4">
                  {!advertisementInfoObject?.is_published && (
                    <div
                      title="Ansichten"
                      className="flex px-4 py-2 mr-2 bg-orange-500 rounded-lg"
                    >
                      <svg
                        id="Capa_1"
                        className="w-5 h-5 text-black-500"
                        enableBackground="new 0 0 512 512"
                        height="512"
                        fill="white"
                        viewBox="0 0 512 512"
                        width="512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path d="m203.556 345.012 70.71-212.133c2.619-7.859-1.628-16.354-9.487-18.974-7.858-2.619-16.354 1.628-18.974 9.487l-70.71 212.133c-2.619 7.859 1.628 16.354 9.487 18.974 1.573.524 3.173.773 4.745.773 6.28.001 12.133-3.974 14.229-10.26z" />
                          <path d="m309.533 279.203c24.813 0 45-20.187 45-45s-20.187-45-45-45-45 20.187-45 45 20.187 45 45 45zm0-60c8.271 0 15 6.729 15 15s-6.729 15-15 15-15-6.729-15-15 6.729-15 15-15z" />
                          <path d="m139.827 189.203c-24.813 0-45 20.187-45 45s20.187 45 45 45 45-20.187 45-45-20.186-45-45-45zm0 60c-8.271 0-15-6.729-15-15s6.729-15 15-15 15 6.729 15 15-6.728 15-15 15z" />
                          <path d="m509 186-52.307-69.743 2.041-14.283c.667-4.674-.904-9.39-4.243-12.728l-31.82-31.82 31.819-31.82c5.858-5.857 5.858-15.355 0-21.213-5.857-5.857-15.355-5.857-21.213 0l-31.819 31.82-31.82-31.82c-3.338-3.339-8.054-4.905-12.728-4.243l-148.493 21.213c-3.213.459-6.19 1.948-8.485 4.243l-183.848 183.848c-21.445 21.444-21.445 56.338 0 77.782l155.563 155.564c3.182 3.182 6.666 5.881 10.353 8.118v6.082c0 30.327 24.673 55 55 55h220c30.327 0 55-24.673 55-55v-262c0-3.245-1.053-6.404-3-9zm-471.703 80.023c-9.748-9.748-9.748-25.608 0-35.356l180.312-180.312 136.118-19.445 26.517 26.517-21.213 21.213-10.607-10.607c-5.857-5.857-15.355-5.857-21.213 0s-5.858 15.355 0 21.213l42.427 42.427c2.929 2.929 6.768 4.394 10.606 4.394s7.678-1.465 10.606-4.394c5.858-5.857 5.858-15.355 0-21.213l-10.607-10.607 21.213-21.213 26.517 26.517-19.446 136.118-180.311 180.312c-4.722 4.722-11 7.322-17.678 7.322s-12.956-2.601-17.678-7.322zm444.703 190.977c0 13.785-11.215 25-25 25h-220c-13.164 0-23.976-10.228-24.925-23.154 13.567-.376 27.022-5.714 37.353-16.046l183.848-183.848c2.295-2.295 3.784-5.272 4.243-8.485l13.173-92.21 31.308 41.743z" />
                        </g>
                      </svg>
                      <span className="mx-2 font-semibold text-white select-none">
                        Dieser Artikel ist bereits reserviert!
                      </span>
                    </div>
                  )}
                  <div
                    title="Ansichten"
                    className="flex px-4 py-2 mr-2 rounded-lg bg-gray-200/75"
                  >
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
                    <span className="mx-2 font-semibold text-gray-900 select-none">
                      {advertisementInfoObject?.view_count}
                    </span>
                  </div>
                  <div
                    title="Favoriten"
                    className="flex px-4 py-2 rounded-lg bg-gray-200/75"
                  >
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
                    <span className="mx-2 font-semibold text-gray-900 select-none">
                      {advertisementInfoObject?.favorite_count}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="mt-2 text-3xl font-bold text-center text-orange-500 break-words sm:text-4xl">
                    {advertisementInfoObject?.title}
                  </h2>
                  <div className="px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center">
                    <div className="flex items-center justify-center mt-2 text-5xl font-extrabold text-gray-900">
                      <span className="mt-1 mr-3 text-xl font-medium text-gray-500">
                        {advertisementInfoObject?.price_type}
                      </span>
                      <span className="text-3xl">
                        {advertisementInfoObject?.price},00
                      </span>
                      <span className="mt-1 ml-3 text-xl font-medium text-gray-500">
                        EURO
                      </span>
                    </div>
                    <div className="mt-6">
                      {user &&
                      user?.id &&
                      aid &&
                      user?.id === advertisementInfoObject?.clerk_user_id ? (
                        <div>
                          {/* <Link href={`/editieren/${aid}`}>
                          <div className="rounded-md shadow">
                            <div
                              href="#"
                              className="cursor-pointer flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md hover:bg-[#2962cd] select-none"
                            >
                              Anzeige Editieren
                            </div>
                          </div>
                        </Link> */}
                        </div>
                      ) : (
                        !isAlreadyInConversation &&
                        user && (
                          <div className="rounded-md shadow">
                            <div
                              onClick={() =>
                                createConversationRoom(
                                  advertisementInfoObject,
                                  user
                                )
                              }
                              className="w-full flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md hover:bg-[#2962cd] cursor-pointer"
                            >
                              Kontakt aufnehmen
                            </div>
                          </div>
                        )
                      )}
                      {user &&
                      user?.id &&
                      aid &&
                      user?.id === advertisementInfoObject?.clerk_user_id ? (
                        ""
                      ) : (
                        <div className="mt-4 rounded-md shadow">
                          {user && user?.id && aid && isLiked ? (
                            <button
                              onClick={() => removeLikeOfAdForUser(aid)}
                              className="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-white bg-red-500 border-gray-300 rounded-md hover:bg-red-600"
                            >
                              <svg
                                className={`w-4 h-4 mr-2`}
                                height="329pt"
                                viewBox="0 0 329.26933 329"
                                fill="white"
                                width="329pt"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0" />
                              </svg>
                              Entfavorisieren
                            </button>
                          ) : (
                            <button
                              onClick={
                                user
                                  ? () => addFavoriteForUser(aid, user)
                                  : () => router.push("/login")
                              }
                              className="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-white bg-red-500 border-gray-300 rounded-md hover:bg-red-600"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-7 h-7 mr-2 text-gray-800/0 `}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="white"
                                strokeWidth={1.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                              Favorisieren
                            </button>
                          )}
                        </div>
                      )}

                      <div className="mt-4 rounded-md shadow ">
                        <span
                          onClick={() => {
                            typeof window !== "undefined"
                              ? copyToClipboard(window.location)
                              : "";
                          }}
                          className="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-gray-700 bg-white border-gray-300 rounded-md cursor-pointer select-none hover:bg-gray-200"
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
                        Identicon
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={advertisementInfoObject?.user_photo}
                          alt="Benutzeridentifizierender Avatar"
                        />
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {advertisementInfoObject?.fullname}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Mitglied seit
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {advertisementInfoObject?.register_date &&
                          format(
                            parseISO(advertisementInfoObject?.register_date),
                            "dd.MM.yyyy"
                          )}
                      </dd>
                    </div>
                    <div className="py-5 md:px-6 sm:px-0">
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
                        {advertisementInfoObject?.created_at &&
                          format(
                            parseISO(advertisementInfoObject?.created_at),
                            "dd.MM.yyyy"
                          )}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Telefonnummer
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {advertisementInfoObject?.phone_number}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Stadt
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {advertisementInfoObject?.location_street}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Anzeigen-ID
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {advertisementInfoObject?.advertisement_id}
                      </dd>
                    </div>
                    <div className="h-full px-4 py-5 sm:px-6">
                      <h3 className="text-lg font-medium leading-6 text-orange-500">
                        Beschreibung
                      </h3>
                      <div className="grow-wrap">
                        <textarea
                          readOnly
                          spellCheck="false"
                          name="comment"
                          id="comment"
                          className="block w-full mt-1 font-semibold text-gray-700 rounded-md cursor-default resize-none sm:text-sm focus:border-gray-700 focus:ring-0 h-96"
                          value={advertisementInfoObject?.description}
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
