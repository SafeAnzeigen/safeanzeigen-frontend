import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth, useUser } from "@clerk/clerk-react";
import Geocode from "react-geocode";
Geocode.setApiKey(process.env.NEXT_PUBLIC_MAP);

import Navigation from "../components/Navigation/Navigation";
import AlertConfirmationModal from "../components/GeneralComponents/Modals/AlertConfirmationModal";
import TinyCategoryCard from "../components/Startpage/TinyCategoryCard";
import RegularAdCard from "../components/Startpage/RegularAdCard";
import CategoryCard from "../components/Startpage/CategoryCard";
import Footer from "../components/Footer/Footer";

export default function Home() {
  const router = useRouter();
  const lazyRootCategory = useRef(null);
  const lazyRootNewestAd = useRef(null);
  const lazyRootNearestAd = useRef(null);
  const { user } = useUser();
  const clerkAuth = useAuth();
  const [verticalScrollIsActive, setVerticalScrollIsActive] = useState(true);
  const [geoPermission, setGeoPermission] = useState(false);
  const [currentUserLocality, setCurrentUserLocality] = useState(null);
  const [currentUserLatitude, setCurrentUserLatitude] = useState(null);
  const [currentUserLongitude, setCurrentUserLongitude] = useState(null);
  Geocode.setLanguage("de");
  Geocode.setLocationType("ROOFTOP");
  Geocode.enableDebug();

  const [showDislikeConfirmationModal, setShowDislikeConfirmationModal] =
    useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [publicAdvertisements, setPublicAdvertisements] = useState([]);
  const [favoriteAdvertisements, setFavoriteAdvertisements] = useState([]);
  const [categories, setCategories] = useState([]);

  function distance(lat1, lon1, lat2, lon2, unit, locality) {
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
    /*  console.log("DISTANCE: ", dist);
    console.log("LOCALITY FOR DISTANCE ", locality); */
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
          setCategories(data?.categories);
          console.log("CATEGORIES RETRIEVED", data?.categories);
        }
      })
      .catch((error) => {
        console.log("ERROR GET CATEGORIES", error);
      });
  };

  function transformScroll(event) {
    if (!event.deltaY) {
      return;
    }
    event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
  }

  function preventVerticalScroll() {
    if (verticalScrollIsActive) {
      var x = window.scrollX;
      var y = window.scrollY;
      window.onscroll = function () {
        window.scrollTo(x, y);
      };
      setVerticalScrollIsActive(false);
    }
  }

  function enableVerticalScroll() {
    if (!verticalScrollIsActive) {
      window.onscroll = function () {};
      setVerticalScrollIsActive(true);
    }
  }

  const retrieveNewestPublicAdvertisements = () => {
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
                getGeoLongAndLatFromLocality(element.locality).then(
                  (latLongArray) => {
                    if (latLongArray.length > 0) {
                      tempCopyElement.latitude = latLongArray[0];
                      tempCopyElement.longitude = latLongArray[1];
                      return tempCopyElement;
                    }
                    return element;
                  }
                );
              }
              return element;
            }
          );
          setPublicAdvertisements(geoAddedPublicAdvertisements);
        }
      })
      .catch((error) => {
        console.log("ERROR DATA GET ALL PUBLIC ADVERTISEMENT", error);
      });
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

  const handleChangeOfLikeStatus = (adId, currentLikeStatus) => {
    if (currentLikeStatus) {
      setSelectedAdId(adId);
      setShowDislikeConfirmationModal(true);
    }
    if (!currentLikeStatus) {
      addFavoriteForUser(adId, user);
    }
  };

  const handleCloseModal = () => {
    setSelectedAdId(null);
    setShowDislikeConfirmationModal(false);
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
        setCurrentUserLocality(data?.locality);
        setCurrentUserLatitude(latitude);
        setCurrentUserLongitude(longitude);
      });
  };

  const error = (position) => {
    /* console.log(position); */
    alert(
      "Manche Anzeigen würden wir gern anzeigen, wenn Sie sich in Ihrer Nähe befinden. Falls du das möchtest gib gern deinen Standort frei."
    );
  };

  const getGeoLongAndLatFromLocality = (locality) =>
    Geocode.fromAddress(locality).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        return [lat, lng];
      },
      (error) => {
        console.error(`ERROR GETTING LONG LAT ${locality}`, error);
        return [];
      }
    );

  useEffect(() => {
    if (user) {
      retrieveUserFavoriteAdvertisements(user);
    }
  }, [user]);

  useEffect(() => {
    if (geoPermission) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, [geoPermission]);

  useEffect(() => {
    if (publicAdvertisements?.length === 0) {
      retrieveNewestPublicAdvertisements();
    }

    if (navigator?.geolocation) {
      navigator?.permissions
        ?.query({ name: "geolocation" })
        .then((permission) => {
          if (permission?.state === "granted") {
            setGeoPermission(permission?.state === "granted");
          } else if (permission?.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, error, {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            });
          }
        });
    }

    if (categories?.length === 0) {
      retrieveCategories();
    }
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
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

      <section className="mx-4 md:mx-20">
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
        <div>
          <h2 className="pt-8 pb-4 text-3xl font-semibold text-gray-600 select-none">
            Kategorien
          </h2>
          <div
            ref={lazyRootCategory}
            className="flex p-4 -mt-2 -ml-4 space-x-1 overflow-scroll scrollbar-hide "
            onWheel={(event) => transformScroll(event, "sideScroll")}
            onMouseOver={() => preventVerticalScroll()}
            onMouseLeave={() => enableVerticalScroll()}
          >
            {categories?.length > 0 &&
              categories?.map((element, index) => (
                <div key={index}>
                  <TinyCategoryCard
                    categoryName={element?.name}
                    imageUrl={element?.category_image}
                    lazyRoot={lazyRootCategory}
                  />
                </div>
              ))}
          </div>
        </div>
        <div>
          <h2 className="pt-8 pb-4 text-3xl font-semibold text-gray-600 select-none">
            Neueste Angebote
          </h2>
          <div
            ref={lazyRootNewestAd}
            className="flex p-4 -mt-2 -ml-4 space-x-5 overflow-scroll scrollbar-hide"
            onWheel={(event) => transformScroll(event, "sideScroll")}
            onMouseOver={() => preventVerticalScroll()}
            onMouseLeave={() => enableVerticalScroll()}
          >
            {publicAdvertisements?.length > 0 &&
              publicAdvertisements
                ?.sort(function (a, b) {
                  return a.created_at > b.created_at
                    ? -1
                    : a.created_at < b.created_at
                    ? 1
                    : 0;
                })
                ?.map((element, index) => (
                  <RegularAdCard
                    key={index}
                    adId={element?.advertisement_id}
                    title={element?.title}
                    price={element?.price}
                    priceType={element?.price_type}
                    articleIsVerified={element?.is_verified}
                    sellerHasManySales={false}
                    imageUrl={element?.article_image_1}
                    isLiked={favoriteAdvertisements.includes(
                      element?.advertisement_id
                    )}
                    isReserved={!element?.is_published}
                    callbackSetLikeStatus={
                      user
                        ? handleChangeOfLikeStatus
                        : () => {
                            router.push("/login");
                          }
                    }
                    lazyRoot={lazyRootNewestAd}
                  />
                ))}
          </div>
        </div>
        <div>
          <h2 className="pt-8 pb-4 text-3xl font-semibold text-gray-600 select-none">
            Angebote in deiner Nähe
          </h2>

          {geoPermission &&
          currentUserLocality &&
          currentUserLatitude &&
          currentUserLongitude ? (
            <div
              ref={lazyRootNearestAd}
              className="flex p-4 -mt-2 -ml-4 space-x-5 overflow-scroll scrollbar-hide"
              onWheel={(event) => transformScroll(event, "sideScroll")}
              onMouseOver={() => preventVerticalScroll()}
              onMouseLeave={() => enableVerticalScroll()}
            >
              {publicAdvertisements?.length > 0 &&
                publicAdvertisements
                  ?.filter(
                    (element) =>
                      element.locality && element.latitude && element.longitude
                  )
                  ?.sort(function (a, b) {
                    return (
                      distance(
                        a.latitude,
                        a.longitude,
                        currentUserLatitude,
                        currentUserLongitude,
                        "K",
                        a.locality
                      ) -
                      distance(
                        b.latitude,
                        b.longitude,
                        currentUserLatitude,
                        currentUserLongitude,
                        "K",
                        b.locality
                      )
                    );
                  })
                  ?.map((element, index) => (
                    <RegularAdCard
                      key={index}
                      adId={element?.advertisement_id}
                      title={element?.title}
                      price={element?.price}
                      priceType={element?.price_type}
                      articleIsVerified={element?.is_verified}
                      sellerHasManySales={false}
                      imageUrl={element?.article_image_1}
                      isLiked={favoriteAdvertisements.includes(
                        element?.advertisement_id
                      )}
                      isReserved={!element?.is_published}
                      callbackSetLikeStatus={
                        user
                          ? handleChangeOfLikeStatus
                          : () => {
                              router.push("/login");
                            }
                      }
                      lazyRoot={lazyRootNearestAd}
                    />
                  ))}
            </div>
          ) : (
            <button className="inline-flex items-center px-4 py-4 my-6 ml-6 text-sm font-bold text-white bg-orange-500 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent cursor-help">
              Bitte aktiviere deine Standortbestimmung auf deinem Gerät, um
              lokale Angebote zu sehen
            </button>
          )}
        </div>
      </section>
      <section className="mx-4 mb-20 md:mx-16">
        <CategoryCard
          category="Elektronik"
          imageURL="https://images.unsplash.com/photo-1604754742629-3e5728249d73?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=800"
          subText="Finde die besten Angebote"
          ctaText="Jetzt Entdecken"
        />
        <CategoryCard
          category="Schmuck"
          imageURL="https://images.unsplash.com/photo-1536502829567-baf877a670b5?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&h=800"
          subText="Durchsuche versteckte Schätze"
          ctaText="Jetzt fündig werden"
        />
      </section>
      <Footer />
    </div>
  );
}
