import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Users } from "lucide-react";
import React from "react";

const TeamsQueue = ({ team, handleApprove, handleDecline }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-1 bg-blue-500 hover:bg-blue-700">
          <Users className="h-4 w-4" />
          Join Queue {team?.queue?.length > 0 && `(${team.queue.length})`}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Join Queue</SheetTitle>
          <SheetDescription>People waiting to join this team.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {team?.queue?.length > 0 ? (
            <div className="space-y-4">
              {team.queue.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between rounded-md border w-fit py-3 px-2"
                >
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleDecline(person)}>
                      Decline
                    </Button>
                    <Button size="sm" onClick={() => handleApprove(person)}>
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <p className="text-center text-sm text-muted-foreground">No pending requests</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TeamsQueue;
