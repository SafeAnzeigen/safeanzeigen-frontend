export default function MessagingComponent() {
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
