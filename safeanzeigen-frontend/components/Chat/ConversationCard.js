import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@clerk/clerk-react";

import AlertConfirmationModal from "../GeneralComponents/Modals/AlertConfirmationModal";

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
  isActive,
}) {
  const router = useRouter();
  const clerkAuth = useAuth();
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const handleDeleteChat = async () => {
    if (adConversationRoomId) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/chats/${adConversationRoomId}`,
        {
          method: "delete",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${await clerkAuth.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA DELETE CHAT", data);
          if (
            data?.message ===
            "Dieser Chat und alle Nachrichten wurden gelöscht."
          ) {
            router.reload(window.location.pathname);
          }
        })
        .catch((error) => {
          console.log("ERROR DELETE FAVORITES", error);
        });
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setShowDeleteConfirmationModal(false);
  };

  return (
    <div
      className={`${
        isActive ? "bg-gray-300" : "bg-gray-200/75"
      } flex justify-between p-4 mb-4 transition-transform duration-300 transform cursor-pointer rounded-xl entry hover:scale-105`}
    >
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
        className="flex items-center w-full"
      >
        {showDeleteConfirmationModal && (
          <AlertConfirmationModal
            title="Möchtest du diesen Chat wirklich löschen?"
            subtitle="Der Chat und alle Nachrichten werden verschwinden."
            alertButtonConfirmationText="Löschen"
            showDislikeConfirmationModal={showDeleteConfirmationModal}
            callbackCloseModal={handleCloseModal}
            callbackConfirmAction={handleDeleteChat}
          />
        )}
        <div className="flex-2">
          <div className="relative w-12 h-12 select-none">
            <img
              className="w-12 h-12 mx-auto rounded-full"
              src={`https://source.boringavatars.com/beam/300/${roomCreatorClerkUserId}${roomCreatorClerkUserId}${roomCreatorClerkUserId}?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f`}
              alt="Identicon"
            />
          </div>
        </div>
        <div className="flex-1 px-2">
          <div className="flex justify-between">
            <span className="text-sm font-bold text-orange-400 break-words select-none md:w-full md:text-lg md:text-[13px] md:text-center lg:text-sm">
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
      <div
        onClick={() => setShowDeleteConfirmationModal(true)}
        className="flex items-center justify-center w-20 text-gray-600 hover:text-red-500"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </div>
    </div>
  );
}
