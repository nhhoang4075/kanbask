import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function ChatInput({mess, setMess, sendMessageHandler, handleKeyPress, loading}) {
    return (
        <div className="flex-none flex items-center gap-2 p-1">
            <Input 
                type="text" 
                placeholder="Type a message" 
                className="flex-1" 
                value={mess}
                onChange={(e) => setMess(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
            />
            <Button 
                className="flex-none" 
                onClick={sendMessageHandler}
                disabled={loading || !mess.trim()}
            >
                {loading ? 'Sending...' : 'Send'}
            </Button>
        </div>
    )
}