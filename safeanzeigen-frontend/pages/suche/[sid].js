import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/clerk-react";
import Geocode from "react-geocode";
Geocode.setApiKey(process.env.NEXT_PUBLIC_MAP);

import Navigation from "../../components/Navigation/Navigation";
import AlertConfirmationModal from "../../components/GeneralComponents/Modals/AlertConfirmationModal";
import RegularAdCard from "../../components/Startpage/RegularAdCard";
import Footer from "../../components/Footer/Footer";

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

let foundRadiusAdvertisementsArray = [];

export default function Suche() {
  const router = useRouter();
  const ISSERVER = typeof window === "undefined";
  const { user } = useUser();
  const clerkAuth = useAuth();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [locality, setLocality] = useState("");
  const [radius, setRadius] = useState("");
  const [localityCalculatedLat, setLocalityCalculatedLat] = useState("");
  const [localityCalculatedLong, setLocalityCalculatedLong] = useState("");

  const [isfetchingData, setIsfetchingData] = useState(false);
  const [searchedAdvertisements, setSearchedAdvertisements] = useState([]);
  const [foundRadiusAdvertisements, setFoundRadiusAdvertisements] =
    useState(false);

  const [favoriteAdvertisements, setFavoriteAdvertisements] = useState([]);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [showDislikeConfirmationModal, setShowDislikeConfirmationModal] =
    useState(false);
  Geocode.setLanguage("de");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();

  const getGeoLongAndLatFromLocality = (locality) =>
    Geocode.fromAddress(locality).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        /* console.log(`I HAVE THE LAT AND LONG ${locality}`, lat, lng); */
        return [lat, lng];
      },
      (error) => {
        console.error(`ERROR GETTING LONG LAT ${locality}`, error);
        return [];
      }
    );

  function distance(
    lat1,
    lon1,
    lat2,
    lon2,
    unit,
    locality,
    advertisementLocality
  ) {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    console.log("DISTANCE: ", dist);
    console.log("DISTANCE FOR LOCALITY", locality);
    console.log("DISTANCE FOR advertisementLocality ", advertisementLocality);
    return dist;
  }

  const retrieveUserFavoriteAdvertisements = async (user) => {
    if (user?.id) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/favorites/clerkuserid/${user?.id}`,
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
          console.log("DATA GET FAVORITES", data);
          if (data?.favorites) {
            setFavoriteAdvertisements(
              data?.favorites?.map((element) => element?.fk_advertisement_id)
            );
          }
        })
        .catch((error) => {
          console.log("ERROR DATA GET FAVORITES", error);
        });
    }
  };

  const handleCloseModal = () => {
    setSelectedAdId(null);
    setShowDislikeConfirmationModal(false);
  };

  const addFavoriteForUser = async (adId, userData) => {
    if (adId && userData?.id) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/favorites/`, {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `${await clerkAuth.getToken()}`,
        },
        body: JSON.stringify({
          clerk_user_id: userData?.id,
          fk_advertisement_id: adId,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA ADD FAVORITES", data);
          if (data?.newFavoriteArray) {
            if (data?.newFavoriteArray?.length === 0) {
              setFavoriteAdvertisements([]);
            } else if (data?.newFavoriteArray?.length > 0) {
              setFavoriteAdvertisements(
                data?.newFavoriteArray?.map(
                  (element) => element?.fk_advertisement_id
                )
              );
            }
          }
        })
        .catch((error) => {
          console.log("ERROR ADD FAVORITES", error);
        });
      handleCloseModal();
    }
  };

  const retrievePublicOffers = async (localityData) => {
    if (!foundRadiusAdvertisements) {
      setIsfetchingData(true);
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/advertisements/public/`,
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
          console.log("DATA GET ALL PUBLIC ADVERTISEMENT", data);
          if (data?.advertisements) {
            let geoAddedPublicAdvertisements = data?.advertisements?.map(
              (element) => {
                if (element.locality) {
                  let tempCopyElement = element;
                  /*  console.log("tempCopyElement BEFORE", tempCopyElement); */
                  console.log("I HAVE CONTROL ABOUT RADIUS", radius);

                  if (radius) {
                    getGeoLongAndLatFromLocality(element.locality).then(
                      (latLongArray) => {
                        /* console.log("LATLONGARRAY", latLongArray); */
                        if (latLongArray?.length > 0) {
                          tempCopyElement.latitude = latLongArray[0];
                          tempCopyElement.longitude = latLongArray[1];
                          /* console.log("tempCopyElement AFTER", tempCopyElement); */
                          return tempCopyElement;
                        }
                        return element;
                      }
                    );
                  } else {
                    return element;
                  }
                }
                return element;
              }
            );
            /* console.log(
              "geoAddedPublicAdvertisements",
              geoAddedPublicAdvertisements
            ); */

            if (localityData) {
              console.log("I HAD LOCALITY DURING RETRIEVAL", localityData);
              getGeoLongAndLatFromLocality(localityData).then(
                (latLongArray) => {
                  console.log(
                    "LATLONGARRAY OF LOCALITY DURING RETRIEVING",
                    latLongArray
                  );
                  if (latLongArray?.length > 0) {
                    setLocalityCalculatedLat(latLongArray[0]);
                    setLocalityCalculatedLong(latLongArray[1]);
                    setSearchedAdvertisements(geoAddedPublicAdvertisements);
                    /* console.log("tempCopyElement AFTER", tempCopyElement); */
                  }
                }
              );
            } else {
              console.log("I DO NOT HAVE LOCALITY DURING RETRIEVAL");

              setSearchedAdvertisements(geoAddedPublicAdvertisements);
            }
          }
          setIsfetchingData(false);
        })
        .catch((error) => {
          console.log("ERROR DATA GET ALL PUBLIC ADVERTISEMENT", error);
          setIsfetchingData(false);
        });
    }
  };

  const handleChangeOfLikeStatus = (adId, currentLikeStatus) => {
    if (currentLikeStatus) {
      setSelectedAdId(adId);
      setShowDislikeConfirmationModal(true);
    }
    if (!currentLikeStatus) {
      addFavoriteForUser(adId, user);
    }
  };

  const removeLikeOfAdForUser = async () => {
    if (selectedAdId) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/favorites/${selectedAdId}`,
        {
          method: "delete",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${await clerkAuth.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA DELETE FAVORITE", data);
          if (data?.newFavoriteArray) {
            if (data?.newFavoriteArray?.length === 0) {
              setFavoriteAdvertisements([]);
            } else if (data?.newFavoriteArray?.length > 0) {
              setFavoriteAdvertisements(
                data?.newFavoriteArray?.map(
                  (element) => element?.fk_advertisement_id
                )
              );
            }
          }
        })
        .catch((error) => {
          console.log("ERROR DELETE FAVORITE", error);
        });
      handleCloseModal();
    }
  };

  const calculateLocalityGeo = (locality) => {
    getGeoLongAndLatFromLocality(locality).then((latLongArray) => {
      console.log("LATLONGARRAY OF LOCALITY DURING RETRIEVING ", latLongArray);
      if (latLongArray?.length > 0) {
        setLocalityCalculatedLat(latLongArray[0]);
        setLocalityCalculatedLong(latLongArray[1]);
        /* console.log("tempCopyElement AFTER", tempCopyElement); */
      }
    });
  };

  useEffect(() => {
    if (router.isReady) {
      foundRadiusAdvertisementsArray = [];

      // Code using query const { search, category, subcategory, locality, radius } = router.query;
      if (!ISSERVER && localStorage.getItem("suche") === null) {
        console.log("LOCALSTORAGE NOT THERE WRITING NOW", router.query);
        setSearch(router.query.search);
        setCategory(router.query.category);
        setSubcategory(router.query.subcategory);
        setLocality(router.query.locality);
        setRadius(router.query.radius);

        localStorage.setItem(
          "suche",
          JSON.stringify({
            search: router.query.search,
            category: router.query.category,
            subcategory: router.query.subcategory,
            locality: router.query.locality,
            radius: router.query.radius,
          })
        );

        if (router.query.locality) {
          retrievePublicOffers(router.query.locality);
        } else {
          retrievePublicOffers();
        }
      } else if (
        localStorage.getItem("suche") !== null &&
        !router.query.search &&
        !router.query.category &&
        !router.query.subcategory &&
        !router.query.locality &&
        !router.query.radius
      ) {
        console.log(
          "LOCALSTORAGE THERE I AM READING FROM IT TO SET THE QUERY",
          router.query
        );
        console.log(
          "xx localStorage.getItem null",
          localStorage.getItem("suche") !== null
        );

        if (JSON.parse(localStorage.getItem("suche"))?.search) {
          setSearch(JSON.parse(localStorage.getItem("suche"))?.search);
        }

        if (JSON.parse(localStorage.getItem("suche"))?.category) {
          setCategory(JSON.parse(localStorage.getItem("suche"))?.category);
        }

        if (JSON.parse(localStorage.getItem("suche"))?.subcategory) {
          setSubcategory(
            JSON.parse(localStorage.getItem("suche"))?.subcategory
          );
        }

        if (JSON.parse(localStorage.getItem("suche"))?.locality) {
          setLocality(JSON.parse(localStorage.getItem("suche"))?.locality);
        }

        if (JSON.parse(localStorage.getItem("suche"))?.radius) {
          setRadius(JSON.parse(localStorage.getItem("suche"))?.radius);
        }

        if (JSON.parse(localStorage.getItem("suche"))?.locality) {
          retrievePublicOffers(
            JSON.parse(localStorage.getItem("suche"))?.locality
          );
        } else {
          retrievePublicOffers();
        }
      } else {
        console.log(
          "LOCALSTORAGE WAS THERE BUT DID NOT MATCH SEARCH SO I AM OVERWRITING",
          router.query
        );
        setSearch(router.query.search);
        setCategory(router.query.category);
        setSubcategory(router.query.subcategory);
        setLocality(router.query.locality);
        setRadius(router.query.radius);

        if (router.query.locality) {
          retrievePublicOffers(router.query.locality);
        } else {
          retrievePublicOffers();
        }

        localStorage.setItem(
          "suche",
          JSON.stringify({
            search: router.query.search,
            category: router.query.category,
            subcategory: router.query.subcategory,
            locality: router.query.locality,
            radius: router.query.radius,
          })
        );
      }

      /* setSearch(router.query.search);
      setCategory(router.query.category);
      setSubcategory(router.query.subcategory);
      setLocality(router.query.locality);
      setRadius(router.query.radius);
      if (router.query.locality) {
        retrievePublicOffers(router.query.locality);
      } else {
        retrievePublicOffers();
      } */

      /* console.log("QUERY TRIGGERED", router.query);
      console.log("LOCALSTORAGE"); */
    }
  }, [router.isReady]);
  /* 
  useEffect(() => {
    if (!ISSERVER) {
      console.log("LOCALSTORAGE");
      
    }
  }, [ISSERVER]); */

  useEffect(() => {
    if (user) {
      retrieveUserFavoriteAdvertisements(user);
    }
  }, [user]);

  useEffect(() => {
    window.onscroll = function () {};
    retrievePublicOffers();
  }, []);

  /*  useEffect(() => {
    if (locality) {
      retrievePublicOffers(locality);
    }
  }, [locality]); */

  const categoryFilter = (
    advertisement,
    search,
    category,
    subcategory,
    locality,
    radius
  ) => {
    let filterLength = 0;
    let passedFiltersCount = 0;

    if (foundRadiusAdvertisements) {
      return true;
    }

    if (search) {
      filterLength++;
      if (
        advertisement.title.toLowerCase().includes(search.toLowerCase()) ||
        advertisement.description.toLowerCase().includes(search.toLowerCase())
      ) {
        passedFiltersCount++;
      }
    }

    if (category) {
      filterLength++;
      if (advertisement.category_name === category) {
        passedFiltersCount++;
      }
    }

    if (locality) {
      if (!radius) {
        filterLength++;
        if (
          advertisement.locality.toLowerCase() === locality.toLowerCase() ||
          advertisement.locality.toLowerCase().includes(locality.toLowerCase())
        ) {
          passedFiltersCount++;
        }
      }
    }

    if (subcategory) {
      filterLength++;
      if (advertisement.subcategory_name === subcategory) {
        passedFiltersCount++;
      }
    }

    console.log("I AM BEFORE RADIUS CHECK", advertisement?.locality);

    if (radius) {
      filterLength++;
      if (locality) {
        let distanceArray = [];
        console.log(
          "I AM GOING IN advertisement?.locality",
          advertisement?.locality
        );

        if (localityCalculatedLat && localityCalculatedLong) {
          console.log("GEO ONE", localityCalculatedLat, localityCalculatedLong);
          distanceArray.push(localityCalculatedLat);
          distanceArray.push(localityCalculatedLong);
          console.log("GEO ONE SUCCESS", distanceArray);

          if (advertisement?.latitude && advertisement?.longitude) {
            console.log(
              "GEO TWO",
              advertisement?.latitude,
              advertisement?.longitude
            );
            distanceArray.push(advertisement?.latitude);
            distanceArray.push(advertisement?.longitude);
            console.log("GEO TWO SUCCESS", distanceArray);

            if (distanceArray?.length === 4) {
              console.log("CALCULATE NOW IF DISTANCE IS WITHIN RANGE");
              let distanceResult = distance(
                distanceArray[0],
                distanceArray[1],
                distanceArray[2],
                distanceArray[3],
                "K",
                locality,
                advertisement?.locality
              );
              console.log("GEO TWO CALCULATED DISTANCE", distanceResult);

              if (distanceResult <= radius) {
                passedFiltersCount++;
                console.log(
                  "DISTANCE WAS WITHIN RANGE",
                  locality,
                  advertisement?.locality
                );
                console.log(
                  "DISTANCE WAS WITHIN RANGE passedFiltersCount",
                  passedFiltersCount
                );
                console.log(
                  "DISTANCE WAS WITHIN RANGE filterLength",
                  filterLength
                );
              }
            }
          }
        }
      }
    }

    if (filterLength === passedFiltersCount) {
      /*  console.log(
        "THIS ADVERTISEMENT HAS PASSED filterLength passedFiltersCount",
        filterLength,
        passedFiltersCount
      );
      console.log("THIS ADVERTISEMENT HAS PASSED search", search);
      console.log("THIS ADVERTISEMENT HAS PASSED category", category);
      console.log("THIS ADVERTISEMENT HAS PASSED subcategory", subcategory);
      console.log("THIS ADVERTISEMENT HAS PASSED locality", locality);
      console.log("THIS ADVERTISEMENT HAS PASSED radius", radius);
      console.log("THIS ADVERTISEMENT IS PASSED radius", advertisement); */
      return true;
    } else {
      /*  console.log(
        "THIS ADVERTISEMENT HAS FAILED filterLength passedFiltersCount",
        filterLength,
        passedFiltersCount
      );
      console.log("THIS ADVERTISEMENT HAS FAILED search", search);
      console.log("THIS ADVERTISEMENT HAS FAILED category", category);
      console.log("THIS ADVERTISEMENT HAS FAILED subcategory", subcategory);
      console.log("THIS ADVERTISEMENT HAS FAILED locality", locality);
      console.log("THIS ADVERTISEMENT HAS FAILED radius", radius);
      console.log("THIS ADVERTISEMENT IS FAILED radius", advertisement); */
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        {showDislikeConfirmationModal && (
          <AlertConfirmationModal
            title="Möchtest du die Anzeige wirklich aus deinen Favoriten entfernen?"
            subtitle="Die Anzeige wird nicht mehr unter den Favoriten für dich aufgelistet sein."
            alertButtonConfirmationText="Entfernen"
            showDislikeConfirmationModal={showDislikeConfirmationModal}
            callbackCloseModal={handleCloseModal}
            callbackConfirmAction={removeLikeOfAdForUser}
          />
        )}
        {!isfetchingData && (
          <div className="px-4 py-12 mx-auto max-w-7xl sm:py-16 sm:px-6 lg:px-8">
            <div className="mx-auto">
              <h2 className="mb-8 text-3xl font-extrabold leading-loose text-center text-gray-900 select-none sm:text-4xl">
                Ergebnisse{" "}
                {search && (
                  <span>
                    für{" "}
                    <span className="p-2 break-words rounded-lg bg-orange-300/75">
                      {search}
                    </span>
                  </span>
                )}
                {console.log("this.props.router.query.order", router.query)}
              </h2>
              {console.log("search", search)}
              <div className="flex justify-around md:justify-center">
                <h2 className="mb-8 text-xl font-extrabold text-center text-gray-900 select-none md:mr-4 sm:text-2xl">
                  {category && (
                    <span>
                      Kategorie{" "}
                      <span className="p-2 leading-loose break-words rounded-lg bg-blue-200/75">
                        {category}
                      </span>
                    </span>
                  )}
                </h2>
                <h2 className="mb-8 text-xl font-extrabold text-center text-gray-900 select-none sm:text-2xl">
                  {subcategory && (
                    <span>
                      Subkategorie{" "}
                      <span className="p-2 leading-loose break-words rounded-lg bg-blue-200/75">
                        {subcategory}
                      </span>
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex justify-center">
                <h2 className="mb-8 mr-4 text-xl font-extrabold text-center text-gray-900 select-none sm:text-2xl">
                  {locality && (
                    <span>
                      in{" "}
                      <span className="p-2 leading-loose break-words rounded-lg bg-gray-200/75">
                        {locality}
                      </span>
                    </span>
                  )}
                </h2>
                <h2 className="mb-8 text-xl font-extrabold text-center text-gray-900 select-none sm:text-2xl">
                  {radius && radius !== "0" && (
                    <span>
                      Umkreis{" "}
                      <span className="p-2 leading-loose break-words rounded-lg bg-gray-200/75">
                        {`${radius}`} km
                      </span>
                    </span>
                  )}
                </h2>
              </div>
            </div>

            <div className="container w-64 mx-auto select-none md:w-full lg:w-full ">
              <div>
                {!foundRadiusAdvertisements ? (
                  radius && locality ? (
                    searchedAdvertisements?.length > 0 ? (
                      localityCalculatedLat && localityCalculatedLong ? (
                        searchedAdvertisements.filter((advertisement) =>
                          categoryFilter(
                            advertisement,
                            search,
                            category,
                            subcategory,
                            locality,
                            radius
                          )
                        )?.length > 0 ? (
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {searchedAdvertisements
                              .filter((advertisement) =>
                                categoryFilter(
                                  advertisement,
                                  search,
                                  category,
                                  subcategory,
                                  locality,
                                  radius
                                )
                              )
                              ?.sort(function (a, b) {
                                return a.created_at > b.created_at
                                  ? -1
                                  : a.created_at < b.created_at
                                  ? 1
                                  : 0;
                              })
                              ?.map((advertisement, index) => {
                                /*  setFoundRadiusAdvertisementsArray(
                                  advertisement?.advertisement_id
                                ); */
                                foundRadiusAdvertisementsArray.push({
                                  advertisement_id:
                                    advertisement?.advertisement_id,
                                  title: advertisement?.title,
                                  price: advertisement?.price,
                                  priceType: advertisement?.priceType,
                                  article_image_1:
                                    advertisement?.article_image_1,
                                  is_verified: advertisement?.is_verified,
                                });
                                console.log(
                                  "STATE 6 RETRIEVED advertisement?.advertisement_id",
                                  advertisement?.advertisement_id
                                );
                                return (
                                  <div
                                    key={index}
                                    className="flex flex-col items-center justify-center p-4 text-6xl rounded-xl"
                                    style={{ maxWidth: "16rem !important" }}
                                  >
                                    <RegularAdCard
                                      adId={advertisement?.advertisement_id}
                                      title={advertisement?.title}
                                      price={advertisement?.price}
                                      priceType={advertisement?.priceType}
                                      imageUrl={advertisement?.article_image_1}
                                      isLiked={favoriteAdvertisements.includes(
                                        advertisement?.advertisement_id
                                      )}
                                      articleIsVerified={
                                        advertisement?.is_verified
                                      }
                                      sellerHasManySales={false}
                                      callbackSetLikeStatus={
                                        user
                                          ? handleChangeOfLikeStatus
                                          : () => {
                                              router.push("/sign-in");
                                            }
                                      }
                                    />
                                  </div>
                                );
                              })}
                            {console.log(
                              "STATE 6: WITH RADIUS & LOCALITY FOUND AD -  DATA IS ISSERVER",
                              ISSERVER
                            )}
                            {console.log(
                              "STATE 6: WITH RADIUS & LOCALITY FOUND AD -  DATA IS search",
                              search
                            )}
                            {console.log(
                              "STATE 6: WITH RADIUS & LOCALITY FOUND AD -  DATA IS category",
                              category
                            )}
                            {console.log(
                              "STATE 6: WITH RADIUS & LOCALITY FOUND AD -  DATA IS subcategory",
                              subcategory
                            )}
                            {console.log(
                              "STATE 6: WITH RADIUS & LOCALITY FOUND AD -  DATA IS locality",
                              locality
                            )}
                            {console.log(
                              "STATE 6: WITH RADIUS & LOCALITY FOUND AD -  DATA IS radius",
                              radius
                            )}
                            {console.log(
                              "STATE 6: WITH RADIUS & LOCALITY FOUND AD -  DATA IS localityCalculatedLat ",
                              localityCalculatedLat
                            )}
                            {console.log(
                              "STATE 6: WITH RADIUS & LOCALITY FOUND AD -  DATA IS localityCalculatedLong",
                              localityCalculatedLong
                            )}
                            {console.log(
                              "STATE 6: WITH RADIUS & LOCALITY FOUND AD -  DATA IS searchedAdvertisements",
                              searchedAdvertisements
                            )}
                            {setFoundRadiusAdvertisements(true)}
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-center opacity-50">
                              {console.log(
                                "STATE 5: WITH RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS ISSERVER",
                                ISSERVER
                              )}
                              {console.log(
                                "STATE 5: WITH RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS search",
                                search
                              )}
                              {console.log(
                                "STATE 5: WITH RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS category",
                                category
                              )}
                              {console.log(
                                "STATE 5: WITH RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS subcategory",
                                subcategory
                              )}
                              {console.log(
                                "STATE 5: WITH RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS locality",
                                locality
                              )}
                              {console.log(
                                "STATE 5: WITH RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS radius",
                                radius
                              )}
                              {console.log(
                                "STATE 5: WITH RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS localityCalculatedLat ",
                                localityCalculatedLat
                              )}
                              {console.log(
                                "STATE 5: WITH RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS localityCalculatedLong",
                                localityCalculatedLong
                              )}
                              {console.log(
                                "STATE 5: WITH RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS searchedAdvertisements",
                                searchedAdvertisements
                              )}
                              <img
                                src="/no-result.png"
                                className="mb-2 not-draggable"
                                alt="Indikator für fehlende Suchergebnisse"
                              />
                            </div>
                          </div>
                        )
                      ) : (
                        <div>
                          {console.log(
                            "STATE 1: MISSING CALCULATED LONGLAT -  DATA IS ISSERVER",
                            ISSERVER
                          )}
                          {console.log(
                            "STATE 1: MISSING CALCULATED LONGLAT -  DATA IS search",
                            search
                          )}
                          {console.log(
                            "STATE 1: MISSING CALCULATED LONGLAT -  DATA IS category",
                            category
                          )}
                          {console.log(
                            "STATE 1: MISSING CALCULATED LONGLAT -  DATA IS subcategory",
                            subcategory
                          )}
                          {console.log(
                            "STATE 1: MISSING CALCULATED LONGLAT -  DATA IS locality",
                            locality
                          )}
                          {console.log(
                            "STATE 1: MISSING CALCULATED LONGLAT -  DATA IS radius",
                            radius
                          )}
                          {console.log(
                            "STATE 1: MISSING CALCULATED LONGLAT -  DATA IS localityCalculatedLat ",
                            localityCalculatedLat
                          )}
                          {console.log(
                            "STATE 1: MISSING CALCULATED LONGLAT -  DATA IS localityCalculatedLong",
                            localityCalculatedLong
                          )}
                          {console.log(
                            "STATE 1: MISSING CALCULATED LONGLAT -  DATA IS searchedAdvertisements",
                            searchedAdvertisements
                          )}
                          {calculateLocalityGeo(locality)}
                        </div>
                      )
                    ) : (
                      <div>
                        {console.log(
                          "STATE 2: MISSING ADVERTISEMENTS -  DATA IS ISSERVER",
                          ISSERVER
                        )}
                        {console.log(
                          "STATE 2: MISSING ADVERTISEMENTS -  DATA IS search",
                          search
                        )}
                        {console.log(
                          "STATE 2: MISSING ADVERTISEMENTS -  DATA IS category",
                          category
                        )}
                        {console.log(
                          "STATE 2: MISSING ADVERTISEMENTS -  DATA IS subcategory",
                          subcategory
                        )}
                        {console.log(
                          "STATE 2: MISSING ADVERTISEMENTS -  DATA IS locality",
                          locality
                        )}
                        {console.log(
                          "STATE 2: MISSING ADVERTISEMENTS -  DATA IS radius",
                          radius
                        )}
                        {console.log(
                          "STATE 2: MISSING ADVERTISEMENTS -  DATA IS localityCalculatedLat ",
                          localityCalculatedLat
                        )}
                        {console.log(
                          "STATE 2: MISSING ADVERTISEMENTS -  DATA IS localityCalculatedLong",
                          localityCalculatedLong
                        )}
                        {console.log(
                          "STATE 2: MISSING ADVERTISEMENTS -  DATA IS searchedAdvertisements",
                          searchedAdvertisements
                        )}

                        {retrievePublicOffers(locality)}
                      </div>
                    )
                  ) : searchedAdvertisements?.filter((advertisement) =>
                      categoryFilter(
                        advertisement,
                        search,
                        category,
                        subcategory,
                        locality
                      )
                    )?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {searchedAdvertisements
                        ?.filter((advertisement) =>
                          categoryFilter(
                            advertisement,
                            search,
                            category,
                            subcategory,
                            locality
                          )
                        )
                        ?.sort(function (a, b) {
                          return a.created_at > b.created_at
                            ? -1
                            : a.created_at < b.created_at
                            ? 1
                            : 0;
                        })
                        ?.map((advertisement, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center justify-center p-4 text-6xl rounded-xl"
                            style={{ maxWidth: "16rem !important" }}
                          >
                            <RegularAdCard
                              adId={advertisement?.advertisement_id}
                              title={advertisement?.title}
                              price={advertisement?.price}
                              priceType={advertisement?.priceType}
                              imageUrl={advertisement?.article_image_1}
                              isLiked={favoriteAdvertisements.includes(
                                advertisement?.advertisement_id
                              )}
                              articleIsVerified={advertisement?.is_verified}
                              sellerHasManySales={false}
                              callbackSetLikeStatus={
                                user
                                  ? handleChangeOfLikeStatus
                                  : () => {
                                      router.push("/sign-in");
                                    }
                              }
                            />
                            {console.log(
                              "STATE 3: SEARCH WITHOUT RADIUS & LOCALITY -  DATA IS ISSERVER",
                              ISSERVER
                            )}
                            {console.log(
                              "STATE 3: SEARCH WITHOUT RADIUS & LOCALITY -  DATA IS search",
                              search
                            )}
                            {console.log(
                              "STATE 3: SEARCH WITHOUT RADIUS & LOCALITY -  DATA IS category",
                              category
                            )}
                            {console.log(
                              "STATE 3: SEARCH WITHOUT RADIUS & LOCALITY -  DATA IS subcategory",
                              subcategory
                            )}
                            {console.log(
                              "STATE 3: SEARCH WITHOUT RADIUS & LOCALITY -  DATA IS locality",
                              locality
                            )}
                            {console.log(
                              "STATE 3: SEARCH WITHOUT RADIUS & LOCALITY -  DATA IS radius",
                              radius
                            )}
                            {console.log(
                              "STATE 3: SEARCH WITHOUT RADIUS & LOCALITY -  DATA IS localityCalculatedLat ",
                              localityCalculatedLat
                            )}
                            {console.log(
                              "STATE 3: SEARCH WITHOUT RADIUS & LOCALITY -  DATA IS localityCalculatedLong",
                              localityCalculatedLong
                            )}
                            {console.log(
                              "STATE 3: SEARCH WITHOUT RADIUS & LOCALITY -  DATA IS searchedAdvertisements",
                              searchedAdvertisements
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-center opacity-50">
                        {console.log(
                          "STATE 4: NO RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS ISSERVER",
                          ISSERVER
                        )}
                        {console.log(
                          "STATE 4: NO RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS search",
                          search
                        )}
                        {console.log(
                          "STATE 4: NO RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS category",
                          category
                        )}
                        {console.log(
                          "STATE 4: NO RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS subcategory",
                          subcategory
                        )}
                        {console.log(
                          "STATE 4: NO RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS locality",
                          locality
                        )}
                        {console.log(
                          "STATE 4: NO RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS radius",
                          radius
                        )}
                        {console.log(
                          "STATE 4: NO RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS localityCalculatedLat ",
                          localityCalculatedLat
                        )}
                        {console.log(
                          "STATE 4: NO RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS localityCalculatedLong",
                          localityCalculatedLong
                        )}
                        {console.log(
                          "STATE 4: NO RADIUS & LOCALITY THERE WAS NO SEARCH RESULT -  DATA IS searchedAdvertisements",
                          searchedAdvertisements
                        )}
                        <img
                          src="/no-result.png"
                          className="mb-2 not-draggable"
                          alt="Indikator für fehlende Suchergebnisse"
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <div>
                    {/*  STOP RERENDERING {foundRadiusAdvertisementsArray.length} */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {foundRadiusAdvertisementsArray
                        .filter(
                          (value, index, self) =>
                            self
                              .map((x) => x.advertisement_id)
                              .indexOf(value.advertisement_id) == index
                        )
                        .map((advertisement, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center justify-center p-4 text-6xl rounded-xl"
                            style={{ maxWidth: "16rem !important" }}
                          >
                            <RegularAdCard
                              adId={advertisement?.advertisement_id}
                              title={advertisement?.title}
                              price={advertisement?.price}
                              priceType={advertisement?.priceType}
                              imageUrl={advertisement?.article_image_1}
                              isLiked={favoriteAdvertisements.includes(
                                advertisement?.advertisement_id
                              )}
                              articleIsVerified={advertisement?.is_verified}
                              sellerHasManySales={false}
                              callbackSetLikeStatus={
                                user
                                  ? handleChangeOfLikeStatus
                                  : () => {
                                      router.push("/sign-in");
                                    }
                              }
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
