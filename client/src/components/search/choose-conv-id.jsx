import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "../ui/select";
import { useChat } from "@/hooks/use-chat";
export default function ChooseConvId({ convId, setConvId }) {
  const { conversations } = useChat();
  const handleSelectChange = (value) => {
    setConvId(value);
  };
  return (
    <Select onValueChange={handleSelectChange} defaultValue={convId}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Choose a conversation" />
      </SelectTrigger>
      <SelectContent>
        {conversations.map((conv) => (
          <SelectItem key={conv.id} value={conv.id}>
            {conv.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}