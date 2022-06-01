import Link from "next/link";

export default function TinyCategoryCard({ categoryId, imageUrl }) {
  return (
    <Link href={`/anzeige/${categoryId}`}>
      <div
        className={`w-36 transition duration-300 ease-out transform cursor-pointer select-none md:hover:scale-105`}
      >
        <div className={`relative w-28 h-36 overflow-x-hidden`}>
          <img
            className={`rounded-xl`}
            src={imageUrl}
            layout="fill"
            style={{ objectFit: "cover", height: "144px", width: "112px" }}
            alt="Vorabansicht der Kleinanzeige"
          />
        </div>
      </div>
    </Link>
  );
}
