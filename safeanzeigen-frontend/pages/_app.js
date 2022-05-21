import * as React from "react";
import { useRouter } from "next/router";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/nextjs";
import NProgress from "nprogress";

import "../styles/globals.css";

{
  /* <html class="h-full bg-gray-50">
      <body class="h-full"> */
}

const publicPages = [
  "/",
]; /* TODO: ADD MORE PAGES WITHOUT AUTHENTICATION AND DEFINE WHERE AUTH IS NEEDED TO CONTINUE */

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { pathname } = useRouter(); /* TODO: REFACTOR router.pathname? */
  const isPublicPage = publicPages.includes(pathname);

  React.useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, [router]);

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
