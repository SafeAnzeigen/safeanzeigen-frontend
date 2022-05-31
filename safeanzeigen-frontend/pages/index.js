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
  const [offeredAdvertisements, setOfferedAdvertisements] = useState([]);
  const [favoriteAdvertisements, setFavoriteAdvertisements] = useState([]);
  const [showDislikeConfirmationModal, setShowDislikeConfirmationModal] =
    useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [isfetchingData, setIsfetchingData] = useState(false);
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

  const newestAds = [
    {
      title: "Tolle Kamera zu verkaufen",
      price: 200.77,
      priceType: "VB",
      articleIsVerified: true,
      sellerHasManySales: true,
      imageUrl:
        "https://images.unsplash.com/photo-1653164673020-bae8b512f2d8?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364",
    },
    {
      title: "Römertopf wie neu",
      price: 65,
      priceType: "Fix",
      articleIsVerified: true,
      sellerHasManySales: true,
      imageUrl:
        "https://images.unsplash.com/photo-1604579278540-db35e2fa658a?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2308",
    },
    {
      title: "Sonnenbrille mit gutem Lichtschutz",
      price: 150,
      priceType: "VB",
      articleIsVerified: true,
      sellerHasManySales: false,
      imageUrl:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760",
    },
    {
      title: "Perfekt roter Lippenstift",
      price: 26,
      priceType: "Fix",
      articleIsVerified: true,
      sellerHasManySales: true,
      imageUrl:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1315",
    },
    {
      title: "Grüne Trinkflasche ohne Weichmacher",
      price: 12.5,
      priceType: "Fix",
      articleIsVerified: true,
      sellerHasManySales: false,
      imageUrl:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287",
    },
    {
      title: "Home Assistant mit Sprachssteuerung",
      price: 99,
      priceType: "VB",
      articleIsVerified: true,
      sellerHasManySales: false,
      imageUrl:
        "https://images.unsplash.com/photo-1543512214-318c7553f230?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287",
    },
    {
      title: "Großer grüner Rucksack mit viel Stauraum",
      price: 140,
      priceType: "VB",
      articleIsVerified: true,
      sellerHasManySales: true,
      imageUrl:
        "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1328",
    },
    {
      title: "Spielecontroller mit Bluetooth",
      price: 29.99,
      priceType: "Fix",
      articleIsVerified: true,
      sellerHasManySales: true,
      imageUrl:
        "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287",
    },
    {
      title: "Wunderschöne Herrenuhr mit Automatikuhrwerk",
      price: 299,
      priceType: "VB",
      articleIsVerified: true,
      sellerHasManySales: true,
      imageUrl:
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-1.2.1&raw_url=true&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288",
    },
    {
      title: "Herrenduft unbenutzt",
      price: 40,
      priceType: "VB",
      articleIsVerified: true,
      sellerHasManySales: false,
      imageUrl:
        "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287",
    },
    {
      title: "Smartwatch mit LTE nur wenige Monate genutzt",
      price: 160,
      priceType: "Fix",
      articleIsVerified: true,
      sellerHasManySales: true,
      imageUrl:
        "https://images.unsplash.com/photo-1549482199-bc1ca6f58502?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364",
    },
    {
      title: "Kamera",
      price: 750,
      priceType: "VB",
      articleIsVerified: true,
      sellerHasManySales: false,
      imageUrl:
        "https://images.unsplash.com/photo-1653164673020-bae8b512f2d8?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364",
    },
  ];

  function transformScroll(event) {
    if (!event.deltaY) {
      return;
    }

    event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
    /* window.scrollTo(0, 0);
    document.body.style.overflow = "hidden"; */
    /* event.preventDefault(); */
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

  const retrieveUserOffers = async (user) => {
    console.log("retrieveUserOffers TRIGGERED", user);
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
      })
      .catch((error) => {
        setIsfetchingData(false);
        console.log("ERROR DATA GET OFFERS", error);
      });
  };

  const addFavoriteForUser = async (adId, userData) => {
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
  };

  useEffect(() => {
    if (user) {
      retrieveUserOffers(user);
      retrieveUserFavoriteAdvertisements(user);
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
            Angebote aus DB
          </h2>
          <div
            className="flex p-4 -mt-2 -ml-4 space-x-5 overflow-scroll scrollbar-hide"
            /* onWheel={(event) => transformScroll(event, "sideScroll")}
            onMouseOver={() => preventVerticalScroll()}
            onMouseLeave={() => enableVerticalScroll()} */
          >
            {offeredAdvertisements
              ?.filter((filterElement) => filterElement.is_published)
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
          <div
            className="flex p-4 -mt-2 -ml-4 space-x-5 overflow-scroll scrollbar-hide"
            onWheel={(event) => transformScroll(event, "sideScroll")}
            onMouseOver={() => preventVerticalScroll()}
            onMouseLeave={() => enableVerticalScroll()}
          >
            {/* w-3/6 */}
            {newestAds?.map(
              (
                {
                  title,
                  price,
                  priceType,
                  imageUrl,
                  articleIsVerified,
                  sellerHasManySales,
                },
                index
              ) => (
                <RegularAdCard
                  key={index}
                  title={title}
                  price={price}
                  priceType={priceType}
                  articleIsVerified={articleIsVerified}
                  sellerHasManySales={sellerHasManySales}
                  imageUrl={imageUrl}
                />
              )
            )}
          </div>
        </div>
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
            {" "}
            {/* w-3/6 */}
            {newestAds?.map(
              (
                {
                  title,
                  price,
                  priceType,
                  imageUrl,
                  articleIsVerified,
                  sellerHasManySales,
                },
                index
              ) => (
                <RegularAdCard
                  key={index}
                  title={title}
                  price={price}
                  priceType={priceType}
                  articleIsVerified={articleIsVerified}
                  sellerHasManySales={sellerHasManySales}
                  imageUrl={imageUrl}
                />
              )
            )}
          </div>
        </div>
        {/* <div className="flex max-w-full">
        <div>
            <h2 className="py-8 text-4xl font-semibold">Neueste Angebote</h2>
            <div className="flex w-3/6 p-4 -mt-2 -ml-4 space-x-5 overflow-scroll scrollbar-hide">
              {newestAds?.map(
                ({ title, price, priceType, imageUrl }, index) => (
                  <RegularAdCard
                    key={index}
                    title={title}
                    price={price}
                    priceType={priceType}
                    imageUrl={imageUrl}
                  />
                )
              )}
            </div>
          </div>
          <div>
            <h2 className="py-8 text-4xl font-semibold">Neueste Angebote</h2>
            <div className="flex w-3/6 p-4 -mt-2 -ml-4 space-x-5 overflow-scroll scrollbar-hide">
              {newestAds?.map(
                ({ title, price, priceType, imageUrl }, index) => (
                  <RegularAdCard
                    key={index}
                    title={title}
                    price={price}
                    priceType={priceType}
                    imageUrl={imageUrl}
                  />
                )
              )}
            </div>
          </div>
        </div> */}
      </section>
      {/* Section 2 */}
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
      {/* Footer */}
      <Footer />
    </div>
  );
}
