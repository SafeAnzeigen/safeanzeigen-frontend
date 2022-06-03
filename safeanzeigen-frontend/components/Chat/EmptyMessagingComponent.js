import { useEffect, useState } from "react";
import Link from "next/link";

export default function MessagingComponent({}) {
  /* TODO: RECEIVE ALL MESSAGEOBJECTS(FROM_USER_ID, TEXT, TIMESTAMP) IN ONE MESSAGE ARRAY THEN CONDITIONALLY RENDER THEM FLEX JUSTIFY_START OR END AND IN DIFFERENT COLOR AND IN ORDER BY TIMESTAMP THUS IT WILL APPEAR LEFT RIGHT AND FROM/TO LIKE IN A CHAT APP */

  return (
    <div
      className="flex flex-col flex-1 p-4 mb-8 bg-gray-200 rounded-lg chat-area"
      style={{ height: "75vh" }}
    >
      <div className="flex justify-center opacity-50">
        <img
          src="/chat-empty.png"
          className="mb-2 not-draggable"
          alt="Indikator für keine vorhandenen Favoriten"
        />
      </div>
    </div>
  );
  S;
}
