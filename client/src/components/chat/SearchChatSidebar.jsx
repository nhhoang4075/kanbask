/**
 * SearchChatSidebar component renders a sidebar for searching and selecting users to chat with.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Array} props.searchUsers - An array of user objects to display in the search results.
 * @param {Array} props.conversations - An array of existing conversation objects.
 * @param {Function} props.setCurrConv - A function to set the current conversation.
 * @param {Function} props.setSearchText - A function to clear or update the search text.
 *
 * @returns {JSX.Element} A sidebar component with a list of users to start or continue conversations.
 *
 * @example
 * const searchUsers = [
 *   { id: 1, fullname: "John Doe", avatar_url: "https://example.com/avatar1.png" },
 *   { id: 2, fullname: "Jane Smith", avatar_url: null }
 * ];
 * const conversations = [
 *   { id: "conv1", participants: [1, 2], messageIds: [], createdAt: "2023-01-01T00:00:00Z" }
 * ];
 * const setCurrConv = (conversation) => console.log(conversation);
 * const setSearchText = (text) => console.log(text);
 *
 * <SearchChatSidebar
 *   searchUsers={searchUsers}
 *   conversations={conversations}
 *   setCurrConv={setCurrConv}
 *   setSearchText={setSearchText}
 * />
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SearchChatSidebar({ searchUsers, conversations, setCurrConv, setSearchText }) {
    <div 
        className="absolute top-full left-0 right-0 z-50 flex flex-col gap-2 mt-2 h-fit max-h-60 overflow-auto bg-white shadow-lg border border-gray-300"
    >
        {searchUsers.map(user => (
            <button 
                key={user.id} 
                onClick={() => {
                    // Check if a conversation already exists with the user
                    const existingConv = conversations.find(conv => conv.participants.includes(user.id));
                    if (existingConv && existingConv.participants.length <= 2) {
                        setCurrConv(existingConv);
                    } else {
                        // If no conversation found, create a new temporary one
                        const newTempConv = {
                            id: "conv-temp", //set a temporary ID
                            teamId: "",
                            projectId: "",
                            participants: [currentId, user.id],
                            messageIds: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: "",
                        };
                        setCurrConv(newTempConv);
                    }
                    setSearchText("");
                }}
                className="flex gap-2 p-4 hover:bg-gray-400"
            >
                <Avatar className="flex-none h-5 w-5">
                    <AvatarImage src={user.avatar_url ? user.avatar_url : null} alt="" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                    <div className="font-bold">{user.fullname}</div>
                </div>
            </button>
        ))}
    </div>
}