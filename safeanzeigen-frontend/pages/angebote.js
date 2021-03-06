import { useState, useEffect } from "react";
import Head from "next/head";
import { useAuth, useUser } from "@clerk/clerk-react";

import Navigation from "../components/Navigation/Navigation";
import AlertConfirmationModal from "../components/GeneralComponents/Modals/AlertConfirmationModal";
import InfoConfirmationModal from "../components/GeneralComponents/Modals/InfoConfirmationModal";
import RegularAdCard from "../components/Startpage/RegularAdCard";
import Footer from "../components/Footer/Footer";

export default function Angebote() {
  const { user } = useUser();
  const clerkAuth = useAuth();

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);
  const [showReserveConfirmationModal, setShowReserveConfirmationModal] =
    useState(false);
  const [isfetchingData, setIsfetchingData] = useState(false);
  const [offeredAdvertisements, setOfferedAdvertisements] = useState([]);
  const [selectedAdId, setSelectedAdId] = useState(null);

  const retrieveUserOffers = async (user) => {
    if (user?.id) {
      setIsfetchingData(true);
      fetch(
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

          if (data?.message === "Es konnten keine Anzeigen gefunden werden.") {
            setOfferedAdvertisements([]);
          }
        })
        .catch((error) => {
          setIsfetchingData(false);
          console.log("ERROR DATA GET OFFERS", error);
        });
    }
  };

  const handleCloseModal = () => {
    setSelectedAdId(null);
    setShowDeleteConfirmationModal(false);
    setShowReserveConfirmationModal(false);
  };

  const toggleReserveOffer = async (optionalAdid) => {
    if (optionalAdid || selectedAdId) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/advertisements/togglereservation/${
            optionalAdid ? optionalAdid : selectedAdId
          }`,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${await clerkAuth.getToken()}`,
          },
          body: JSON.stringify({
            clerk_user_id: user?.id,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA RESERVE OFFER", data);
          retrieveUserOffers(user);
        })
        .catch((error) => {
          console.log("ERROR DATA RESERVE OFFER", error);
        });
      handleCloseModal();
    }
  };

  const deleteOffer = async () => {
    if (selectedAdId) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/advertisements/delete/${selectedAdId}`,
        {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${await clerkAuth.getToken()}`,
          },
          body: JSON.stringify({
            clerk_user_id: user?.id,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA DELETE OFFER", data);
          retrieveUserOffers(user);
        })
        .catch((error) => {
          console.log("ERROR DATA DELETE OFFER", error);
        });
      handleCloseModal();
    }
  };

  useEffect(() => {
    retrieveUserOffers(user);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>
          Safeanzeigen - Wir bringen Ihre Kleinanzeigen mit Sicherheit gro??
          raus!
        </title>
        <meta
          name="description"
          content="Wir bringen deine Kleinanzeigen mit Sicherheit gro?? raus"
        />
        <meta name="theme-color" content="#2f70e9" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <Navigation />

      <div className="min-h-screen bg-gray-50">
        {showDeleteConfirmationModal && (
          <AlertConfirmationModal
            title="M??chtest du die Anzeige wirklich l??schen?"
            subtitle="Die Anzeige wird nicht mehr angesehen werden k??nnen."
            alertButtonConfirmationText="L??schen"
            showDislikeConfirmationModal={showDeleteConfirmationModal}
            callbackCloseModal={handleCloseModal}
            callbackConfirmAction={deleteOffer}
          />
        )}
        {showReserveConfirmationModal && (
          <InfoConfirmationModal
            title="Anzeige als reserviert darstellen?"
            subtitle="Die Anzeige bleibt f??r Kontaktpartner einsehbar aber taucht in Suchergebnissen nicht mehr auf. Sollte ein K??ufer abspringen, so kann die Anzeige wieder suchbar geschaltet werden."
            alertButtonConfirmationText="Reservieren"
            showDislikeConfirmationModal={showReserveConfirmationModal}
            callbackCloseModal={handleCloseModal}
            callbackConfirmAction={toggleReserveOffer}
          />
        )}

        {!isfetchingData && (
          <div className="px-4 py-12 mx-auto max-w-7xl sm:py-16 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
              <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-900 select-none sm:text-4xl">
                Deine Angebote
              </h2>
            </div>
            <div className="container w-64 mx-auto select-none md:w-full lg:w-full">
              {offeredAdvertisements && offeredAdvertisements?.length < 1 ? (
                <div>
                  <div className="flex justify-center opacity-50">
                    <img
                      src="/empty-angebote.png"
                      className="mb-2 not-draggable"
                      alt="Indikator f??r keine vorhandenen Angebote"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {offeredAdvertisements?.map((advertisement, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center text-6xl border-2 border-gray-300 md:p-4 rounded-xl"
                      style={{ maxWidth: "16rem !important" }}
                    >
                      <RegularAdCard
                        adId={advertisement.advertisement_id}
                        title={advertisement.title}
                        price={advertisement.price}
                        priceType={advertisement.priceType}
                        imageUrl={advertisement.article_image_1}
                        articleIsVerified={advertisement.is_verified}
                        sellerHasManySales={false}
                        isLiked={true}
                        isReserved={!advertisement.is_published}
                        disableFavorite={true}
                        callbackSetLikeStatus={() => {}}
                      />
                      <div className="flex w-full">
                        <button
                          onClick={() => {
                            if (!advertisement.is_published) {
                              toggleReserveOffer(
                                advertisement.advertisement_id
                              );
                            } else {
                              setShowReserveConfirmationModal(true);
                              setSelectedAdId(advertisement.advertisement_id);
                            }
                          }}
                          className="items-center w-64 px-4 py-2 mt-3 mr-2 text-sm font-medium text-white bg-teal-500 border border-transparent rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent"
                        >
                          <span>
                            {advertisement.is_published
                              ? "Reservieren"
                              : "Entreservieren"}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteConfirmationModal(true);
                            setSelectedAdId(advertisement.advertisement_id);
                          }}
                          className="items-center w-64 px-4 py-2 mt-3 ml-2 text-sm font-medium text-white bg-red-400 border border-transparent rounded-md shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent"
                        >
                          <span>L??schen</span>
                        </button>
                      </div>
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
