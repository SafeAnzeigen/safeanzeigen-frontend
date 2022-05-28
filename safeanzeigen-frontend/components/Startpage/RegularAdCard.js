import Link from "next/link";

function RegularAdCard({
  adId,
  title,
  price,
  priceType,
  imageUrl,
  articleIsVerified,
  sellerHasManySales,
  isLiked,
  callbackSetLikeStatus,
}) {
  function truncateStringAfterCharacterLength(string, maxCharacterLength) {
    if (string.length > maxCharacterLength) {
      return string.substring(0, maxCharacterLength) + "...";
    } else {
      return string;
    }
  }

  return (
    <Link href={`/anzeige/${adId}`}>
      <div className="transition duration-300 ease-out transform cursor-pointer select-none hover:scale-105">
        <div className="relative w-64 h-64">
          {/* <div className="absolute left-0 z-30 float-left py-1 pl-5 pr-8 text-xl font-bold text-white rounded-tr-md rounded-br-md top-0 bg-[#e97c2f] ">
          <div title="Artikel wurde verifiziert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 bg-gradient-to-r from-[#e97c2f] to-transparent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div> */}
          <div className="absolute left-0 z-30 float-left py-1 px-2 text-xl font-bold text-white rounded-br-md top-0 bg-[#e97c2f] rounded-tl-md">
            <div className="flex">
              {articleIsVerified ? (
                <div
                  className="mx-1 transition duration-300 ease-out transform hover:scale-110"
                  title="Artikel wurde verifiziert"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 bg-gradient-to-r from-[#e97c2f] to-transparent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              ) : (
                ""
              )}
              {sellerHasManySales ? (
                <div
                  className="mx-1 transition duration-300 ease-out transform hover:scale-110"
                  title="Dieser Verkäufer hat bereits viele Artikel verkauft"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg> */}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          {/* <div className="absolute right-0 z-30 float-left px-2 py-1 text-xl font-bold text-white bg-green-500 rounded-tl-md rounded-bl-md bottom-20">
          VB 300€
        </div> */}
          {/*  <div className="absolute right-0 z-30 float-left py-1 pl-8 pr-2 text-xl font-bold text-white rounded-tl-md rounded-bl-md bottom-20 bg-gradient-to-l from-green-600 to-transparent">
          {priceType} {price} €
        </div> */}
          <div className="absolute right-0 z-30 float-left py-1 pl-4 pr-2 text-lg font-bold text-white rounded-tl-md rounded-bl-md bottom-10 bg-[#2f70e9e8] flex">
            <div className="mr-1 font-normal">{priceType}</div>

            {new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
            }).format(price)}
          </div>

          <div
            onClick={(event) => {
              callbackSetLikeStatus(adId, isLiked);
              event.preventDefault();
            }}
            title="Favorisieren"
            className="absolute top-0 right-0 z-30 flex float-left py-1 pl-2 pr-2 text-lg font-bold text-transparent text-gray-800 rounded-bl-md rounded-tr-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 hover:text-[#2f70e9] text-gray-800/50"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 hover:text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="#9f9e9e71"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg> */}
          </div>

          <img
            className="rounded-xl"
            src={imageUrl}
            layout="fill"
            style={{ objectFit: "cover", height: "256px", width: "256px" }}
          />
        </div>
        <h3 className="mt-3 text-xl text-gray-600 break-words">
          {/* text-[#2f70e9] */}
          {truncateStringAfterCharacterLength(title, 44)}
        </h3>
      </div>
    </Link>
  );
}

export default RegularAdCard;
