import Head from "next/head";

/* export default function Offline() {
  return (
    <div>
      <Head>
        <title>Safeanzeigen</title>
      </Head>
      <div className="text-red-500">
        Es sieht so aus, als wärst du nicht mit dem Internet verbunden. Sobald
        du die Verbindung wiederherstellst geht es weiter!
      </div>
    </div>
  );
} */

export default function Offline() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Safeanzeigen - Du bist Offline</title>
        <meta
          name="description"
          content="Wir bringen deine Kleinanzeigen mit Sicherheit groß raus"
        />
        <meta name="theme-color" content="#2f70e9" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
        <img
          src="/static/images/offline-image.png"
          className="mb-2 not-draggable"
          alt="Offline Icon"
          style={{ width: "256px", height: "256px" }}
        />
        <div className="mx-8 text-lg font-extrabold text-center text-orange-200">
          Du bist offline. Bitte verbinde dich mit dem Internet.
        </div>
      </div>
    </div>
  );
}
