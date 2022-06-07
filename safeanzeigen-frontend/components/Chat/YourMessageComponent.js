import React from "react";
import { fromUnixTime, format } from "date-fns";
import deLocale from "date-fns/locale/de";

export default function YourMessageComponent({ text, timestamp }) {
  return (
    <div className="flex mb-4 text-right md:mr-2">
      <div className="flex-1 px-2">
        <div className="inline-block p-2 px-6 text-white bg-orange-400 rounded-lg">
          <span>{text}</span>
        </div>
        <div className="pr-4">
          <small className="text-gray-500 select-none">
            {timestamp &&
              format(fromUnixTime(timestamp), "dd MMMM", {
                locale: deLocale,
              })}
          </small>
        </div>
      </div>
    </div>
  );
}

YourMessageComponent;
