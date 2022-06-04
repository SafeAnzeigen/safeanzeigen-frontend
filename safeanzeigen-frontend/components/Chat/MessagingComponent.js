import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getUnixTime, differenceInSeconds, fromUnixTime } from "date-fns";

import YourMessageComponent from "./YourMessageComponent";
import OtherContactMessageComponent from "./OtherContactMessageComponent";

export default function MessagingComponent({
  user,
  activeAdConversationRoomObject,
  messages,
  isTypingObject,
  callbackSendMessage,
  callbackSendIsTyping,
  callbackStoppedTyping,
}) {
  const [messageTextInput, setMessageTextInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log(
      "MESSAGECOMPONENT RECEIVED activeAdConversationRoomObject",
      activeAdConversationRoomObject
    );
    console.log("MESSAGECOMPONENT RECEIVED messages", messages);
    scrollToBottom();
  }, [messages]);

  /* TODO: RECEIVE ALL MESSAGEOBJECTS(FROM_USER_ID, TEXT, TIMESTAMP) IN ONE MESSAGE ARRAY THEN CONDITIONALLY RENDER THEM FLEX JUSTIFY_START OR END AND IN DIFFERENT COLOR AND IN ORDER BY TIMESTAMP THUS IT WILL APPEAR LEFT RIGHT AND FROM/TO LIKE IN A CHAT APP */

  /* TODO: window.scrollTo(0, document.body.scrollHeight);  WHEN? */

  {
    /* /* unreadMessage={true} */
    /* conversationLastDate="25. Mai" */
  }

  return (
    <div
      className="flex flex-col flex-1 p-4 mb-8 bg-gray-200 rounded-lg"
      style={{ height: "75vh" }}
    >
      <div className="pl-2 flex-3 ">
        <div className="flex items-center justify-between p-2 mt-2 mb-2 text-sm font-light text-gray-500 border-b-2 border-gray-200 rounded-lg opacity-80 bg-red-300/50 ">
          <div className="">
            <b className="select-none md:mr-4 text-[13px] md:text-sm">
              Wechsel nicht auf andere Chat-Dienst wie WhatsApp. Bevorzuge
              Barzahlung. Verschicke nie ins Ausland. PayPal nicht als Freunde
              benutzen.
            </b>
          </div>
        </div>
        <div className="flex items-center justify-between p-2 mb-2 text-sm text-orange-500 bg-gray-100 border-b-2 border-gray-200 rounded-lg md:text-xl md:p-4 ">
          <div>
            <b className="mr-4 select-none">
              {activeAdConversationRoomObject?.ad_title}
            </b>
            <b className="mr-1 text-gray-400 select-none">
              {activeAdConversationRoomObject?.ad_price_type}
            </b>
            <b className="text-gray-400 select-none">
              {activeAdConversationRoomObject?.ad_price},00
            </b>
          </div>

          <Link href={`/anzeige/${activeAdConversationRoomObject?.ad_id}`}>
            <button className="p-1 inline-flex items-center md:px-4 md:py-2 md:ml-6 md:text-sm font-medium text-white bg-[#2f70e9] border border-transparent rounded-md shadow-sm hover:bg-[#2962cd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-transparent cursor-pointer text-[13px]">
              Zur Anzeige
            </button>
          </Link>
        </div>
      </div>
      <div className="flex-1 pl-2 overflow-auto">
        {messages?.length > 0 && (
          <div>
            {messages
              /* ?.filter(
              (filteredMessage) =>
                filteredMessage?.ad_conversation_room_id ===
                activeAdConversationRoomObject?.ad_conversation_room_id
            ) */
              ?.sort(
                (a, b) => a?.message_sent_timestamp - b?.message_sent_timestamp
              )
              ?.map((message, index) => {
                if (message?.from_clerk_user_id === user?.id) {
                  return (
                    <div key={index}>
                      <YourMessageComponent
                        text={message?.text}
                        timestamp={message?.message_sent_timestamp}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={index}>
                      <OtherContactMessageComponent
                        clerk_user_id={message?.from_clerk_user_id}
                        text={message?.text}
                        timestamp={message?.message_sent_timestamp}
                      />
                    </div>
                  );
                }
              })}
            <div ref={messagesEndRef}></div>
          </div>
        )}
        {Object.keys(isTypingObject)?.length > 0 &&
          differenceInSeconds(
            new Date(),
            fromUnixTime(isTypingObject?.unix_timestamp)
          ) < 120 && (
            <div className="flex mb-4">
              <div className="flex-1 px-2">
                <div className="inline-block h-10 px-6 text-gray-700 bg-[#2f70e932] rounded-lg fley items-center">
                  <div className="flex items-center justify-center h-full pt-1">
                    <div className="w-3 h-3 animate-[bounce_2s_ease-out_infinite] mx-1 bg-blue-500 rounded-full"></div>
                    <div className="w-3 h-3 mx-1 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 animate-[bounce_2s_ease-out_infinite] mx-1 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
      <div className="pt-4 pb-4 flex-2">
        <div className="flex bg-white rounded-lg shadow">
          <div className="flex-1 text-gray-700 md:ml-2">
            <input
              onKeyUp={() => {
                if (messageTextInput?.length > 0) {
                  callbackSendIsTyping(user?.id, getUnixTime(new Date()));
                } else {
                  callbackStoppedTyping(user?.id, getUnixTime(new Date()));
                }
              }}
              onKeyDown={() => {
                if (event.key === "Enter") {
                  if (messageTextInput) {
                    callbackSendMessage(
                      activeAdConversationRoomObject?.ad_conversation_room_id,
                      messageTextInput
                    );
                    setMessageTextInput("");
                    callbackStoppedTyping(user?.id, getUnixTime(new Date()));
                  }
                }
              }}
              name="message"
              className="block w-full px-4 py-4 bg-transparent border-0 outline-none resize-none select-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent"
              placeholder="Schreibe eine Nachricht"
              autoFocus=""
              maxLength="1500"
              value={messageTextInput}
              onChange={(event) => setMessageTextInput(event.target.value)}
            />
          </div>
          <div className="flex items-center content-center w-32 p-2 flex-2">
            <div className="flex-1 text-center">
              <span className="text-gray-400 hover:text-gray-800">
                <span className="inline-block align-text-bottom cursor-pointer">
                  {/*  <svg
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg> */}
                </span>
              </span>
            </div>
            {/* <div className="flex-1 text-center">
              <span className="text-gray-400 cursor-pointer hover:text-gray-800">
                <span className="inline-block align-text-bottom">
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    className="w-6 h-6"
                  >
                    <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </span>
              </span>
            </div> */}
            <div className="flex-1">
              <button
                onClick={() => {
                  if (messageTextInput) {
                    callbackSendMessage(
                      activeAdConversationRoomObject?.ad_conversation_room_id,
                      messageTextInput
                    );
                    setMessageTextInput("");
                    callbackStoppedTyping(user?.id, getUnixTime(new Date()));
                  }
                }}
                className="inline-block w-10 h-10 text-white bg-orange-400 rounded-full hover:bg-orange-500"
              >
                <span className="inline-block align-text-bottom">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 ml-1 rotate-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
