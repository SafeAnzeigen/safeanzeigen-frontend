import Head from "next/head";
import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigation/Navigation";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

const faqs = [
  {
    frage: "Was ist Safeanzeigen?",
    antwort:
      "Safeanzeigen bietet als moderne Plattform für Kleinanzeigen zum Austausch von Waren, Dienstleistungen und digitalen Gütern mit besonderem Fokus auf Benutzerfreundlichkeit und Sicherheit.",
  },
  {
    frage: "Welche Sicherheitsfeatures bietet Safeanzeigen?",
    antwort:
      "Mit Safeanzeigen wird versucht eine Plattform zu bieten, welche Spammer und Betrüger ausschließt. Durch die Verwendung von einem passwortlosen Login via SMS-Code werden multiple Accounts vermindert. Weiterhin werden Inserate mittels eines auf dieses Inserat zugeschnittenen QR-Codes geschützt, welcher sich auf einem Verifizierungsfoto des Inserates befinden muss und automatisch, sowie ggf. manuell durch einen Menschen verifiziert wird. Dadurch soll sichergestellt werden, dass mit realen Menschen kommuniziert wird, welche legitimes Kauf- und Verkaufinteresse besitzen, sowie Betrüger mit lediglich kopierten Produktbildern ausgeschloßen werden.",
  },
  {
    frage: "xxxx",
    antwort: "xxxx",
  },
  {
    frage: "yyyy",
    antwort: "yyyy",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FAQ() {
  return (
    <div className="">
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
        <div className="px-4 py-12 mx-auto max-w-7xl sm:py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
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
