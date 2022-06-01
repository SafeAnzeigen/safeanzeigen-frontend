import { useState, useEffect } from "react";
import Head from "next/head";
import Navigation from "../components/Navigation/Navigation";
import CategoryCard from "../components/Startpage/CategoryCard";
import RegularAdCard from "../components/Startpage/RegularAdCard";
import Footer from "../components/Footer/Footer";
import CookieBanner from "../components/GeneralComponents/Cookies/CookieBanner";
import { useAuth, useUser } from "@clerk/clerk-react";
import AlertConfirmationModal from "../components/GeneralComponents/Modals/AlertConfirmationModal";

export default function Home() {
  const [verticalScrollIsActive, setVerticalScrollIsActive] = useState(true);
  const [publicAdvertisements, setPublicAdvertisements] = useState([]);
  const [favoriteAdvertisements, setFavoriteAdvertisements] = useState([]);
  const [showDislikeConfirmationModal, setShowDislikeConfirmationModal] =
    useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const clerkAuth = useAuth();
  const { user } = useUser();

  const retrieveUserFavoriteAdvertisements = async (user) => {
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
            data?.favorites.map((element) => element.fk_advertisement_id)
          );
        }
      })
      .catch((error) => {
        console.log("ERROR DATA GET FAVORITES", error);
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
          setPublicAdvertisements(data?.advertisements);
        }
      })
      .catch((error) => {
        console.log("ERROR DATA GET ALL PUBLIC ADVERTISEMENT", error);
      });
  };

  const addFavoriteForUser = async (adId, userData) => {
    if (adId) {
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
                data?.newFavoriteArray.map(
                  (element) => element.fk_advertisement_id
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
    console.log("RECEIVED", adId, currentLikeStatus);
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
          console.log("DATA DELETE FAVORITES", data);
          if (data?.newFavoriteArray) {
            if (data?.newFavoriteArray?.length === 0) {
              setFavoriteAdvertisements([]);
            } else if (data?.newFavoriteArray?.length > 0) {
              setFavoriteAdvertisements(
                data?.newFavoriteArray.map(
                  (element) => element.fk_advertisement_id
                )
              );
            }
          }
        })
        .catch((error) => {
          console.log("ERROR DELETE FAVORITES", error);
        });
      handleCloseModal();
    }
  };

  const checkIfGeoLocationIsEnabledByUsersBrowser = () =>
    navigator.geolocation !== null && navigator.geolocation !== undefined;

  useEffect(() => {
    if (user) {
      /* retrieveUserOffers(user); */
      retrieveUserFavoriteAdvertisements(user);
      retrieveNewestPublicAdvertisements();
    }
  }, [user]);

  /* TODO: Detect if user scrolled to horizontal end then enable vertical scroll again*/

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
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
      <Navigation />
      {/* Main Page */}
      {/* Section 1 */}
      {/* TODO: CHECK IF VERTICAL SCROLL SHOULD BE TRANSFORMED TO HORIZONTAL SCROLL https://stackoverflow.com/questions/24639103/changing-vertical-scroll-to-horizontal*/}
      <CookieBanner />

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
            Neueste Angebote
          </h2>
          <div
            className="flex p-4 -mt-2 -ml-4 space-x-5 overflow-scroll scrollbar-hide"
            onWheel={(event) => transformScroll(event, "sideScroll")}
            onMouseOver={() => preventVerticalScroll()}
            onMouseLeave={() => enableVerticalScroll()}
          >
            {publicAdvertisements.length > 0 &&
              publicAdvertisements
                .sort(function (a, b) {
                  return a.created_at > b.created_at
                    ? -1
                    : a.created_at < b.created_at
                    ? 1
                    : 0;
                })
                .map((element, index) => (
                  <div key={index}>
                    <RegularAdCard
                      adId={element.advertisement_id}
                      title={element.title}
                      price={element.price}
                      priceType={element.price_type}
                      articleIsVerified={element.is_verified}
                      sellerHasManySales={false}
                      imageUrl={element.article_image_1}
                      isLiked={favoriteAdvertisements.includes(
                        element.advertisement_id
                      )}
                      isReserved={!element.is_published}
                      callbackSetLikeStatus={handleChangeOfLikeStatus}
                    />
                  </div>
                ))}
          </div>
        </div>
        <div>
          <h2 className="pt-8 pb-4 text-3xl font-semibold text-gray-600 select-none">
            Angebote in deiner Nähe
          </h2>
          {checkIfGeoLocationIsEnabledByUsersBrowser ? (
            <div
              className="flex p-4 -mt-2 -ml-4 space-x-5 overflow-scroll scrollbar-hide"
              onWheel={(event) => transformScroll(event, "sideScroll")}
              onMouseOver={() => preventVerticalScroll()}
              onMouseLeave={() => enableVerticalScroll()}
            >
              {publicAdvertisements.length > 0 &&
                publicAdvertisements
                  .sort(function (a, b) {
                    return a.created_at > b.created_at
                      ? -1
                      : a.created_at < b.created_at
                      ? 1
                      : 0;
                  })
                  .map((element, index) => (
                    <div key={index}>
                      <RegularAdCard
                        adId={element.advertisement_id}
                        title={element.title}
                        price={element.price}
                        priceType={element.price_type}
                        articleIsVerified={element.is_verified}
                        sellerHasManySales={false}
                        imageUrl={element.article_image_1}
                        isLiked={favoriteAdvertisements.includes(
                          element.advertisement_id
                        )}
                        isReserved={!element.is_published}
                        callbackSetLikeStatus={handleChangeOfLikeStatus}
                      />
                    </div>
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
          category="Hardware"
          imageURL="https://images.unsplash.com/photo-1604754742629-3e5728249d73?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670"
          subText="Finde die besten Angebote"
          ctaText="Jetzt Entdecken"
        />
        <CategoryCard
          category="Schmuck"
          imageURL="https://images.unsplash.com/photo-1536502829567-baf877a670b5?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670"
          subText="Durchsuche versteckte Schätze"
          ctaText="Jetzt fündig werden"
        />
      </section>
      <Footer />
    </div>
  );
}
