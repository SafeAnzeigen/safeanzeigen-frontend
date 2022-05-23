import Head from "next/head";
import Footer from "../components/Footer/Footer";
import Navigation from "../components/Navigation/Navigation";

export default function Impressum() {
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
      {/* Navigation */}
      <Navigation />

      <div className="min-h-screen py-8 text-3xl font-semibold text-center select-none bg-gray-50">
        <h1 className="mt-10">Impressum</h1>
        <br />
        <h2 id="m46">Diensteanbieter</h2>
        <p className="text-2xl text-gray-400">Sascha Majewsky</p>
        <p className="text-2xl text-gray-400">Böcklerstr. 4</p>
        <p className="text-2xl text-gray-400">22119 Hamburg</p>
        <p className="text-2xl text-gray-400">Deutschland</p>
        <br />
        <h2 id="m56">Kontaktmöglichkeiten</h2>E-Mail-Adresse:{" "}
        <p>
          <a
            href="mailto:hallo@safeanzeigen.de"
            className="text-2xl text-gray-400"
          >
            hallo@safeanzeigen.de
          </a>
        </p>
        <br />
        Kontaktformular:{" "}
        <p>
          <a
            className="text-2xl text-gray-400"
            href="https://safeanzeigen.de/kontakt"
            target="_blank"
          >
            https://safeanzeigen.de/kontakt
          </a>
        </p>
        <br />
        <p class="seal">
          <a
            className="text-2xl"
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
