import Head from "next/head";

import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigation/Navigation";

export default function Impressum() {
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

      <div className="min-h-screen py-8 text-3xl font-semibold text-center select-none bg-gray-50">
        <h1 className="mt-10 text-4xl text-orange-400">Impressum</h1>
        <br />
        <h2 id="m46" className="text-2xl text-[#2f70e9]">
          Diensteanbieter
        </h2>
        <p className="text-xl text-gray-400">Sascha Majewsky</p>
        <p className="text-xl text-gray-400">Böcklerstr. 4</p>
        <p className="text-xl text-gray-400">22119 Hamburg</p>
        <p className="text-xl text-gray-400">Deutschland</p>
        <br />
        <h2 id="m56" className="text-2xl text-[#2f70e9] mb-2">
          Kontaktmöglichkeiten
        </h2>
        <div className="text-2xl text-[#2f70e9]">E-Mail-Adresse: </div>
        <p>
          <a
            href="mailto:hallo@safeanzeigen.de"
            className="text-xl text-gray-400"
          >
            hallo@safeanzeigen.de
          </a>
        </p>
        <br />
        <div className="text-2xl text-[#2f70e9]">Kontaktformular: </div>
        <p>
          <a
            className="text-xl text-gray-400"
            href="https://safeanzeigen.de/kontakt"
            target="_blank"
            rel="noreferrer"
          >
            https://safeanzeigen.de/kontakt
          </a>
        </p>
        <br />
        <p className="seal">
          <a
            className="text-xl text-gray-400"
            href="https://datenschutz-generator.de/"
            title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken."
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas
            Schwenke
          </a>
        </p>
      </div>
      <Footer />
    </div>
  );
}
