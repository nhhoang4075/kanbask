"use client";

import JoinTeamForm from "@/components/team/actions/join-team-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function JoinTeamSheet({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Join Team</SheetTitle>
          <SheetDescription>Join a team by entering the invitation code</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <JoinTeamForm onOpenChange={onOpenChange} />
        </div>
        <div className="absolute bottom-6 right-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="join-team-form"
            className="bg-prussian-blue hover:bg-prussian-blue/90"
          >
            Confirm
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
