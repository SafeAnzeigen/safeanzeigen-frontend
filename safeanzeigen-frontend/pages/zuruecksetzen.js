export default function Zuruecksetzen() {
  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-28 w-auto"
            src="safeanzeigen-logo.png"
            alt="Safeanzeigen Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Passwort Zurücksetzen
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Wie lautet Ihre E-Mail-Adresse?
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Passwort zurücksetzen
                </button>
              </div>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Weitere Hilfe benötigt
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-white text-gray-500 text-sm">
                <span>
                  Sollten Sie sich nicht mehr an die zum Nutzerkonto zugehörige
                  E-Mail-Adresse erinnern oder anderweitige Hilfe benötigen,{" "}
                </span>

                <a href="/kontakt" className="text-indigo-500 underline">
                  nehmen Sie mit uns Kontakt
                </a>
                <span> auf.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
