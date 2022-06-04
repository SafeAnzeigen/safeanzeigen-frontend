export default function ConversationCard({
  adConversationRoomId,
  adId,
  adTitle,
  adPriceType,
  adPrice,
  roomCreatorClerkUserId,
  roomCreatorFullName,
  createdAtTimestamp,
  callbackSetActiveConversationRoomObject,
}) {
  const handleDeleteChat = (event) => {
    event.stopPropagation(); // USED HERE!
    console.log("adConversationRoomId", adConversationRoomId);
  };

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
        callbackSetActiveConversationRoomObject({
          adConversationRoomId,
          adId,
          adTitle,
          adPriceType,
          adPrice,
          roomCreatorClerkUserId,
          roomCreatorFullName,
          createdAtTimestamp,
        });
      }}
      className="flex p-4 mb-4 transition-transform duration-300 transform cursor-pointer bg-gray-200/75 rounded-xl entry hover:scale-105"
    >
      <div className="flex-2">
        <div className="relative w-12 h-12">
          <img
            className="w-12 h-12 mx-auto rounded-full"
            src={`https://source.boringavatars.com/beam/300/${roomCreatorClerkUserId}${roomCreatorClerkUserId}${roomCreatorClerkUserId}?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f`}
            alt="Identicon"
          />
        </div>
      </div>
      <div className="flex-1 px-2">
        <div className="flex justify-between">
          <span className="text-sm font-bold text-orange-400 break-words md:w-full md:text-lg">
            {adTitle}
          </span>
          {/* <div
            className="flex items-start justify-center w-12 h-12 bg-gray-300 rounded-full hover:text-red-500"
            oneClick={handleDeleteChat}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 mt-3 "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div> */}
        </div>
      </div>
    </div>
  );
}
