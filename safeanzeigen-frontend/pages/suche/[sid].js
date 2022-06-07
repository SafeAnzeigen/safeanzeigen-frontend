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

  const [routerSID, setRouterSID] = useState("");
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

  function distance(lat1, lon1, lat2, lon2, unit) {
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

                  if (parseInt(radius) > 0) {
                    getGeoLongAndLatFromLocality(element.locality).then(
                      (latLongArray) => {
                        if (latLongArray?.length > 0) {
                          tempCopyElement.latitude = latLongArray[0];
                          tempCopyElement.longitude = latLongArray[1];
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

            if (localityData) {
              getGeoLongAndLatFromLocality(localityData).then(
                (latLongArray) => {
                  if (latLongArray?.length > 0) {
                    setLocalityCalculatedLat(latLongArray[0]);
                    setLocalityCalculatedLong(latLongArray[1]);
                    setSearchedAdvertisements(geoAddedPublicAdvertisements);
                  }
                }
              );
            } else {
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
      }
    });
  };

  useEffect(() => {
    if (router.isReady) {
      foundRadiusAdvertisementsArray = [];

      if (!ISSERVER && localStorage.getItem("suche") === null) {
        setRouterSID(router.query.sid);
        setSearch(router.query.search);
        setCategory(router.query.category);
        setSubcategory(router.query.subcategory);
        setLocality(router.query.locality);
        setRadius(router.query.radius);

        localStorage.setItem(
          "suche",
          JSON.stringify({
            sid: router.query.sid,
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
        if (JSON.parse(localStorage.getItem("suche"))?.sid) {
          setRouterSID(JSON.parse(localStorage.getItem("suche"))?.sid);
        }

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
        setRouterSID(router.query.sid);
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
            sid: router.query.sid,
            search: router.query.search,
            category: router.query.category,
            subcategory: router.query.subcategory,
            locality: router.query.locality,
            radius: router.query.radius,
          })
        );
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (user) {
      retrieveUserFavoriteAdvertisements(user);
    }
  }, [user]);

  useEffect(() => {
    window.onscroll = function () {};
    retrievePublicOffers();
  }, []);

  useEffect(() => {
    console.log("USEFFECT router.query", router.query);
    console.log("USEFFECT search", search);
    console.log("USEFFECT category", category);
    console.log("USEFFECT subcategory", subcategory);
    console.log("USEFFECT locality", locality);
  }, []);

  useEffect(() => {
    console.log("USEFFECT routerSID", routerSID);
    console.log("USEFFECT router.query", router.query);
    console.log("USEFFECT search", search);
    console.log("USEFFECT category", category);
    console.log("USEFFECT subcategory", subcategory);
    console.log("USEFFECT locality", locality);
  }, [router.query.sid]);

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
      if (parseInt(radius) === 0) {
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

    if (parseInt(radius) > 0) {
      filterLength++;
      if (locality) {
        let distanceArray = [];

        if (localityCalculatedLat && localityCalculatedLong) {
          distanceArray.push(localityCalculatedLat);
          distanceArray.push(localityCalculatedLong);

          if (advertisement?.latitude && advertisement?.longitude) {
            distanceArray.push(advertisement?.latitude);
            distanceArray.push(advertisement?.longitude);

            if (distanceArray?.length === 4) {
              let distanceResult = distance(
                distanceArray[0],
                distanceArray[1],
                distanceArray[2],
                distanceArray[3],
                "K",
                locality,
                advertisement?.locality
              );

              if (distanceResult <= radius) {
                passedFiltersCount++;
              }
            }
          }
        }
      }
    }

    if (filterLength === passedFiltersCount) {
      return true;
    } else {
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
        <meta
          name="description"
          content="Wir bringen deine Kleinanzeigen mit Sicherheit groß raus"
        />
        <meta name="theme-color" content="#2f70e9" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
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
                  parseInt(radius) > 0 && locality ? (
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
                                              router.push("/login");
                                            }
                                      }
                                    />
                                  </div>
                                );
                              })}
                            {setFoundRadiusAdvertisements(true)}
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-center opacity-50">
                              <img
                                src="/no-result.png"
                                className="mb-2 not-draggable"
                                alt="Indikator für fehlende Suchergebnisse"
                              />
                            </div>
                          </div>
                        )
                      ) : (
                        <div>{calculateLocalityGeo(locality)}</div>
                      )
                    ) : (
                      <div>{retrievePublicOffers(locality)}</div>
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
                                      router.push("/login");
                                    }
                              }
                            />
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-center opacity-50">
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
                                      router.push("/login");
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
