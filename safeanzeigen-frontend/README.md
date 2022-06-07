# safeanzeigen-frontend - Kleinanzeigenplattform

![GitHub deployments](https://img.shields.io/github/deployments/SafeAnzeigen/safeanzeigen-frontend/production?label=vercel&logo=vercel&logoColor=white)

Safeanzeigen ist eine moderne Kleinanzeigenplattform für den Austausch von Waren, Dienstleistungen und digitalen Assets mit besonderem Fokus auf Usability und Sicherheit. Dieses Projekt ist Teil meiner Bachelorarbeit und verwendet Technologien wie React.js, Next.js, Progressive Web App (PWA) und TailwindCSS.

🌐 [WEBSITE LIVE](https://www.safeanzeigen.de)

🎨 [FRONTEND REPOSITORY](https://github.com/SafeAnzeigen/safeanzeigen-frontend)

🖥️ [VISIT BACKEND REPOSITORY](https://github.com/SafeAnzeigen/safeanzeigen-backend)

![Preview Mobile App](https://res.cloudinary.com/dbldlm9vw/image/upload/v1654585291/DA24209E-D708-4512-8EF4-169E802D2912_osmwjw.gif)

## ✨ Features

![Onboarding](https://res.cloudinary.com/dbldlm9vw/image/upload/v1654590643/screenshot-safeanzeigen-onboard_itozhr.png)

- Registrieren mit SMS-One Time Password (OTP)
- Login mit SMS-One Time Password (OTP)
- Neue Inserate finden
- Inserate in der Nähe finden
- Inserate ansehen
- Inserate nach Stichworten suchen
- Inserate nach Stadt + Radius km suchen
- Chatkontakt aufnehmen
- Chats löschen
- Chatbenachrichtigung erhalten
- Inserate Favorisieren
- Inserate Defavorisieren
- Inserate Inserieren
- Inserate Reservieren
- Inseratreservierung aufheben
- Inserate Löschen
- Inserate Teilen
- Profil Aktualisierung

## 🤖 Technologien

- Eine moderne clientseitige Progressive Web App (PWA), welche auf den Technologien [Next.JS](https://nextjs.org), [React.JS](https://reactjs.org) und [TailwindCSS](https://tailwindcss.com) beruht.
- Leichtgewichtig und modular aufgebaut
- Nutzt zur Abbildung der Echtzeitkommunikation [Socket.IO](https://socket.io)
- User Management und SMS-One Time Password für Authentifizierung durch [Clerk](https://clerk.dev)
- Verwaltung von Bilduploads mittels [Cloudinary](https://cloudinary.com)
- Continuous Integration/Continuous Deployment Pipeline durch [Vercel](https://vercel.com)
- Geoberechnungen wurden mittels der Hilfe von [React-Geocode](https://www.npmjs.com/package/react-geocode) vorgenommen
- GDPR compliant Cookie Consent Banner wurden mittels [js-cookie](https://www.npmjs.com/package/js-cookie) eingebunden
- Die Domain [www.safeanzeigen.de](https://www.safeanzeigen.de) wurde über [Namecheap](https://www.namecheap.com) registriert und mit einem TSL-Zertifikat von [Let's Encrypt](https://letsencrypt.org) ausgestattet

## Progressive Web App (PWA)

- Safeanzeigen ist eine vollständie Progressive Web App (PWA), welche sich auf Endgeräten installieren lässt, um sich reibungslos zwischen andere Native Mobile Apps einzureihen
- Die Funktionalität der Offline Fallbacks ist nur bedingt gegen. So können nicht geladenen Bilder bei Verbindungsabbrüchen mit einem entsprechenden Icon durch den Service Worker ersetzt werden. Ganze Route hingegen und eine direkte Weiterverwendung aller Funktionalitäten ist nicht gegeben.
- Weiterhin ist die Anwendung demnächst [hier im Google Play Store](https://play.google.com/store/apps/details?id=de.safeanzeigen.twa) als Trusted Web Activity (TWA) verfügbar

## 🎨 UI

- Responsiveness optimiert für for Desktop, Tablet und Mobilgeräte
- Farbpalette
  ![Color Palette](https://res.cloudinary.com/dbldlm9vw/image/upload/v1654586952/safeanzeigen-farben_wefrdv.png)
- **Genutzte Bilder**
  - Alle genutzten Bilder sind entweder CC0 frei [Unsplash](https://unsplash.com) oder ihre Nutzungslizenz liegt durch [Flaticon](https://www.flaticon.com) vor
  - Es wurden frei verfügbare SVG Icons auf [Heroicons](https://heroicons.com) und Komponenten aus [TailwindUI](https://tailwindui.com) und [HeadlessUI](https://headlessui.dev), sowie eine Komponente aus [DaisyUI](https://daisyui.com) genutzt
- Mockup
  ![Color Palette](https://res.cloudinary.com/dbldlm9vw/image/upload/v1654590114/safeanzeigen-mockup3_qxin67.png)

## 🏗️ Architektur & Designentscheidungen

### 📁 Dateistruktur

- /components
  - Enthält modulare und wiederverwendbare Komponenten mit Zustandslogik, die JSX-Code zurückgeben, der in HTML umgewandelt wird, um ihn in Ansichten anzuzeigen. Die Unterordner gruppieren verschiedene Komponentendateien in ihren entsprechenden Kontext.
- /pages
  - Enthält Dateien, die Ansichten darstellen, in denen modulare Komponenten verwendet werden. Sie werden durch ihren eigenen Datenanmen geroutet.
- /public
  - Enthält Medien und Ressourcen, die für die Bereitstellung statischer Dateien im Stammverzeichnis der bereitgestellten Produktionswebsite verwendet werden.
- /styles
  - Enthält .css-Dateien, die für das Styling der Website verwendet werden.
    Tailwind mit aktivierten Just-In-Time-Compiler (JIT) injiziert nur die notwendigen und bereinigten CSS-Definitionen, um die Produktionsgröße so gering wie möglich zu halten

### 📏 Konventionen & Guidelines

- Dateinamen von Pages können klein geschrieben werden
- Dateinamen von Komponenten sollten CamelCase sein
- Alle Mediendateien wie Bilder müssen vor dem Hinzufügen zum Projekt optimiert und so klein wie verlustfrei möglich gemacht werden
- TailwindCSS-Klassennamen sollten immer verwendet werden und nur in Ausnahmefällen sollte Inline-Styling innerhalb der JSX angewendet werden
- Die Einrückung der Dateien sollte 2 Leerzeichen betragen
- Die Benennung von Variablen sollte aussagekräftig und englisch sein
  Kommentare sollten nur dort verwendet werden, wo sie notwendig sind, um übergeordnete Ideen des Codes zu erklären, da sie schnell veralten

### 📝 Authentifizierungsentscheidungen

Für die Benutzerauthentifizierung im Frontend wird die Authentifizierungslösung [Clerk](https://clerk.dev) eingesetzt.

![Alt Text](https://res.cloudinary.com/dbldlm9vw/image/upload/v1654587757/safeanzeigen-login_ysgopb.png)

#### SMS-One Time Password (OTP)

Als Ziel dieser Arbeit galt es eine SMS-Authentifizierung zu nutzen, um das erstellen von Fakeaccounts zu erschweren. Mittels Clerk ist diese Integration gut gelungen. Bei der Registrierung und beim Login werden die Einmalpasswörter eingefordert und so eine passwortlose aber sichere Authentifizierung ermöglicht.

### 📫 E-Mail

Für den Versand von E-Mails für den Kontakt wird der Dienst [Mailjet](https://app.mailjet.com) verwendet. Er bietet einen einfachen und kostenlosen Zugang zum Versand von 100 E-Mails pro Stunde. Weiterhin konnte die eigene E-Mail-Adresse hallo@safeanzeigen.de eingebunden werden.

### 🐛 Bekannte Bugs

- Der Indikator zum Anzeigen, dass der Gesprächspartner in einem Chat gerade schreibt schaltet sich beim Wechsel in einen anderern Chat nicht aus
- Manchmal ergibt die Radiussuche bei einem Ort und Radius in km kein Ergebnis, obwohl es Inserate in diesem Bereich gibt
- Ein erneutes Suchen, wenn man sich bereits auf der Suchseite befindet, ist erst möglich wenn man die Suchseite verlässt. Dies wurde für den Nutzer bereits durch eine Weiterleitung erzwingend eingebaut, stellt aber nicht den Idealzustand dar
- Bei einer Bildschirmgröße von 768 x 1024 Pixeln kann es innerhalb der ausgeklappten Suchleiste zu Fehlern im responsive Design kommen

## 🚀 Performance Analyse

Lighthouse wurde verwendet, um Informationen über die Leistung und die Verwendung von Best Practices für die Web-App zu sammeln.

- **Performancewerte Startseite**
  ![Startseite Lighthouse Result](https://res.cloudinary.com/dbldlm9vw/image/upload/v1654588629/screenshot-safeanzeigen-benchmark_isc1p0.png)
  - Performance 97% 🥇
  - Accessibility 98 % 🥇
  - Best Practices 100 % 🥇
  - SEO 100 % 🥇
  - PWA Ready
- **Startseite Netzwerkauslastung**
  ![Startseite Lighthouse Result](https://res.cloudinary.com/dbldlm9vw/image/upload/v1654588634/screenshot-safeanzeigen-benchmark-network-uncached_qtvq30.png)

  - 725 kB übertragen in 770 Millisekunden 🥇

- **Performancewerte Einzelinserat Seite**
  ![Dashboard Lighthouse Result](https://res.cloudinary.com/dbldlm9vw/image/upload/v1654588624/Screenshot_2022-06-02_015205_ypdpxb.png)
  - Performance 96 % 🥇
  - Accessibility 82 % 🥈
  - Best Practices 100 % 🥇
  - SEO 100 % 🥇
  - PWA Ready

## 🏠 Selber Starten

### ⏹️ Voraussetzungen

Die folgenden Anwendungen sollten vor der Ausführung dieser Software installiert werden.

```bash
Git
Yarn
Node
```

### 🔒 APIs

- Folgende APIs und Fremddienste sollten eingerichtet werden, bevor das System genutzt wird:
  - Clerk
  - Google API
  - Cloudinary API

### 🔧 Umgebungsvariablen

Es gibt einige Umgebungsvariablen, die benötigt werden, egal ob die Anwendung lokal oder im Deployment ausgeführt werden soll.

```bash
NEXT_PUBLIC_BACKEND_URL_PRODUCTION=https://safeanzeigen-backend.herokuapp.com/v1
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/v1
NEXT_PUBLIC_CLERK_FRONTEND_API=<Clerk Frontend API Key hier>
CLERK_API_KEY=<Clerk API Key hier>
CLERK_JWT_KEY=<Clerk JWT Key hier>
NEXT_PUBLIC_CLOUDINARY_PUBLIC_API_URL=<Öffentliche Cloudinary Upload URL hier>
NEXT_PUBLIC_MAP=<Google Maps API Key hier>
NEXT_PUBLIC_BACKEND_SOCKET_URL=ws://localhost:5000
<Bitte im Produktionsbetrieb durch wss://safeanzeigen-backend.herokuapp.com oder eigene Backend URL ersetzen>
```

### Frontend in der Entwicklungsumgebung ausführen

```bash
git clone <Frontend GitHub URL>
cd safeanzeigen-frontend
yarn //um Abhängigkeiten zu installieren
//Backend-Server safeanzeigen-backend starten
yarn run dev //zum Starten des Frontends
http://localhost:3000 im Browser besuchen
```

### Frontend in Produktionsumgebung starten

```bash
git clone <Frontend GitHub URL>
cd safeanzeigen-frontend
yarn //um Abhängigkeiten zu installieren
//Backend-Server safeanzeigen-backend starten
yarn run build //Um produktionsoptimiertes Frontend zu erstellen
yarn run start //Um den Build zu starten
```

### 🚢 Bereitstellen auf Vercel

Der einfachste Weg, eine Next.js-Applikation bereitzustellen, ist die Verwendung der [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) von den Machern von Next.js.

In der [Next.js deployment documentation](https://nextjs.org/docs/deployment) finden Sie weitere Details.

### 🌊 Git Flow

![Startseite Lighthouse Result](https://res.cloudinary.com/dbldlm9vw/image/upload/v1654590112/safeanzeigen-git-flow_npx565.png)

Es wurde Git Flow mit dem Main Branch, dem Develop Branch und verschiedenen Feature Branchen je User Story genutzt

- main branch (Produktionsumgebung)
- develop branch (Entwicklungsumgebung)

## 🔑 License

[License MIT License](https://github.com/SafeAnzeigen/safeanzeigen-frontend/blob/main/LICENSE)
