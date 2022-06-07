import React from "react";
import { fromUnixTime, format } from "date-fns";
import deLocale from "date-fns/locale/de";

export default function OtherContactMessageComponent({
  clerk_user_id,
  text,
  timestamp,
}) {
  return (
    <div className="flex mb-4">
      <div className="flex-2">
        <div className="relative w-12 h-12">
          <img
            className="w-12 h-12 mx-auto rounded-full select-none"
            src={`https://source.boringavatars.com/beam/300/${clerk_user_id}${clerk_user_id}${clerk_user_id}?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f`}
            alt="Identicon des anderen Chat-Benutzers"
          />
        </div>
      </div>
      <div className="flex-1 px-2">
        <div className="inline-block p-2 px-6 text-gray-700 bg-[#2f70e932] rounded-lg">
          <span>{text}</span>
        </div>
        <div className="pl-4">
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
