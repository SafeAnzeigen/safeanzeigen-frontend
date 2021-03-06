import Head from "next/head";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";

const faqs = [
  {
    frage: "Was ist Safeanzeigen?",
    antwort:
      "Safeanzeigen bietet eine moderne Plattform für Kleinanzeigen zum Austausch von Waren, Dienstleistungen und digitalen Gütern mit besonderem Fokus auf Benutzerfreundlichkeit und Sicherheit.",
  },
  {
    frage: "Welche Sicherheitsfeatures bietet Safeanzeigen?",
    antwort:
      "Safeanzeigen versucht eine Plattform zu bieten, welche Spammer und Betrüger ausschließt. Durch die Verwendung eines passwortlosen Logins, auch genannt One-Time-Password (OTP), via SMS-Code wird das massenhafte Erstellen von Accounts stark vermindert. Bei einem Login wird ebenfalls ein solcher OTP SMS-Code abgefragt, welches den Diebstahl von fremden Accounts unattraktiv gestaltet. Weiterhin werden Inserate mittels eines eindeutig auf dieses Inserat zugeschnittenen QR-Codes geschützt, welcher sich auf einem Verifizierungsfoto des Artikelbildes befinden muss und automatisch, sowie ggf. manuell durch einen Menschen verifiziert wird. Dadurch soll sichergestellt werden, dass mit realen Menschen kommuniziert wird, welche legitimes Kauf- und Verkaufinteresse besitzen und ihre Artikelbilder nicht lediglich aus dem Internet kopieren. Weiterhin besitzt jeder Nutzer ein eindeutiges Identicon als Profilavatar, welches schnell offenbart, wenn ein Nutzer sich als jemand anders ausgeben möchte.",
  },
  {
    frage: "Was bedeutet VB und Fix bei den Preisen?",
    antwort:
      "VB steht für verhandelbar und bedeutet, dass der Anbieter bereit ist einem niedrigeren Preis entgegenzukommen und Fix steht für festen Fixpreis ohne Verhandlungsspielraum.",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FAQ() {
  return (
    <div>
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
        <div className="px-4 py-12 mx-auto max-w-7xl sm:py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold text-center text-gray-900 sm:text-4xl">
              Oft gestellte Fragen
            </h2>
            <dl className="mt-6 space-y-6 divide-y divide-gray-200">
              {faqs.map((faq) => (
                <Disclosure as="div" key={faq.frage} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt className="text-lg">
                        <Disclosure.Button className="flex items-start justify-between w-full text-left text-gray-400">
                          <span className="font-medium text-gray-900">
                            {faq.frage}
                          </span>
                          <span className="flex items-center ml-6 h-7">
                            <ChevronDownIcon
                              className={classNames(
                                open ? "-rotate-180" : "rotate-0",
                                "h-6 w-6 transform"
                              )}
                              aria-hidden="true"
                            />
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="pr-12 mt-2">
                        <p className="text-base text-gray-500">{faq.antwort}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
