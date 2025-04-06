import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Paperclip } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import AttachmentPopup from "./AttachmentPopup";

export default function ChatInput({mess, setMess, sendMessageHandler, handleKeyPress, loading, inputRef, handleFileUpload}) {
    return (
        <div className="flex-none flex items-center gap-2 p-1 mb-3">
            <Popover>
                <PopoverTrigger 
                    variant="outline" 
                    disabled={loading} 
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer"
                >
                    <Paperclip className="h-4 w-4" />
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 bg-white shadow-lg rounded-lg">
                    <AttachmentPopup handleFileUpload={handleFileUpload}/>
                </PopoverContent>
            </Popover>
            <Input 
                type="text" 
                placeholder="Type a message" 
                className="flex-1" 
                value={mess}
                ref={inputRef}
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