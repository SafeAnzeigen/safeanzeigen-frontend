import { useEffect, useState } from "react";
import Head from "next/head";
import { useUser, useAuth } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import { getUnixTime } from "date-fns";

import Navigation from "../components/Navigation/Navigation";
import ConversationCard from "../components/Chat/ConversationCard";
import MessagingComponent from "../components/Chat/MessagingComponent";
import EmptyMessagingComponent from "../components/Chat/EmptyMessagingComponent";

/* TODO: FETCH ALL CONVERSATIONS FROM DB WHERE ROOM_CREATOR_IS_YOUR CLERK ID */

/* TODO: WHAT ABOUT THE ONES WHERE ANOTHER USER CONTACTS YOU FOR YOUR AD? */
let socket = null;
export default function Chat() {
  const { user } = useUser();
  const clerkAuth = useAuth();
  const [activeAdConversationRoomObject, setActiveAdConversationRoomObject] =
    useState({});
  const [messagesObjectArray, setMessagesObjectArray] = useState([]);
  const [isTypingObject, setIsTypingObject] = useState({});
  const [conversationsRoomsArray, setConversationsRoomsArray] = useState([]);
  const [socketRoomID, setSocketRoomID] = useState("");
  const [showMobileConversationCards, setShowMobileConversationCards] =
    useState(false);

  const handleSetActiveAdConversationRoomObject = (
    receivedConversationObject
  ) => {
    console.log("receivedConversationObject", receivedConversationObject);
    setActiveAdConversationRoomObject({
      ad_conversation_room_id: receivedConversationObject.adConversationRoomId,
      ad_id: receivedConversationObject.adId,
      ad_title: receivedConversationObject.adTitle,
      ad_price_type: receivedConversationObject.adPriceType,
      ad_price: receivedConversationObject.adPrice,
      room_creator_clerk_user_id:
        receivedConversationObject.roomCreatorClerkUserId,
      created_at_timestamp: receivedConversationObject.createdAtTimestamp,
    });
  };

  const addIncomingMessage = (messageObject) => {
    setMessagesObjectArray((prevArray) => [...prevArray, messageObject]);
  };

  const addIncomingIsTyping = (isTypingObject) => {
    console.log("isTypingObject ADD", isTypingObject);
    if (isTypingObject.clerk_user_id !== user?.id) {
      setIsTypingObject(isTypingObject);
    }
  };

  const addIncomingStoppedTyping = (stoppedTypingObject) => {
    console.log("stoppedTypingObject ADD", stoppedTypingObject);
    if (isTypingObject.clerk_user_id !== user?.id) {
      setIsTypingObject({});
    }
  };

  const sendMessage = (adConversationRoomId, text) => {
    console.log("TRIGGERED SEND MESSAGE");
    socket.emit("message", {
      ad_conversation_room_id: adConversationRoomId,
      from_clerk_user_id: user?.id,
      text,
      message_sent_timestamp: getUnixTime(new Date()),
    });
  };

  const sendIsTyping = (clerk_user_id, unix_timestamp) => {
    socket.emit("is-typing", {
      clerk_user_id: clerk_user_id,
      unix_timestamp: unix_timestamp,
    });
  };

  const sendStoppedTyping = (clerk_user_id, unix_timestamp) => {
    socket.emit("stopped-typing", {
      clerk_user_id: clerk_user_id,
      unix_timestamp: unix_timestamp,
    });
  };

  const startSocket = (providedActiveAdConversationRoomObject) => {
    setSocketRoomID(
      providedActiveAdConversationRoomObject?.ad_conversation_room_id
    );
    socket = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL, {
      query: {
        id: providedActiveAdConversationRoomObject?.ad_conversation_room_id,
      },
    });

    socket.on("receive-message", (messageObject) => {
      addIncomingMessage(messageObject);
    });
    socket.on("receive-is-typing", (isTypingObject) => {
      addIncomingIsTyping(isTypingObject);
    });

    socket.on("receive-stopped-typing", (stoppedTypingObject) => {
      addIncomingStoppedTyping(stoppedTypingObject);
    });
  };

  const retrieveChatsAsBuyer = (userData) =>
    new Promise(async (resolve, reject) => {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` + `/chats/${userData?.id}`,
        {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${await clerkAuth.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA RETRIEVING USERS AD BUYER CHATS", data);
          if (data?.chats?.length) {
            console.log("TRIGGERED I AM OWNER OF AT LEAST ONE BUYER CHAT");
            resolve(data?.chats);
          } else {
            console.log("TRIGGERED I DO NOT OWN BUYER CHATS");
            resolve([]);
          }
        })
        .catch((error) => {
          console.log("ERROR DURING RETRIEVING USERS AD BUYER CHATS", error);
          reject(error);
        });
    });

  const retrieveChatsAsOwner = (userData) =>
    new Promise(async (resolve, reject) => {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/chats/ownerofad/${userData?.id}`,
        {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${await clerkAuth.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA RETRIEVING USERS AD OWNER CHATS", data);
          if (data?.chats?.length) {
            console.log("TRIGGERED I AM OWNER OF AT LEAST ONE OWNER CHAT");
            resolve(data?.chats);
          } else {
            console.log("TRIGGERED I DO NOT OWN OWNER CHATS");
            resolve([]);
          }
        })
        .catch((error) => {
          console.log("ERROR DURING RETRIEVING USERS AD OWNER CHATS", error);
          reject(error);
        });
    });

  const retrieveConversationsAndCreateSocket = (userData) => {
    if (userData?.id) {
      let tempRetrievedConversationsArray = [];
      retrieveChatsAsBuyer(userData)
        .then((retrievedChatsAsBuyer) => {
          if (retrievedChatsAsBuyer?.length) {
            tempRetrievedConversationsArray =
              tempRetrievedConversationsArray.concat(retrievedChatsAsBuyer);
          }

          retrieveChatsAsOwner(userData)
            .then((retrievedChatsAsOwner) => {
              if (retrievedChatsAsOwner?.length) {
                tempRetrievedConversationsArray =
                  tempRetrievedConversationsArray.concat(retrievedChatsAsOwner);
              }
              console.log(
                "BEFORE EVALUTION tempRetrievedConversationsArray",
                tempRetrievedConversationsArray
              );
              if (tempRetrievedConversationsArray.length) {
                console.log(
                  "I HAVE FOUND CONVERSATIONS",
                  tempRetrievedConversationsArray
                );
                /*  */

                setConversationsRoomsArray(tempRetrievedConversationsArray);
                setActiveAdConversationRoomObject(
                  tempRetrievedConversationsArray[0]
                );
              }
            })
            .catch((error) => {
              console.log("ERROR FETCH ADS AS OWNER", error);
            });
        })
        .catch((error) => {
          console.log("ERROR FETCH ADS AS BUYER", error);
        });
    }
  };

  const tryRetrieveConversationRooMessages = async (
    activeAdConversationRoomObject
  ) => {
    if (activeAdConversationRoomObject?.ad_conversation_room_id) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/messages/${activeAdConversationRoomObject?.ad_conversation_room_id}`,
        {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${await clerkAuth.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA RETRIEVE MESSAGES", data);
          if (data?.messages) {
            setMessagesObjectArray(data?.messages);
          } else {
            setMessagesObjectArray([]);
          }
        })
        .catch((error) => {
          console.log("ERROR DATA RETRIEVE MESSAGES", error);
        });
    }
  };

  const setUserVisitedChatPage = async (userData) => {
    if (userData?.id) {
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}` +
          `/users/visitedchat/${userData?.id}`,
        {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `${await clerkAuth.getToken()}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("DATA SET VISIT CHAT TIMESTAMP", data);
        })
        .catch((error) => {
          console.log("ERROR DATA SET VISIT CHAT TIMESTAMP", error);
        });
    }
  };

  useEffect(() => {
    if (user?.id) {
      setUserVisitedChatPage(user);
    }

    if (socket == null) {
      console.log(
        "SOCKET START ON ROOM activeAdConversationRoomObject?.ad_conversation_room_id ",
        activeAdConversationRoomObject?.ad_conversation_room_id
      );

      retrieveConversationsAndCreateSocket(user);
    } /* Close socket to prevent duplicate messages  test2*/

    /* return () =>
      newSocket.close(); */
  }, []);

  useEffect(() => {
    console.log("USEEFFECT CONVO CHANGE socketRoomID", socketRoomID);
    console.log(
      "USEEFFECT CONVO CHANGE activeAdConversationRoomObject?.ad_conversation_room_id",
      activeAdConversationRoomObject?.ad_conversation_room_id
    );
    if (socket) {
      console.log("CASE SOCKET EXISTS", socket);
      if (
        socketRoomID !==
          activeAdConversationRoomObject?.ad_conversation_room_id &&
        activeAdConversationRoomObject?.ad_conversation_room_id
      ) {
        console.log(
          "CASE SOCKET ROOM DIFFERENT activeAdConversationRoomObject?.ad_conversation_room_id",
          activeAdConversationRoomObject?.ad_conversation_room_id
        );
        tryRetrieveConversationRooMessages(activeAdConversationRoomObject);
        socket.emit("exit");
        startSocket(activeAdConversationRoomObject);
      } else {
        if (!activeAdConversationRoomObject?.ad_conversation_room_id) {
          retrieveConversationsAndCreateSocket(user);
        }
      }
    } else {
      if (Object.keys(activeAdConversationRoomObject)?.length) {
        console.log("CASE SOCKET DIDNT EXIST", conversationsRoomsArray);
        tryRetrieveConversationRooMessages(activeAdConversationRoomObject);
        startSocket(activeAdConversationRoomObject);
      }
    }
  }, [activeAdConversationRoomObject]);

  return (
    <div className="min-h-screen overflow-y-hidden bg-white">
      <Head>
        <title>
          Safeanzeigen - Wir bringen Ihre Kleinanzeigen mit Sicherheit groß
          raus!s
        </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="theme-color" content="#2f70e9" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>

      <Navigation />
      <div className="w-full bg-white">
        <div className="flex h-min">
          <div className="flex-1 w-full ">
            <div className="container flex flex-col w-11/12 m-auto h-min">
              <div
                onClick={() =>
                  setShowMobileConversationCards(!showMobileConversationCards)
                }
                className="flex items-center justify-around w-3/4 h-8 mx-auto mt-2 mb-2 bg-gray-100 rounded-lg md:hidden"
              >
                <div className="flex text-blue-400 hover:text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition transform ease-in-out w-5 h-5 mt-1 ${
                      showMobileConversationCards ? "rotate-0" : "-rotate-90"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <div className="ml-2 font-bold ">Konversationen anzeigen</div>
                </div>
              </div>

              <div className="grid p-4 -mt-4 -ml-4 space-x-1 overflow-scroll md:-mt-2 md:hidden scrollbar-hide">
                {showMobileConversationCards &&
                  conversationsRoomsArray.map((conversationRoom, index) => (
                    <div key={index}>
                      <ConversationCard
                        adConversationRoomId={
                          conversationRoom.ad_conversation_room_id
                        }
                        adId={conversationRoom.ad_id}
                        adTitle={conversationRoom.ad_title}
                        adPriceType={conversationRoom.ad_price_type}
                        adPrice={conversationRoom.ad_price}
                        roomCreatorClerkUserId={
                          conversationRoom.room_creator_clerk_user_id
                        }
                        createdAtTimestamp={
                          conversationRoom.created_at_timestamp
                        }
                        callbackSetActiveConversationRoomObject={
                          handleSetActiveAdConversationRoomObject
                        }
                      />
                    </div>
                  ))}
              </div>
              <div className="flex flex-col flex-1 ">
                <div className="hidden lg:block heading flex-2">
                  <h1 className="mb-4 text-3xl text-gray-700 select-none">
                    Konversationen
                  </h1>
                </div>
                <div className="flex flex-1 h-full">
                  <div className="flex-col hidden w-1/3 pr-6 md:flex flex-2">
                    {console.log(
                      "conversationsRoomsArray",
                      conversationsRoomsArray
                    )}
                    <div
                      className="flex-1 h-full p-4 overflow-auto overflow-x-hidden"
                      style={{ maxHeight: "75vh" }}
                    >
                      {conversationsRoomsArray.map(
                        (conversationRoom, index) => (
                          <div key={index}>
                            <ConversationCard
                              adConversationRoomId={
                                conversationRoom.ad_conversation_room_id
                              }
                              adId={conversationRoom.ad_id}
                              adTitle={conversationRoom.ad_title}
                              adPriceType={conversationRoom.ad_price_type}
                              adPrice={conversationRoom.ad_price}
                              roomCreatorClerkUserId={
                                conversationRoom.room_creator_clerk_user_id
                              }
                              createdAtTimestamp={
                                conversationRoom.created_at_timestamp
                              }
                              callbackSetActiveConversationRoomObject={
                                handleSetActiveAdConversationRoomObject
                              }
                              isActive={
                                activeAdConversationRoomObject &&
                                activeAdConversationRoomObject?.ad_conversation_room_id ===
                                  conversationRoom.ad_conversation_room_id
                              }
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  {Object.keys(activeAdConversationRoomObject)?.length &&
                  user ? (
                    <MessagingComponent
                      user={user}
                      activeAdConversationRoomObject={
                        activeAdConversationRoomObject
                      }
                      messages={messagesObjectArray}
                      isTypingObject={isTypingObject}
                      callbackSendMessage={sendMessage}
                      callbackSendIsTyping={sendIsTyping}
                      callbackStoppedTyping={sendStoppedTyping}
                    />
                  ) : (
                    <EmptyMessagingComponent />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
