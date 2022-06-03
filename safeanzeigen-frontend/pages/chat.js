import { useEffect, useState } from "react";
import Head from "next/head";
import { useUser } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import { getUnixTime } from "date-fns";

import Navigation from "../components/Navigation/Navigation";
import ConversationCard from "../components/Chat/ConversationCard";
import MessagingComponent from "../components/Chat/MessagingComponent";
import EmptyMessagingComponent from "../components/Chat/EmptyMessagingComponent";
import Footer from "../components/Footer/Footer";

/* TODO: FETCH ALL CONVERSATIONS FROM DB WHERE ROOM_CREATOR_IS_YOUR CLERK ID */

const mockedAdConversationRoomArray = [
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
];

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
  const [activeAdConversationRoomObject, setActiveAdConversationRoomObject] =
    useState({
      ad_conversation_room_id: "ad7884e7-e256-4671-8018-260feaef37ce+firstchat",
      ad_id: "ad7884e7-e256-4671-8018-260feaef37ce",
      ad_title: "Stoff Eule",
      ad_price_type: "VB",
      ad_price: 5,
      room_creator_clerk_user_id: "user_29RqPdIoafnCM7Cjpgia8nW8Ul3",
      room_creator_full_name: "Sascha Majewsky",
      created_at_timestamp: "1654214580",
    });
  const [messagesObjectArray, setMessagesObjectArray] =
    useState(mockedMessages);

  /* const joinAdConversationRoom = (
    adConversationRoomId,
    adId,
    adTitle,
    priceType,
    price,
    roomCreatorClerkUserId,
    roomCreatorFullName,
    createdAtTimestamp
  ) => {
    console.log("JOINING ROOM", adConversationRoomId);
    socket.emit("join", {
      ad_conversation_room_id: adConversationRoomId,
      from_clerk_user_id: user?.id,
      join_timestamp: getUnixTime(new Date()),
    });
    setActiveAdConversationRoomObject({
      adConversationRoomId,
      adId,
      adTitle,
      priceType,
      price,
      roomCreatorClerkUserId,
      roomCreatorFullName,
      createdAtTimestamp,
    });
  }; */

  const sendMessage = (adConversationRoomId, text) => {
    socket.emit("message", {
      ad_conversation_room_id: adConversationRoomId,
      from_clerk_user_id: user?.id,
      text,
      message_sent_timestamp: getUnixTime(new Date()),
    });
  };

  const addIncomingMessage = (messageObject) => {
    setMessagesObjectArray((prevArray) => [...prevArray, messageObject]);
  };

  useEffect(() => {
    if (socket == null) {
      socket = io(process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL, {
        query: { id: user?.id },
      });

      socket.on("receive-message", (messageObject) => {
        addIncomingMessage(messageObject);
      });
    } /* Close socket to prevent duplicate messages */

    /* return () =>
      newSocket.close(); */
  }, []);

  return (
    <div className="min-h-screen overflow-y-hidden">
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
      <div className="w-full h-min">
        <div className="flex h-min">
          <div className="flex-1 w-full h-screen bg-gray-100">
            <div className="container flex flex-col w-11/12 m-auto h-min">
              <div className="flex flex-row py-2 flex-2 lg:invisible">
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
              </div>
              <div className="flex flex-col flex-1">
                <div className="hidden lg:block heading flex-2">
                  <h1 className="mb-4 text-3xl text-gray-700">
                    Konversationen
                  </h1>
                </div>
                <div className="flex flex-1 h-full">
                  <div className="flex-col hidden w-1/3 pr-6 lg:flex flex-2">
                    <div
                      className="flex-1 h-full p-4 overflow-auto overflow-x-hidden"
                      style={{ maxHeight: "75vh" }}
                    >
                      {mockedAdConversationRoomArray.map(
                        (mockedConversationRoom, index) => (
                          <div key={index}>
                            {/*  <ConversationCard
                              adConversationRoomId={
                                mockedConversationRoom.ad_conversation_room_id
                              }
                              adId={mockedConversationRoom.ad_id}
                              adTitle={mockedConversationRoom.ad_title}
                              adPriceType={mockedConversationRoom.ad_price_type}
                              adPrice={mockedConversationRoom.ad_price}
                              roomCreatorClerkUserId={
                                mockedConversationRoom.room_creator_clerk_user_id
                              }
                              roomCreatorFullName={
                                mockedConversationRoom.room_creator_full_name
                              }
                              createdAtTimestamp={
                                mockedConversationRoom.created_at_timestamp
                              }
                              callbackJoinAdConversationRoom={(returnValue) => {
                                console.log(
                                  "mocked joinAdConversationRoom",
                                  returnValue
                                );
                              }}
                            /> */}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  {activeAdConversationRoomObject && user ? (
                    <MessagingComponent
                      user={user}
                      activeAdConversationRoomObject={
                        activeAdConversationRoomObject
                      }
                      messages={messagesObjectArray}
                      callbackSendMessage={sendMessage}
                      callbackSendIsTyping={() => {}}
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
      <Footer />
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
