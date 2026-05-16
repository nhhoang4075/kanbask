"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo
} from "react";
import {
  getConversationsFromUserId,
  getParticipantsOfConversation
} from "@/lib/ConversationActions";
import { getOneUserById } from "@/lib/UserActions";
import { getManyMessagesByConversationId } from "@/lib/MessageActions";
import { useSession } from "next-auth/react";

const ChatDataContext = createContext(null);

export function ChatDataProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currConv, setCurrConv] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [observedMessage, setObservedMessage] = useState([]);
  const [currUser, setCurrUser] = useState(null);
  const [allParticipants, setAllParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cache the last user ID to avoid unnecessary rerenders
  const userIdRef = useRef(null);
  const dataLoaded = useRef(false);
  const activeRequests = useRef({
    conversations: false,
    messages: {},
    allActive: false
  });

  // References and session data
  const { data: sessionData } = useSession();
  const currentUserId = sessionData?.user?.id;
  const convContainerRef = useRef(null);

  // Fetch conversations when user ID changes (with optimization)
  useEffect(() => {
    if (!currentUserId) return;
    if (userIdRef.current === currentUserId) return;
    if (dataLoaded.current.allActive) return;
    userIdRef.current = currentUserId;
    setLoading(true);

    // Define a function to load everything at once
    const loadAllData = async () => {
      try {
        // 1. Get conversations
        const fetchedConversations = await getConversationsFromUserId(currentUserId);

        console.log("Fetched conversations:", fetchedConversations);
        // 2. Get current user data
        const fetchedUser = await getOneUserById(currentUserId);

        // 3. Get participants id for each conversation
        const participantsIdPromises = fetchedConversations?.map(async (conv) => {
          const participantsId = await getParticipantsOfConversation(conv.id);
          return participantsId;
        });
        const participantsId = await Promise.all(participantsIdPromises);
        console.log("Participants ID:", participantsId);
        // 4. Get participants for each conversation
        const allParticipantsPromise = participantsId?.map(async (participants) => {
          const users = await Promise.all(participants.map((user) => getOneUserById(user.user_id)));
          return users;
        });
        const allParticipants = await Promise.all(allParticipantsPromise);
        console.log("All participants:", allParticipants);

        setConversations(fetchedConversations || []);
        setCurrUser(fetchedUser);
        setAllParticipants(allParticipants || []);

        dataLoaded.current = true;
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
        activeRequests.current.allActive = false;
      }
    };
    loadAllData();
  }, [currentUserId]);

  // Fetch messages with debouncing
  const fetchMessagesDebounceTimer = useRef(null);

  const fetchMessagesForConversation = useCallback(async (conversationId) => {
    if (!conversationId) return [];

    // Clear any pending fetch
    if (fetchMessagesDebounceTimer.current) {
      clearTimeout(fetchMessagesDebounceTimer.current);
    }

    // Debounce the fetch to prevent rapid successive calls
    return new Promise((resolve) => {
      fetchMessagesDebounceTimer.current = setTimeout(async () => {
        try {
          console.log(`Fetching messages for conversation: ${conversationId}`);
          const fetchedMessages = await getManyMessagesByConversationId(conversationId);
          console.log("Fetched messages:", fetchedMessages?.length || 0);
          setMessages(fetchedMessages || []);
          resolve(fetchedMessages || []);
        } catch (error) {
          console.error(`Error fetching messages for conversation ${conversationId}:`, error);
          resolve([]);
        }
      }, 100); // 100ms debounce time
    });
  }, []);

  // Track the conversation ID to prevent unnecessary fetches
  const lastFetchedConvId = useRef(null);

  // Separate the ID to reduce dependency changes
  const currConvId = currConv?.id;

  useEffect(() => {
    if (!currConvId) {
      setMessages([]);
      return;
    }

    console.log(`Current conversation changed to: ${currConvId}`);

    // Only fetch if conversation ID has changed
    if (lastFetchedConvId.current !== currConvId) {
      lastFetchedConvId.current = currConvId;
      fetchMessagesForConversation(currConvId);
    }
  }, [currConvId, fetchMessagesForConversation]);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      conversations: dataLoaded.current ? conversations : [],
      setConversations,
      messages,
      setMessages,
      currConv,
      setCurrConv,
      searchText,
      setSearchText,
      currUser: dataLoaded.current ? currUser : null,
      currentUserId,
      loading,
      setLoading,
      allParticipants: dataLoaded.current ? allParticipants : [],
      convContainerRef,
      observedMessage,
      setObservedMessage,
      dataLoaded: dataLoaded.current
    }),
    [
      conversations,
      messages,
      currConv,
      searchText,
      currUser,
      currentUserId,
      loading,
      allParticipants,
      observedMessage,
      dataLoaded.current
    ]
  );

  return <ChatDataContext.Provider value={contextValue}>{children}</ChatDataContext.Provider>;
}

export function useChatData() {
  const context = useContext(ChatDataContext);
  if (!context) {
    throw new Error("useChatData must be used within a ChatDataProvider");
  }
  return context;
}
