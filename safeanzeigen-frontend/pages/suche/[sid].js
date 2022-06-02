import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/clerk-react";

import Navigation from "../../components/Navigation/Navigation";
import AlertConfirmationModal from "../../components/GeneralComponents/Modals/AlertConfirmationModal";
import RegularAdCard from "../../components/Startpage/RegularAdCard";
import Footer from "../../components/Footer/Footer";

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

export default function Suche() {
  const router = useRouter();
  const ISSERVER = typeof window === "undefined";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [locality, setLocality] = useState("");
  const [radius, setRadius] = useState("");

  const { user } = useUser();
  const clerkAuth = useAuth();

  const [isfetchingData, setIsfetchingData] = useState(false);
  const [searchedAdvertisements, setSearchedAdvertisements] = useState([]);
  const [favoriteAdvertisements, setFavoriteAdvertisements] = useState([]);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [showDislikeConfirmationModal, setShowDislikeConfirmationModal] =
    useState(false);

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

  const retrievePublicOffers = async () => {
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
          setSearchedAdvertisements(data?.advertisements);
        }
        setIsfetchingData(false);
      })
      .catch((error) => {
        console.log("ERROR DATA GET ALL PUBLIC ADVERTISEMENT", error);
        setIsfetchingData(false);
      });
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

  useEffect(() => {
    if (router.isReady) {
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

  const categoryFilter = (
    advertisement,
    search,
    category,
    subcategory,
    locality
  ) => {
    let filterLength = 0;
    let passedFiltersCount = 0;

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
      filterLength++;
      if (
        advertisement.locality.toLowerCase() === locality.toLowerCase() ||
        advertisement.locality.toLowerCase().includes(locality.toLowerCase())
      ) {
        passedFiltersCount++;
      }
    }

    if (subcategory) {
      filterLength++;
      if (advertisement.subcategory_name === subcategory) {
        passedFiltersCount++;
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
            <div className="container w-64 mx-auto select-none md:w-full lg:w-full">
              <div>
                {searchedAdvertisements?.filter((advertisement) =>
                  categoryFilter(
                    advertisement,
                    search,
                    category,
                    subcategory,
                    locality
                  )
                )?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
