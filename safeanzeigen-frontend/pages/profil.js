import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { UserProfile } from "@clerk/clerk-react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/solid";

import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";

export default function Profil() {
  const { user } = useUser();
  const clerkAuth = useAuth();

  const checkUserHasProvidedMinimumProfileData = (userData) =>
    userData?.firstName &&
    userData?.lastName &&
    userData?.phoneNumbers[0]?.phoneNumber &&
    userData?.phoneNumbers[0]?.verification?.status === "verified" &&
    userData?.emailAddresses[0]?.emailAddress &&
    userData?.emailAddresses[0]?.verification?.status === "verified";

  const checkUserHasUpdatedProfileData = (backendUserData, clerkUserData) =>
    backendUserData?.user?.email !==
      clerkUserData?.emailAddresses[0]?.emailAddress ||
    backendUserData?.user?.firstname !== clerkUserData?.firstName ||
    backendUserData?.user?.lastname !== clerkUserData?.lastName ||
    backendUserData?.user?.phone_number !==
      clerkUserData?.phoneNumbers[0]?.phoneNumber;

  const addClerkUserToCustomBackend = async (userData) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/users/`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${await clerkAuth.getToken()}`,
      },
      body: JSON.stringify({
        clerk_user_id: userData.id,
        firstname: userData.firstName,
        lastname: userData.lastName,
        phone_number: userData.phoneNumbers[0].phoneNumber,
        phone_verified: userData.phoneNumbers[0].verification.expireAt,
        email: userData.emailAddresses[0].emailAddress,
        email_verified: userData.emailAddresses[0].verification.expireAt,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA SIGNUP", data);
      })
      .catch((error) => {
        console.log("ERROR USER SIGNUP", error);
      });
  };

  const updateClerkUserInCustomBackend = async (userData) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/users/`, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `${await clerkAuth.getToken()}`,
      },
      body: JSON.stringify({
        clerk_user_id: userData.id,
        firstname: userData.firstName,
        lastname: userData.lastName,
        phone_number: userData.phoneNumbers[0].phoneNumber,
        phone_verified: userData.phoneNumbers[0].verification.expireAt,
        email: userData.emailAddresses[0].emailAddress,
        email_verified: userData.emailAddresses[0].verification.expireAt,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA USER UPDATE", data);
      })
      .catch((error) => {
        console.log("ERROR USER UPDATE", error);
      });
  };

  const checkForUserInfoHasChanged = async (userData) => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
        `/users/clerkid/${userData.id}/`,
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
        console.log("DATA CHECK USER EXISTENCE FOR CHANGE", data);
        if (data?.user?.user_id) {
          if (
            checkUserHasProvidedMinimumProfileData(userData) &&
            checkUserHasUpdatedProfileData(data, userData)
          ) {
            updateClerkUserInCustomBackend(userData);
          }
        }
      })
      .catch((error) => {
        console.log("ERROR CHECK USER EXISTANCE", error);
      });
  };

  const checkIfClerkUserExistsInCustomBackend = async (userData) => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
        `/users/clerkid/${userData.id}/`,
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
        console.log("DATA CHECK USER EXISTENCE", data);
        if (
          data.message === "Dieser Nutzer wurde nicht gefunden." &&
          checkUserHasProvidedMinimumProfileData(userData)
        ) {
          addClerkUserToCustomBackend(userData);
        } else if (data?.user?.user_id) {
          checkForUserInfoHasChanged(userData);
        }
      })
      .catch((error) => {
        console.log("ERROR CHECK USER EXISTENCE", error);
      });
  };

  useEffect(() => {
    if (user && checkUserHasProvidedMinimumProfileData(user)) {
      checkIfClerkUserExistsInCustomBackend(user);
    }
  }, []);

  useEffect(() => {
    if (user && checkUserHasProvidedMinimumProfileData(user)) {
      checkIfClerkUserExistsInCustomBackend(user);
    }
  });

  return (
    <div>
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

      {user &&
      (!user?.firstName ||
        !user?.lastName ||
        !user?.emailAddresses[0]?.emailAddress ||
        !user?.emailAddresses[0]?.verification?.status === "verified") ? (
        <div className="bg-white">
          <div className="pt-4">
            <div className="w-3/4 p-4 pt-2 mx-auto rounded-md bg-red-50 md:w-1/6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircleIcon
                    className="w-5 h-5 text-red-400"
                    aria-hidden="true"
                  />
                </div>

                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Damit du auf Safeanzeigen zugreifen kannst fehlt folgendes:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul role="list" className="pl-5 space-y-1 list-disc">
                      {(!user?.emailAddresses[0]?.emailAddress ||
                        !user?.emailAddresses[0]?.verification?.status ===
                          "verified") && (
                        <li>E-Mail-Adresse hinterlegen und verifizieren</li>
                      )}
                      {!user?.firstName && <li>Gebe deinen Vornamen an</li>}
                      {!user?.lastName && <li>Gebe deinen Nachnamen an</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white">
          <div className="pt-4">
            <div className="w-3/4 p-4 mx-auto rounded-md md:w-2/6 bg-green-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon
                    className="w-5 h-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Du hast alle notwendigen Daten angegeben!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Viel Spaß auf Safeanzeigen!</p>
                  </div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <Link href="/">
                        <button
                          type="button"
                          className="bg-[#2f70e9] px-2 py-1.5 rounded-md text-sm font-medium text-white hover:bg-[#2962cd] focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-green-0 focus:ring-transparent"
                        >
                          Jetzt Loslegen
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <UserProfile only="account" />
      <div className="pt-8 bg-white">
        <Footer />
      </div>
    </div>
  );
}
