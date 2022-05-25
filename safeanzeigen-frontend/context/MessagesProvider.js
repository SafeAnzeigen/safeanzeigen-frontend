import { createContext, useContext, useState } from "react";

const MessagesContext = createContext();

export function useMessages() {
  return useContext(MessagesContext);
}

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([]);

  function createMessage(recipients) {
    setMessages((prevMessage) => {
      return [...prevMessage, { recipients, messages: [] }];
    });
  }
  return (
    <MessagesContext.Provider value={{ messages, createMessage }}>
      <>{children}</>
    </MessagesContext.Provider>
  );
}
