import Document from "next/document";
import { Html, Head, Main, NextScript } from "next/document";

export default class extends Document {
  static async getInitialProps(ctx) {
    return await Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html lang="de">
        <Head>
          <meta
            name="description"
            content="Wir bringen deine Kleinanzeigen mit Sicherheit groß raus"
          />
          <meta name="theme-color" content="#2f70e9" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
