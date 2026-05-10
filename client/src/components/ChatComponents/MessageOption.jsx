import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../ui/dialog';
import { EllipsisVertical } from 'lucide-react';

export default function MessageOption({ message, users, currUserId, handleSeenMessage, handleDeleteMessage }) {
  // Check if the message is sent by the current user or if the user is an admin
  const isSenderOrAdmin = message.senderId === currUserId || users.find(user => user.id === currUserId)?.role === "admin";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-7 w-7 hover:bg-gray-200 rounded-full">
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <Dialog className="flex flex-col space-y-2">
          {message.senderId !== currUserId && (
            <Button variant="outline" className="w-full" onClick={() => handleSeenMessage(message.id)}>
              Mark as Seen
            </Button>
          )}
          {isSenderOrAdmin && (
            <>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Delete Message
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>Delete Message</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this message? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" onClick={() => handleDeleteMessage(message.id)}>
                  Confirm
                </Button>
                <DialogClose asChild>
                  <Button variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
            </>
          )}
        </Dialog>
      </PopoverContent>
    </Popover>
    
  )
}