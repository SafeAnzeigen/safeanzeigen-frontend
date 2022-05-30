import { useState, useEffect } from "react";
import Head from "next/head";
import { useAuth, useUser } from "@clerk/clerk-react";

import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigation/Navigation";
import RegularAdCard from "../components/Startpage/RegularAdCard";
import AlertConfirmationModal from "../components/GeneralComponents/Modals/AlertConfirmationModal";
import Link from "next/link";

export default function Angebote() {
  const [showDislikeConfirmationModal, setShowDislikeConfirmationModal] =
    useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [offeredAdvertisements, setOfferedAdvertisements] = useState([]);
  const clerkAuth = useAuth();
  const { user } = useUser();

  const retrieveUserOffers = async (user) => {
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
        console.log("DATA GET OFFERS", data);
        if (data?.advertisements) {
          setOfferedAdvertisements([...data?.advertisements]);
        }
      })
      .catch((error) => {
        console.log("ERROR DATA GET OFFERS", error);
      });
  };

  const removeLikeOfAdForUser = () => {
    /*  console.log("REMOVE TRIGGER", selectedAdId);
    console.log("REMOVE TRIGGER2", userId);
    console.log("REMOVE TRIGGER3", getToken);
    console.log("user!", user); */
    handleCloseModal();
  };

  const handleChangeOfLikeStatus = (adId, currentLikeStatus) => {
    if (currentLikeStatus) {
      setSelectedAdId(adId);
      setShowDislikeConfirmationModal(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedAdId(null);
    setShowDislikeConfirmationModal(false);
  };

  useEffect(() => {
    retrieveUserOffers(user);
  }, []);

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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
      </Head>

      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {showDislikeConfirmationModal && (
          <AlertConfirmationModal
            title="Möchtest du die Anzeige aus deinen Favoriten entfernen?"
            subtitle="Die Anzeige wird nicht mehr unter den Favoriten für dich aufgelistet sein."
            alertButtonConfirmationText="Entfernen"
            showDislikeConfirmationModal={showDislikeConfirmationModal}
            callbackCloseModal={handleCloseModal}
            callbackConfirmAction={removeLikeOfAdForUser}
          />
        )}
        <div className="px-4 py-12 mx-auto max-w-7xl sm:py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
            <h2 className="mb-8 text-3xl font-extrabold text-center text-gray-900 select-none sm:text-4xl">
              Deine Angebote
            </h2>
          </div>
          <div class="container mx-auto select-none w-64 md:w-full lg:w-full">
            {offeredAdvertisements && offeredAdvertisements.length < 1 ? (
              <div>
                <div className="flex justify-center opacity-50">
                  <img
                    src="/empty-angebote.png"
                    className="mb-2 not-draggable"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {offeredAdvertisements.map((advertisement) => (
                  <div
                    className="flex flex-col justify-center p-4 text-6xl rounded-xl"
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
                      disableFavorite={true}
                      callbackSetLikeStatus={handleChangeOfLikeStatus}
                    />
                    <Link href={`/editieren/${advertisement.advertisement_id}`}>
                      <button className="w-64 mt-3 items-center px-4 py-2 text-sm font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent">
                        <span>Anzeige editieren</span>
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
