import { useEffect, useState } from "react";
import Head from "next/head";
import { useUser, useAuth } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import { getUnixTime } from "date-fns";

import Navigation from "../components/Navigation/Navigation";
import ConversationCard from "../components/Chat/ConversationCard";
import MessagingComponent from "../components/Chat/MessagingComponent";
import EmptyMessagingComponent from "../components/Chat/EmptyMessagingComponent";
import Footer from "../components/Footer/Footer";

/* TODO: FETCH ALL CONVERSATIONS FROM DB WHERE ROOM_CREATOR_IS_YOUR CLERK ID */

const mockedMessages = [
  {
    ad_conversation_room_id: "ad7884e7-e256-4671-8018-260feaef37ce+firstchat",
    from_clerk_user_id: "user_29ttE7esltvcikdx85jn1uBth96",
    text: "Moin",
    message_sent_timestamp: "1654214582",
  },
  {
    ad_conversation_room_id: "ad7884e7-e256-4671-8018-260feaef37ce+firstchat",
    from_clerk_user_id: "user_29ttE7esltvcikdx85jn1uBth96",
    text: "Ich habe eine Frage bzgl. deiner Anzeige",
    message_sent_timestamp: "1654214583",
  },
  {
    ad_conversation_room_id: "ad7884e7-e256-4671-8018-260feaef37ce+firstchat",
    from_clerk_user_id: "user_29RqPdIoafnCM7Cjpgia8nW8Ul3",
    text: "Moin",
    message_sent_timestamp: "1654214584",
  },
  {
    ad_conversation_room_id: "ad7884e7-e256-4671-8018-260feaef37ce+firstchat",
    from_clerk_user_id: "user_29RqPdIoafnCM7Cjpgia8nW8Ul3",
    text: "Klar, was interessiert dich denn?",
    message_sent_timestamp: "1654214585",
  },
  {
    ad_conversation_room_id: "ad7884e7-e256-4671-8018-260feaef37ce+firstchat",
    from_clerk_user_id: "user_29ttE7esltvcikdx85jn1uBth96",
    text: "Ich wollte fragen wie lange du die Stoff Eule schon besitzt.",
    message_sent_timestamp: "1654214586",
  },
];

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

  const retrieveConversationsAndCreateSocket = async (userData) => {
    if (userData?.id) {
      /* FETCHING CHATS AS AD BUYER */
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
        .then(async (data) => {
          console.log("DATA RETRIEVING USERS AD BUYER CHATS", data);
          if (data?.chats?.length) {
            console.log("TRIGGERED I AM OWNER OF AT LEAST ONE BUYER CHAT");
            setConversationsRoomsArray(data?.chats);
            setActiveAdConversationRoomObject(data?.chats[0]);
            /* FETCHING CHATS AS AD OWNER */
            console.log(
              "AFTER SETTING CONVERSATIONS ROOMS ARRAY",
              conversationsRoomsArray
            );
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
                  console.log(
                    "TRIGGERED I AM OWNER OF AT LEAST ONE OWNER CHAT"
                  );
                  let newConversationsRoomsArray =
                    conversationsRoomsArray.concat(data?.chats);
                  console.log(
                    "DATA RETRIEVING USERS AD OWNER CHATS newConversationsRoomsArray",
                    newConversationsRoomsArray
                  );
                  setConversationsRoomsArray(newConversationsRoomsArray, () => {
                    setActiveAdConversationRoomObject(data?.chats[0], () => {
                      /* startSocket(data?.chats[0]); */
                    });
                  });
                } else {
                  /* startSocket(activeAdConversationRoomObject); */
                }
              });
          } else {
            async () => {
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
                    setConversationsRoomsArray(data?.chats, () => {
                      setActiveAdConversationRoomObject(data?.chats[0], () => {
                        /*  startSocket(data?.chats[0]); */
                      });
                    });
                  }
                });
            };
          }
        })
        .catch((error) => {
          console.log("ERROR RETRIEVING USERS AD BUYER CHATS", error);
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
          }
        })
        .catch((error) => {
          console.log("ERROR DATA RETRIEVE MESSAGES", error);
        });
    }
  };

  useEffect(() => {
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
                className="flex items-center justify-around w-3/4 h-8 mx-auto mt-2 mb-2 bg-orange-100 rounded-lg md:hidden"
              >
                <div className="flex text-orange-400 hover:text-orange-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 mt-1 ${
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
              {/* <div className="flex flex-row py-2 flex-2 lg:invisible">
                <span className="inline-block text-gray-700 align-bottom xl:hidden hover:text-gray-900">
                  <span className="flex items-center justify-center w-6 h-6 p-1 border-2 border-gray-400 rounded-md hover:bg-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </span>
                </span>
              </div> */}
              <div className="flex flex-col flex-1 ">
                <div className="hidden lg:block heading flex-2">
                  <h1 className="mb-4 text-3xl text-gray-700">
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

/*  const createAdConversationRoom = (
    advertisementId,
    advertisementTitle,
    priceType,
    price,
    user,
    fullName
  ) => {
    socket.emit("create-ad-conversation-room", {
      ad_conversation_room_id:
        advertisementId + "+" + (Math.random() + 1).toString(36).substring(7),
      ad_id: advertisementId,
      ad_title: advertisementTitle,
      price_type: priceType,
      price: price,
      room_creator_clerk_user_id: user?.id,
      room_creator_full_name: fullName,
      created_at_timestamp: getUnixTime(new Date()),
    });
  };

   */

/* {
      ad_conversation_room_id: "ad7884e7-e256-4671-8018-260feaef37ce+firstchat",
      ad_id: "ad7884e7-e256-4671-8018-260feaef37ce",
      ad_title: "Stoff Eule",
      ad_price_type: "VB",
      ad_price: 5,
      room_creator_clerk_user_id: "user_29RqPdIoafnCM7Cjpgia8nW8Ul3",
      room_creator_full_name: "Sascha Majewsky",
      created_at_timestamp: "1654214580",
    } */

/*   const mockedAdConversationRoomArray = [
      {
        ad_conversation_room_id: "ad7884e7-e256-4671-8018-260feaef37ce+firstchat",
        ad_id: "ad7884e7-e256-4671-8018-260feaef37ce",
        ad_title: "Stoff Eule",
        ad_price_type: "VB",
        ad_price: 5,
        room_creator_clerk_user_id: "user_29RqPdIoafnCM7Cjpgia8nW8Ul3",
        room_creator_full_name: "Sascha Majewsky",
        created_at_timestamp: "1654214580",
      },
      {
        ad_conversation_room_id: "ad7884e7-e256-4671-8018-260feaef37ce+secondchat",
        ad_id: "ad7884e7-e256-4671-8018-260feaef37ce",
        ad_title: "Stoff Eule",
        ad_price_type: "VB",
        ad_price: 5,
        room_creator_clerk_user_id: "user_29RqPdIoafnCM7Cjpgia8nW8Ul3",
        room_creator_full_name: "Hanne Oellrich",
        created_at_timestamp: "1654214582",
      },
      {
        ad_conversation_room_id: "61cf3ae2-1779-4037-bb29-8194fab6fa66+test",
        ad_id: "61cf3ae2-1779-4037-bb29-8194fab6fa66",
        ad_title: "Hue Go 2",
        ad_price_type: "VB",
        ad_price: 40,
        room_creator_clerk_user_id: "user_29yCWbPeGmJNDNxUmGVDYhtQ0A3",
        room_creator_full_name: "Hanne Oellrich",
        created_at_timestamp: "1654214584",
      },
    ]; */
