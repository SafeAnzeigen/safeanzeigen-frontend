import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import { useAuth, useUser, SignedIn, SignedOut } from "@clerk/clerk-react";

import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigation/Navigation";
import RegularAdCard from "../components/Startpage/RegularAdCard";
import AlertConfirmationModal from "../components/GeneralComponents/Modals/AlertConfirmationModal";
import Link from "next/link";

const incentives = [
  {
    name: "Free shipping",
    imageSrc:
      "https://tailwindui.com/img/ecommerce/icons/icon-shipping-simple.svg",
    description:
      "It's not actually free we just price it into the products. Someone's paying for it, and it's not us.",
  },
  {
    name: "10-year warranty",
    imageSrc:
      "https://tailwindui.com/img/ecommerce/icons/icon-warranty-simple.svg",
    description:
      "If it breaks in the first 10 years we'll replace it. After that you're on your own though.",
  },
  {
    name: "Exchanges",
    imageSrc:
      "https://tailwindui.com/img/ecommerce/icons/icon-exchange-simple.svg",
    description:
      "If you don't like it, trade it to one of your friends for something of theirs. Don't send it here though.",
  },
];

export default function Safeanzeigen() {
  const [showDislikeConfirmationModal, setShowDislikeConfirmationModal] =
    useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const { userId, getToken } = useAuth();
  const { user } = useUser();

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
            title="Möchtest du die Anzeige wirklich aus deinen Favoriten entfernen?"
            subtitle="Die Anzeige wird nicht mehr unter den Favoriten für dich aufgelistet sein."
            alertButtonConfirmationText="Entfernen"
            showDislikeConfirmationModal={showDislikeConfirmationModal}
            callbackCloseModal={handleCloseModal}
            callbackConfirmAction={removeLikeOfAdForUser}
          />
        )}
        <div className="px-4 pt-12 pb-12 mx-auto max-w-7xl sm:pb-16 sm:pt-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-3 text-3xl font-extrabold text-center text-gray-900 sm:text-4xl">
              Willkommen auf Safeanzeigen!
            </h2>
            <Image
              src="/welcome-illustration-transparent.png"
              layout="responsive"
              height="591px"
              width="768px"
            />
          </div>
          <div className="grid grid-flow-col grid-rows-2 gap-6">
            <div className="py-8 mx-auto max-w-7xl sm:px-2 sm:py-8 lg:px-4">
              <div className="max-w-2xl px-4 mx-auto lg:max-w-none">
                <div className="flex flex-col items-center justify-center w-1/2 mx-auto">
                  <h3 className="text-3xl font-extrabold tracking-tight text-center text-gray-900">
                    Wir versuchen Sicherheit in den Markt der Kleinanzeigen zu
                    bringen
                  </h3>
                  <div className="grid grid-cols-1 mt-16 gap-y-10 gap-x-8 lg:grid-cols-3">
                    <div className="sm:flex lg:block">
                      <div className="sm:flex-shrink-0">
                        <img
                          className="w-16 h-16 mx-auto"
                          src="/robot.png"
                          alt="Illustration eines Menschen der halb Roboter ist."
                        />
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
                        <h3 className="text-sm font-medium text-center text-gray-900">
                          Weniger falsche Accounts
                        </h3>
                        <p className="mt-2 text-sm text-center text-gray-500">
                          Mit Mühe machen wir es Robotern und Identitäts-dieben
                          schwer teil dieser Plattform zu sein.
                        </p>
                      </div>
                    </div>
                    <div className="sm:flex lg:block">
                      <div className="sm:flex-shrink-0">
                        <img
                          className="w-16 h-16 mx-auto"
                          src="/mobile-phone.png"
                          alt="Illustration eines Menschen der halb Roboter ist."
                        />
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
                        <h3 className="text-sm font-medium text-center text-gray-900">
                          Verifizierte Anzeigen
                        </h3>
                        <p className="mt-2 text-sm text-center text-gray-500">
                          Anbieter von Kleinanzeigen müssen einen Nachweis
                          erbringen, dass sie ihren Artikel wirklich besitzen.
                        </p>
                      </div>
                    </div>
                    <div className="sm:flex lg:block">
                      <div className="sm:flex-shrink-0">
                        <img
                          className="w-16 h-16 mx-auto"
                          src="/non-fungible-token.png"
                          alt="Illustration eines Menschen der halb Roboter ist."
                        />
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
                        <h3 className="text-sm font-medium text-center text-gray-900">
                          Wir sind weltoffen
                        </h3>
                        <p className="mt-2 text-sm text-center text-gray-500">
                          Wir erlauben neben physischen Artikeln auch das
                          Angebot von digitalen Gütern wie NFT.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <SignedIn>
              <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  <span className="block">Möchtest du beginnen?</span>
                </h2>
                <div className="flex flex-col items-center w-1/2 mx-auto mt-2">
                  <span className="w-3/5 mx-auto mb-4 text-lg font-bold tracking-tight text-gray-500">
                    Entdecke authentische Angebote und biete selber deine
                    gefundenen Schätze an.
                  </span>
                </div>
                <div className="flex justify-center">
                  <div className="inline-flex rounded-md shadow">
                    <Link href="/">
                      <button className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md hover:bg-[#2962cd] cursor-pointer">
                        Angebote entdecken
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SignedIn>

            <SignedOut>
              <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                  <span className="block">Möchtest du beginnen?</span>
                </h2>
                <div className="flex flex-col items-center w-1/2 mx-auto mt-2">
                  <span className="w-4/5 mx-auto mb-4 text-lg font-bold tracking-tight text-gray-500">
                    Werde Mitglied und finde noch heute verifizierte Angebote
                    anderer
                  </span>
                </div>
                <div className="flex justify-center">
                  <div className="inline-flex rounded-md shadow">
                    <Link href="/sign-in">
                      <button className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md hover:bg-[#2962cd] cursor-pointer">
                        Mitglied werden
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
