export default function ConversationCard({
  adConversationRoomId,
  adId,
  adTitle,
  adPriceType,
  adPrice,
  roomCreatorClerkUserId,
  roomCreatorFullName,
  createdAtTimestamp,
  callbackJoinAdConversationRoom,
  /* conversationLastDate,
  unreadMessage, */
}) {
  return (
    <div
      onClick={() =>
        callbackJoinAdConversationRoom(
          adConversationRoomId,
          adId,
          adTitle,
          adPriceType,
          adPrice,
          roomCreatorClerkUserId,
          roomCreatorFullName,
          createdAtTimestamp
        )
      }
      className="flex p-4 mb-4 transition-transform duration-300 transform bg-white cursor-pointer rounded-xl entry hover:scale-105"
    >
      <div className="flex-2">
        <div className="relative w-12 h-12">
          <img
            className="w-12 h-12 mx-auto rounded-full"
            src={`https://source.boringavatars.com/beam/300/${roomCreatorClerkUserId}${roomCreatorClerkUserId}${roomCreatorClerkUserId}?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f`}
            alt="chat-user"
          />
          {/* <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" /> */}{" "}
          {/* STATUS INDICATION */}
        </div>
      </div>
      <div className="flex-1 px-2">
        <div>
          <span className="w-32 font-bold text-orange-400 break-words">
            {adTitle}
          </span>
        </div>
        <div>
          <span className="w-32 text-gray-400 font-base ">
            {roomCreatorFullName}
          </span>
        </div>
      </div>
      {/* <div className="text-right flex-2">
        <div>
          <small className="text-gray-500">{conversationLastDate}</small>
        </div>
        <div className="flex justify-end">
          {unreadMessage && (
            <div className="flex items-center justify-center w-6 h-6 text-xs text-center text-white bg-orange-500 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
