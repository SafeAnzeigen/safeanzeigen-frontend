import Image from "next/image";

function CategoryCard({ category, imageURL, subText, ctaText }) {
  return (
    <div className="relative cursor-pointer py-14">
      <div className="relative h-80 min-w-[300px] ">
        <Image
          src={imageURL}
          alt={`Kategorie ${category}`}
          layout="fill"
          objectFit="cover"
          className="rounded-2xl"
        />
        <div className="absolute p-5 bg-[#ffffff67] rounded-lg top-20 left-14">
          <h3 className="w-64 mb-3 text-4xl">{category}</h3>
          <p>{subText}</p>
          <button className="px-4 py-2 mt-5 text-sm text-white bg-gray-900 rounded-lg">
            {ctaText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;