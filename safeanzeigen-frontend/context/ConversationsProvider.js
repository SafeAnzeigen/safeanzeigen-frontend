import { createContext, useContext, useState } from "react";

const ConversationsContext = createContext();

export function useConversations() {
  return useContext(ConversationsContext);
}

export function ConversationsProvider({ children }) {
  const [conversations, setConversations] = useState([]);

  function createConversation(id, conversationName) {
    setConversations((prevConversations) => {
      return [...prevConversations, { id, conversationName }];
    });
  }
  return (
    <ConversationsContext.Provider
      value={{ conversations, createConversation }}
    >
      <>{children}</>
    </ConversationsContext.Provider>
  );
}
