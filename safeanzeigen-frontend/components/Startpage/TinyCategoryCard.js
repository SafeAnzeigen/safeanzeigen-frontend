import Link from "next/link";

export default function TinyCategoryCard({ categoryName, imageUrl }) {
  const createTinyPath = (imageUrl) => {
    if (imageUrl) {
      return (
        imageUrl.split("/upload")[0] +
        "/upload" +
        "/h_144,w_112,c_scale" +
        imageUrl.split("/upload")[1]
      );
    }
  };

  return (
    <Link
      href={{
        pathname: "/suche/[sid]",
        query: {
          sid: categoryName,
          category: categoryName,
        },
      }}
      as={"/suche/" + categoryName}
    >
      <div
        title={categoryName}
        className={`w-36 transition duration-300 ease-out transform cursor-pointer select-none md:hover:scale-105`}
      >
        <div className={`relative w-28 h-36 overflow-x-hidden`}>
          <img
            className={`rounded-xl`}
            src={createTinyPath(imageUrl)}
            layout="fill"
            style={{ objectFit: "cover", height: "144px", width: "112px" }}
            alt="Vorabansicht der Kleinanzeige"
          />
        </div>
      </div>
    </Link>
  );
}
