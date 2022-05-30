import CookieConsent from "react-cookie-consent";
import Cookies from "js-cookie";

const CookieBanner = () => {
  return (
    <div>
      {Cookies.get("CookieConsent") !== "true" ? (
        <CookieConsent
          style={{
            color: "black",
            fontWeight: "bold",
            background: "#e1e5ea",
            textAlign: "justify",
          }}
          cookieName="CookieConsent"
          cookieValue="true"
          enableDeclineButton
          flipButtons="true"
          buttonText="Ich stimme der Verwendung von Cookies zu"
          declineButtonText="Ich lehne die Verwendung von Cookies ab"
          buttonStyle={{
            background: "#10b981",
            color: "white",
            fontWeight: "600",
            borderRadius: "0.375rem",
            width: "94%",
          }}
          declineButtonStyle={{
            fontWeight: "600",
            borderRadius: "0.375rem",
            width: "94%",
          }}
          hideOnAccept
          onAccept={() => {
            console.log("GDPR COMPLIANT");
          }}
          onDecline={() => {
            location.href = "http://leuphana.de";
            document.cookie =
              "CookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }}
        >
          Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren,
          Funktionen für soziale Medien anbieten zu können und die Zugriffe auf
          unsere Website zu analysieren. Außerdem geben wir Informationen zu
          Ihrer Verwendung unserer Website an unsere Partner für soziale Medien,
          Werbung und Analysen weiter. Unsere Partner führen diese Informationen
          möglicherweise mit weiteren Daten zusammen, die Sie ihnen
          bereitgestellt haben oder die sie im Rahmen Ihrer Nutzung der Dienste
          gesammelt haben.
        </CookieConsent>
      ) : (
        ""
      )}
    </div>
  );
};

export default CookieBanner;
