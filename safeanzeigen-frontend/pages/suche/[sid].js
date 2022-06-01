import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/clerk-react";

import Navigation from "../../components/Navigation/Navigation";
import AlertConfirmationModal from "../../components/GeneralComponents/Modals/AlertConfirmationModal";
import RegularAdCard from "../../components/Startpage/RegularAdCard";
import Footer from "../../components/Footer/Footer";

export default function Suche() {
  const router = useRouter();
  const { user } = useUser();
  const clerkAuth = useAuth();

  const [isfetchingData, setIsfetchingData] = useState(false);
  const [offeredAdvertisements, setOfferedAdvertisements] = useState([]);

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

  useEffect(() => {
    window.onscroll = function () {};
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {!isfetchingData && (
          <div className="px-4 py-12 mx-auto max-w-7xl sm:py-16 sm:px-6 lg:px-8">
            <div className="mx-auto">
              <h2 className="mb-8 text-3xl font-extrabold leading-loose text-center text-gray-900 select-none sm:text-4xl">
                Ergebnisse{" "}
                {router.query?.search && (
                  <span>
                    für{" "}
                    <span className="p-2 break-words rounded-lg bg-orange-300/75">{`${router.query?.search}`}</span>
                  </span>
                )}
              </h2>
              <div className="flex justify-around md:justify-center">
                <h2 className="mb-8 text-xl font-extrabold text-center text-gray-900 select-none md:mr-4 sm:text-2xl">
                  {router.query?.category && (
                    <span>
                      Kategorie{" "}
                      <span className="p-2 leading-loose break-words rounded-lg bg-blue-200/75">{`${router.query?.category}`}</span>
                    </span>
                  )}
                </h2>
                <h2 className="mb-8 text-xl font-extrabold text-center text-gray-900 select-none sm:text-2xl">
                  {router.query?.subcategory && (
                    <span>
                      Subkategorie{" "}
                      <span className="p-2 leading-loose break-words rounded-lg bg-blue-200/75">{`${router.query?.subcategory}`}</span>
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex justify-center">
                <h2 className="mb-8 mr-4 text-xl font-extrabold text-center text-gray-900 select-none sm:text-2xl">
                  {router.query?.locality && (
                    <span>
                      in{" "}
                      <span className="p-2 leading-loose break-words rounded-lg bg-gray-200/75">{`${router.query?.locality}`}</span>
                    </span>
                  )}
                </h2>
                <h2 className="mb-8 text-xl font-extrabold text-center text-gray-900 select-none sm:text-2xl">
                  {router.query?.radius && router.query?.radius !== "0" && (
                    <span>
                      Umkreis{" "}
                      <span className="p-2 leading-loose break-words rounded-lg bg-gray-200/75">
                        {`${router.query?.radius}`} km
                      </span>
                    </span>
                  )}
                </h2>
              </div>
            </div>
            <div className="container w-64 mx-auto select-none md:w-full lg:w-full">
              {offeredAdvertisements && offeredAdvertisements?.length < 1 ? (
                <div>
                  <div className="flex justify-center opacity-50">
                    <img
                      src="/empty-angebote.png"
                      className="mb-2 not-draggable"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {offeredAdvertisements?.filter(
                    (filterElement) => filterElement?.is_published
                  )?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                      {offeredAdvertisements
                        ?.filter((filterElement) => filterElement?.is_published)
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
                              articleIsVerified={advertisement?.is_verified}
                              sellerHasManySales={false}
                              isLiked={true}
                              disableFavorite={true}
                              callbackSetLikeStatus={() => {}}
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
                        />
                      </div>
                    </div>
                  )}
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
