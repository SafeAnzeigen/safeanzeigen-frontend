import { useState, useEffect } from "react";
import Head from "next/head";
import { useAuth, useUser } from "@clerk/clerk-react";

import Navigation from "../components/Navigation/Navigation";
import RegularAdCard from "../components/Startpage/RegularAdCard";
import AlertConfirmationModal from "../components/GeneralComponents/Modals/AlertConfirmationModal";
import Footer from "../components/Footer/Footer";

export default function Favoriten() {
  const { user } = useUser();
  const clerkAuth = useAuth();

  const [showDislikeConfirmationModal, setShowDislikeConfirmationModal] =
    useState(false);
  const [isfetchingData, setIsfetchingData] = useState(false);
  const [favoriteAdvertisements, setFavoriteAdvertisements] = useState([]);
  const [selectedAdId, setSelectedAdId] = useState(null);

  const retrieveUserFavoriteAdvertisements = async (user) => {
    if (user?.id) {
      setIsfetchingData(true);
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
          setIsfetchingData(false);
          console.log("DATA GET FAVORITES", data);
          if (data?.favorites) {
            setFavoriteAdvertisements(data?.favorites);
          }
        })
        .catch((error) => {
          setIsfetchingData(false);
          console.log("ERROR DATA GET FAVORITES", error);
        });
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
          console.log("DATA DELETE FAVORITES", data);
          if (data?.newFavoriteArray) {
            retrieveUserFavoriteAdvertisements(user);
          }
        })
        .catch((error) => {
          console.log("ERROR DELETE FAVORITES", error);
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
      addLikeForUser(adId, user);
    }
  };

  const handleCloseModal = () => {
    setSelectedAdId(null);
    setShowDislikeConfirmationModal(false);
  };

  useEffect(() => {
    retrieveUserFavoriteAdvertisements(user);
  }, []);

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
            <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
              <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-900 select-none sm:text-4xl">
                Deine Favoriten
              </h2>
            </div>
            <div className="container w-64 mx-auto select-none md:w-full lg:w-full">
              {favoriteAdvertisements && favoriteAdvertisements?.length < 1 ? (
                <div>
                  <div className="flex justify-center opacity-50">
                    <img
                      src="/empty-favoriten.png"
                      className="mb-2 not-draggable"
                      alt="Indikator für keine vorhandenen Favoriten"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {favoriteAdvertisements?.length > 0 &&
                    favoriteAdvertisements
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
                          className="flex flex-col items-center justify-center text-6xl md:border-0 md:p-4 rounded-xl"
                          style={{ maxWidth: "16rem !important" }}
                        >
                          <RegularAdCard
                            adId={advertisement.fk_advertisement_id}
                            title={advertisement.title}
                            price={advertisement.price}
                            priceType={advertisement.price_type}
                            imageUrl={advertisement.article_image_1}
                            articleIsVerified={advertisement.is_verified}
                            sellerHasManySales={false}
                            isLiked={favoriteAdvertisements
                              ?.map((elem) => elem.fk_advertisement_id)
                              .includes(advertisement.fk_advertisement_id)}
                            isReserved={!advertisement.is_published}
                            callbackSetLikeStatus={handleChangeOfLikeStatus}
                          />
                        </div>
                      ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
