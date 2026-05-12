import Chat from "@/components/test/Chat";
import Sidebar from "@/components/test/Sidebar";

const getConversations = async (userId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/conversations?user_id=${userId}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) return null;

    const { success, data } = await res.json();

    if (success) {
      return data.conversations;
    }

    return null;
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

const getMessages = async (conversationId) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/messages/${conversationId}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) return null;

    const { success, data } = await res.json();

    if (success) {
      return data.messages;
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

export default async function TestPage({ params }) {
  let { userId, conversationId } = await params;

  const conversations = await getConversations(userId);

  if (!conversationId) {
    conversationId = conversations[0].id;
  }

  const messageData = await getMessages(conversationId);

  const currentConversation = conversations.filter(
    (c) => c.id.toString() === conversationId
  )[0];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        userId={userId}
        conversationData={conversations}
        currentConversationId={conversationId}
      />
      <Chat
        userId={userId}
        currentConversation={currentConversation}
        messageData={messageData}
      />
    </div>
  );
}
