import Image from "next/image";

function RegularAdCard({ title, price, priceType, imageUrl }) {
  function truncateStringAfterCharacterLength(string, maxCharacterLength) {
    if (string.length > maxCharacterLength) {
      return string.substring(0, maxCharacterLength) + "...";
    } else {
      return string;
    }
  }

  return (
    <div className="transition duration-300 ease-out transform cursor-pointer hover:scale-105">
      <div className="relative h-80 w-80">
        {/* <div className="absolute right-0 z-30 float-left px-2 py-1 text-xl font-bold text-white bg-green-500 rounded-tl-md rounded-bl-md bottom-20">
          VB 300€
        </div> */}
        <div className="absolute right-0 z-30 float-left py-1 pl-8 pr-2 text-xl font-bold text-white rounded-tl-md rounded-bl-md bottom-20 bg-gradient-to-l from-green-600 to-transparent">
          VB 300€
        </div>
        <Image className="rounded-xl" src={imageUrl} layout="fill" />
      </div>
      <h3 className="mt-3 text-2xl text-gray-600 break-all">
        {" "}
        {/* text-[#2f70e9] */}
        {truncateStringAfterCharacterLength(title, 44)}
      </h3>
    </div>
  );
}

export default RegularAdCard;
