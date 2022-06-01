import Document from "next/document";
import { Html, Head, Main, NextScript } from "next/document";
class AppDocument extends Document {
  render() {
    return (
      <Html lang="de">
        <Head>
          <meta
            name="description"
            content="Safeanzeigen is a modern classified ad platform for exchanging goods, services and digital assets with a special focus on usability and security."
          />
        </Head>
        <body>
          <Main></Main>
          <NextScript></NextScript>
        </body>
      </Html>
    );
  }
}
export default AppDocument;
