import Link from "next/link";

export default function MessagingComponent({ nameOfAd, adURL }) {
  return (
    <div
      className="flex flex-col flex-1 p-4 mb-8 bg-gray-200 rounded-lg chat-area"
      style={{ height: "75vh" }}
    >
      <div className="pl-2 flex-3 ">
        <h2 className="py-1 mb-8 text-xl text-orange-500 border-b-2 border-gray-200">
          <Link href={adURL}>
            <b className="cursor-pointer">{nameOfAd}</b>
          </Link>
        </h2>
      </div>
      <div className="flex-1 pl-2 overflow-auto messages">
        <div className="flex mb-4 message">
          <div className="flex-2">
            <div className="relative w-12 h-12">
              <img
                className="w-12 h-12 mx-auto rounded-full"
                src="https://source.boringavatars.com/beam/300/user_29RqPdIoafnCM7Cjpgia8nW8Ul3user_29RqPdIoafnCM7Cjpgia8nW8Ul3user_29RqPdIoafnCM7Cjpgia8nW8Ul3?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f"
                alt="chat-user"
              />
            </div>
          </div>
          <div className="flex-1 px-2">
            <div className="inline-block p-2 px-6 text-gray-700 bg-[#2f70e932] rounded-full">
              <span>Hallo</span>
            </div>
            <div className="pl-4">
              <small className="text-gray-500">15 April</small>
            </div>
          </div>
        </div>
        <div className="flex mb-4 message">
          <div className="flex-2">
            <div className="relative w-12 h-12">
              <img
                className="w-12 h-12 mx-auto rounded-full"
                src="https://source.boringavatars.com/beam/300/user_29RqPdIoafnCM7Cjpgia8nW8Ul3user_29RqPdIoafnCM7Cjpgia8nW8Ul3user_29RqPdIoafnCM7Cjpgia8nW8Ul3?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f"
                alt="chat-user"
              />
            </div>
          </div>
          <div className="flex-1 px-2">
            <div className="inline-block p-2 px-6 text-gray-700 bg-[#2f70e932] rounded-full">
              <span>Ich habe eine Frage bzgl. deiner Anzeige</span>
            </div>
            <div className="pl-4">
              <small className="text-gray-500">15 April</small>
            </div>
          </div>
        </div>
        <div className="flex mb-4 text-right message me">
          <div className="flex-1 px-2">
            <div className="inline-block p-2 px-6 text-white bg-orange-400 rounded-full">
              <span>Moin</span>
            </div>
            <div className="pr-4">
              <small className="text-gray-500">15 April</small>
            </div>
          </div>
        </div>
        <div className="flex mb-4 text-right message me">
          <div className="flex-1 px-2">
            <div className="inline-block p-2 px-6 text-white bg-orange-400 rounded-full">
              <span>Klar, was interessiert dich denn?</span>
            </div>
            <div className="pr-4">
              <small className="text-gray-500">15 April</small>
            </div>
          </div>
        </div>
        <div className="flex mb-4 message">
          <div className="flex-2">
            <div className="relative w-12 h-12">
              <img
                className="w-12 h-12 mx-auto rounded-full"
                src="https://source.boringavatars.com/beam/300/user_29RqPdIoafnCM7Cjpgia8nW8Ul3user_29RqPdIoafnCM7Cjpgia8nW8Ul3user_29RqPdIoafnCM7Cjpgia8nW8Ul3?colors=2f70e9,e76f51,ffc638,f4a261,e97c2f"
                alt="chat-user"
              />
            </div>
          </div>
          <div className="flex-1 px-2">
            <div className="inline-block p-2 px-6 text-gray-700 bg-[#2f70e932] rounded-full">
              <span>
                Ich wollte fragen wie lange du die Kamera schon besitzt.
              </span>
            </div>
            <div className="pl-4">
              <small className="text-gray-500">15 April</small>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4 pb-4 flex-2">
        <div className="flex bg-white rounded-lg shadow write">
          <div className="flex items-center content-center p-4 pr-0 text-center cursor-pointer flex-3">
            <span className="block text-center text-gray-400 hover:text-gray-800">
              <svg
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-6 h-6"
              >
                <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="flex-1 text-gray-700">
            <textarea
              name="message"
              className="block w-full px-4 py-4 bg-transparent border-0 outline-none resize-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-transparent"
              rows={1}
              placeholder="Schreibe eine Nachricht"
              autoFocus=""
              defaultValue={""}
            />
          </div>
          <div className="flex items-center content-center w-32 p-2 flex-2">
            <div className="flex-1 text-center">
              <span className="text-gray-400 hover:text-gray-800">
                <span className="inline-block align-text-bottom cursor-pointer">
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </span>
              </span>
            </div>
            <div className="flex-1 text-center">
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
            </div>
            <div className="flex-1">
              <button className="inline-block w-10 h-10 text-white bg-orange-400 rounded-full hover:bg-orange-500">
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
