import Chat from "@/components/test/Chat";

const getMessages = async (conversationId) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${conversationId}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    console.log("nn");
  }

  const { success, data } = await res.json();

  if (success) {
    return data.messages;
  }

  return null;
};

export default async function TestPage({ params }) {
  const { userId } = await params;

  // Giả sử userId được lấy từ phiên đăng nhập
  // const userId = "fcb6c246-66dc-46c6-b612-db580c0fc1e2";
  // Giả sử conversationId của chat giữa user và đối tác
  const conversationId = 2;

  const messageData = await getMessages(conversationId);

  return (
    <div>
      <h1>Chat Demo</h1>
      <Chat
        conversationId={conversationId}
        userId={userId}
        messageData={messageData}
      />
    </div>
  );
}
