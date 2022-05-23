import * as React from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import ProgressBar from "@badrap/bar-of-progress";

import "../styles/globals.css";

const progress = new ProgressBar({
  size: 4,
  color: "#E97C2F",
  className: "z-50",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

const publicPages = [
  "/",
]; /* TODO: ADD MORE PAGES WITHOUT AUTHENTICATION AND DEFINE WHERE AUTH IS NEEDED TO CONTINUE */

function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter(); /* TODO: REFACTOR router.pathname? */
  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider {...pageProps}>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <>
          <SignedIn>
            <Component {...pageProps} />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  );
}

export default MyApp;
