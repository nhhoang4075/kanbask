import { useSearch } from "@/hooks/use-search";

export default function SearchTabsContent({ type, convId }) {
  const { searchResults, loading, error } = useSearch();
  let result = null;
  let resultContent = null;
  switch (type) {
    case "users":
      result = searchResults?.users;
      break;
    case "messages":
      result = searchResults?.messages;
      break;
    case "tasks":
      result = searchResults?.tasks;
      break;
    default:
      break;
  }
  switch (type) {
    case "users":
      if (result && result.length > 0) {
        resultContent = searchResults?.users.map((user) => (
          <div key={user.id} className="p-2 border-b">
            {user.full_name}
          </div>
        ));
      }
      break;
    case "messages":
      if (result && result.length > 0) {
        resultContent = searchResults?.messages.map((message) => (
          <div key={message.id} className="p-2 border-b">
            {message.content}
          </div>
        ));
      }
      break;
    case "tasks":
      if (result && result.length > 0) {
        resultContent = searchResults?.tasks.map((task) => (
          <div key={task.id} className="p-2 border-b">
            {task.title}
          </div>
        ));
      }
      break;
    default:
      break;
  }
  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      {loading && <div className="p-2 text-muted-foreground">Loading...</div>}
      {error && <div className="p-2 text-red-500">{error.message}</div>}
      {result && !loading && !error ? (
        resultContent
      ) : null}
      {result && result.length === 0 && !loading && !error ? (
        <div className="p-2 text-muted-foreground">No {type} found</div>
      ) : null}
      {!convId && type === "messages" ? (
        <div className="p-2 text-muted-foreground">
          Please select a conversation to search messages
        </div>
      ) : null}
    </div>
  );
}