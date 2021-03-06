import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

import Navigation from "../components/Navigation/Navigation";
import Footer from "../components/Footer/Footer";

export default function Onboarding() {
  return (
    <div className="min-h-screen bg-gray-50">
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
                          alt="Illustration eine Handy das gehalten wird."
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
                          alt="Illustration eines Non Fungible Token."
                        />
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
                        <h3 className="text-sm font-medium text-center text-gray-900">
                          Wir sind weltoffen
                        </h3>
                        <p className="mt-2 text-sm text-center text-gray-500">
                          Wir erlauben neben physischen Artikeln auch das
                          Angebot von digitalen Gütern wie NFTs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                <span className="block">Möchtest du beginnen?</span>
              </h2>
              <div className="flex flex-col items-center w-1/2 mx-auto mt-2">
                <span className="w-full mx-auto mb-4 text-lg font-bold tracking-tight text-gray-500 md:w-3/5">
                  Damit das funktioniert möchten wir eine vertrauensvolle
                  Grundlage schaffen. Dafür benötigen wir einzelne Daten von
                  dir.
                </span>
              </div>
              <div className="flex justify-center">
                <div className="inline-flex rounded-md shadow">
                  <Link href="/profil">
                    <button className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-[#2f70e9] border border-transparent rounded-md hover:bg-[#2962cd] cursor-pointer">
                      Profil vervollständigen
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
