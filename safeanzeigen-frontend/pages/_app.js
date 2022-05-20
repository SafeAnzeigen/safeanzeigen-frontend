import "../styles/globals.css";
import * as React from "react";
import { useRouter } from "next/router";
import NProgress from "nprogress";

{
  /* <html class="h-full bg-gray-50">
      <body class="h-full"> */
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
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

  return <Component {...pageProps} />;
}

export default MyApp;
