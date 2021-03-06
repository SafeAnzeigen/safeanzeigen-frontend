import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";

export default function Kontakt() {
  const [contactFirstname, setContactFirstname] = useState("");
  const [contactLastname, setContactLastname] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactShowError, setContactShowError] = useState(false);
  const [contactshowSuccessModal, setContactshowSuccessModal] = useState(false);
  const [contactshowFailModal, setContactshowFailModal] = useState(false);

  const redirectToMainPage = () => {
    setContactShowError(false);
    setContactshowSuccessModal(false);
    setContactshowFailModal(false);
    Router.push(`/`);
  };

  const redirectTimedToMainPage = () => {
    setTimeout(function () {
      setContactShowError(false);
      setContactshowSuccessModal(false);
      setContactshowFailModal(false);
      Router.push(`/`);
    }, 6000);
  };

  const sendContactMessage = () => {
    if (
      contactFirstname &&
      contactLastname &&
      contactEmail &&
      contactPhone &&
      contactSubject &&
      contactMessage
    ) {
      setContactShowError(false);
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}` + "/users/emailkontakt/", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: contactFirstname,
          lastname: contactLastname,
          email: contactEmail,
          phone: contactPhone,
          subject: contactSubject,
          message: contactMessage,
        }),
      }).then((response) => {
        if (response.status === 200) {
          setContactshowFailModal(false);
          setContactshowSuccessModal(true);
          redirectTimedToMainPage();
        } else {
          setContactshowSuccessModal(false);
          setContactshowFailModal(true);
        }
      });
    } else {
      setContactShowError(true);
    }
  };

  let contactPageMessageSentSuccessHeaderText =
    "Nachricht erfolgreich versandt!";

  let contactPageMessageSentSuccessText =
    "Ihre Nachricht wurde versandt und Sie werden auf die Hauptseite weitergeleitet.";

  let contactPageMessageSentFailedHeaderText =
    "Nachricht konnte nicht versandt werden!";

  let contactPageMessageSentFailedText =
    "Leider gab es einen Fehler und die Nachricht konnte nicht versandt werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns auf anderem Wege.";

  let contactPageFormHeaderText = "Kontaktformular";

  let contactPageFormMandatoryText = " (Pflicht)";

  let contactPageFormFirstnameText = "Vorname";

  let contactPageFormLastnameText = "Nachname";

  let contactPageFormEmailText = "E-Mail-Adresse";

  let contactPageFormPhoneText = "Telefonnummer";

  let contactPageFormSubjectText = "Betreff";

  let contactPageFormMessageText = "Nachricht";

  let contactPageFormMaxCharactersText = "Max. 500 Zeichen";

  let contactPageSentButtonText = "Absenden";

  let contactPageFormMissingInputErrorText = "Bitte alle Felder ausf??llen";

  return (
    <div>
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
      <>
        <div className="min-h-screen py-16 bg-white">
          <main className="overflow-hidden">
            <div className="bg-warm-gray-50">
              <h2 className="py-4 mb-8 text-3xl font-extrabold text-center text-gray-900 select-none sm:text-4xl lg:py-4">
                Kontakt
              </h2>
              {contactshowSuccessModal ? (
                <div className="fixed inset-x-0 bottom-0 z-50 p-4 mx-4 mb-4 rounded-lg opacity-75 bg-green-100/50 md:max-w-md md:mx-auto md:relative">
                  <div className="items-center md:flex">
                    <div className="mt-4 text-center md:mt-0 md:ml-6 md:text-left">
                      <p className="font-bold text-black">
                        {contactPageMessageSentSuccessHeaderText}
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        {contactPageMessageSentSuccessText}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center md:text-right md:flex md:justify-end">
                    <button
                      className="block w-full px-4 py-3 mt-4 text-sm font-semibold bg-green-200 rounded-lg md:inline-block md:w-auto md:py-2 md:mt-0 md:order-1"
                      onClick={() => redirectToMainPage()}
                    >
                      Okay
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}

              {contactshowFailModal ? (
                <div className="fixed inset-x-0 bottom-0 z-50 p-4 mx-4 mb-4 bg-white rounded-lg md:max-w-md md:mx-auto md:relative">
                  <div className="items-center md:flex">
                    <div className="mt-4 text-center md:mt-0 md:ml-6 md:text-left">
                      <p className="font-bold">
                        {contactPageMessageSentFailedHeaderText}
                      </p>
                      <p className="mt-1 text-sm text-gray-700">
                        {contactPageMessageSentFailedText}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center md:text-right md:flex md:justify-end">
                    <button
                      className="block w-full px-4 py-3 mt-4 text-sm font-semibold bg-gray-200 rounded-lg md:inline-block md:w-auto md:py-2 md:mt-0 md:order-1"
                      onClick={() => setContactshowFailModal(false)}
                    >
                      Okay
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>

            <section
              className="relative bg-white"
              aria-labelledby="contactHeading"
            >
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <h2 id="contactHeading" className="sr-only"></h2>
                <div className="mx-4 md:flex md:justify-center md:mx-auto">
                  <div className="col-span-12 px-6 py-10 bg-gray-100 rounded-lg sm:px-10 lg:col-span-2 xl:p-12">
                    <h3 className="text-lg font-medium text-warm-gray-900">
                      {contactPageFormHeaderText}
                    </h3>
                    <div className="grid grid-cols-1 mt-6 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="block text-sm font-medium text-warm-gray-900"
                        >
                          {contactPageFormFirstnameText}
                          <span className="text-xs text-gray-400">
                            {contactPageFormMandatoryText}
                          </span>
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="first_name"
                            id="first_name"
                            value={contactFirstname}
                            onChange={(event) =>
                              setContactFirstname(event.target.value)
                            }
                            autoComplete="given-name"
                            className="block w-full px-4 py-3 rounded-md shadow-sm text-warm-gray-900 focus:ring-orange-500/50 focus:border-orange-500/50 border-warm-gray-300"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-medium text-warm-gray-900"
                        >
                          {contactPageFormLastnameText}
                          <span className="text-xs text-gray-400">
                            {contactPageFormMandatoryText}
                          </span>
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            value={contactLastname}
                            onChange={(event) =>
                              setContactLastname(event.target.value)
                            }
                            autoComplete="family-name"
                            className="block w-full px-4 py-3 rounded-md shadow-sm text-warm-gray-900 focus:ring-orange-500/50 focus:border-orange-500/50 border-warm-gray-300"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-warm-gray-900"
                        >
                          {contactPageFormEmailText}
                          <span className="text-xs text-gray-400">
                            {contactPageFormMandatoryText}
                          </span>
                        </label>
                        <div className="mt-1">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={contactEmail}
                            onChange={(event) =>
                              setContactEmail(event.target.value)
                            }
                            autoComplete="email"
                            className="block w-full px-4 py-3 rounded-md shadow-sm text-warm-gray-900 focus:ring-orange-500/50 focus:border-orange-500/50 border-warm-gray-300"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-warm-gray-900"
                          >
                            {contactPageFormPhoneText}
                            <span className="text-xs text-gray-400">
                              {contactPageFormMandatoryText}
                            </span>
                          </label>

                          <div className="mt-1">
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              value={contactPhone}
                              onChange={(event) =>
                                setContactPhone(event.target.value)
                              }
                              autoComplete="tel"
                              className="block w-full px-4 py-3 rounded-md shadow-sm text-warm-gray-900 focus:ring-orange-500/50 focus:border-orange-500/50 border-warm-gray-300"
                              aria-describedby="phone-optional"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-warm-gray-900"
                        >
                          {contactPageFormSubjectText}
                          <span className="text-xs text-gray-400">
                            {contactPageFormMandatoryText}
                          </span>
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="subject"
                            id="subject"
                            value={contactSubject}
                            onChange={(event) =>
                              setContactSubject(event.target.value)
                            }
                            className="block w-full px-4 py-3 rounded-md shadow-sm text-warm-gray-900 focus:ring-orange-500/50 focus:border-orange-500/50 border-warm-gray-300"
                          />
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="flex justify-between">
                          <label
                            htmlFor="message"
                            className="block text-sm font-medium text-warm-gray-900"
                          >
                            <a>
                              {contactPageFormMessageText}
                              <span className="text-xs text-gray-400">
                                {contactPageFormMandatoryText}
                              </span>
                            </a>
                          </label>
                          <span
                            id="message-max"
                            className="text-sm text-warm-gray-500"
                          >
                            {contactPageFormMaxCharactersText}
                          </span>
                        </div>
                        <div className="mt-1">
                          <textarea
                            id="message"
                            name="message"
                            rows={4}
                            value={contactMessage}
                            onChange={(event) =>
                              setContactMessage(event.target.value)
                            }
                            className="block w-full px-4 py-3 rounded-md shadow-sm text-warm-gray-900 focus:ring-orange-500/50 focus:border-orange-500/50 border-warm-gray-300"
                            aria-describedby="message-max"
                          />
                        </div>
                      </div>
                      <div className="flex-col sm:col-span-2 sm:flex sm:justify-end">
                        <button
                          onClick={() => sendContactMessage()}
                          className="mt-2 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white   sm:w-auto !outline-none bg-[#2f70e9] hover:bg-[#2962cd]"
                        >
                          {contactPageSentButtonText}
                        </button>
                        {contactShowError ? (
                          <div className="text-center text-red-500">
                            {contactPageFormMissingInputErrorText}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </>
      <Footer />
    </div>
  );
}
