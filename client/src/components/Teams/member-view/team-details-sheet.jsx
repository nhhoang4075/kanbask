"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useTeamContext } from "@/hooks/use-teams";
import { useSession } from "@/hooks/use-session";
import { formatDate } from "@/lib/teams-utils";

export function TeamDetailSheet() {
  const {
    isOpenTeamDetails,
    setIsOpenTeamDetails,
    selectedTeam,
    teamMembers,
    handleUpdateTeamData,
    editable
  } = useTeamContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: selectedTeam?.name || "",
    description: selectedTeam?.description || "",
    join_policy: selectedTeam?.join_policy
  });

  // Update form data when team changes
  useEffect(() => {
    if (selectedTeam) {
      setEditFormData({
        name: selectedTeam.name || "",
        description: selectedTeam.description || "",
        join_policy: selectedTeam?.join_policy
      });
      setIsEditMode(false);
    }
  }, [selectedTeam, isOpenTeamDetails]);

  const handleSaveTeamChanges = () => {
    // Create updated team data
    const updatedTeam = {
      name: editFormData.name,
      description: editFormData.description,
      join_policy: editFormData.join_policy
    };

    try {
      handleUpdateTeamData(selectedTeam.id, updatedTeam);
    } catch (err) {
      console.log(err);
    } finally {
      // Switch back to view mode
      setIsEditMode(false);
      setIsOpenTeamDetails(false);
    }
  };

  return (
    <Sheet open={isOpenTeamDetails} onOpenChange={setIsOpenTeamDetails}>
      <SheetContent className="bg-white">
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Edit Team" : "Team Details"}</SheetTitle>
          <SheetDescription>
            {isEditMode ? "Make changes to team information" : "View team information"}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="team-name" className="text-lg">
              Team Name
            </Label>
            {isEditMode ? (
              <Input
                id="team-name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            ) : (
              <div className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm">
                {editFormData.name}
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="team-description" className="text-lg">
              Description
            </Label>
            {isEditMode ? (
              <Textarea
                id="team-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={4}
              />
            ) : (
              <div className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm min-h-[80px]">
                {editFormData.description || (
                  <span className="text-muted-foreground">No description provided</span>
                )}
              </div>
            )}
          </div>
          {selectedTeam && (
            <div className="grid gap-2 pt-2">
              {/* <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created By:</span>
                <span>{selectedTeam.createdBy}</span>
              </div> */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created At:</span>
                <span>{formatDate(selectedTeam.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{formatDate(selectedTeam.updated_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Members:</span>
                <span>{teamMembers.length}</span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Projects:</span>
                <span>{team.projects.length}</span>
              </div> */}
              {isEditMode ? (
                <div className="flex items-center justify-between">
                  <Label htmlFor="join_policy" className="flex-grow">
                    Require approval for new members
                    <p className="text-xs text-muted-foreground">
                      When enabled, new members must be approved before joining
                    </p>
                  </Label>
                  <Switch
                    id="join_policy"
                    checked={selectedTeam.join_policy}
                    onCheckedChange={(checked) =>
                      setEditFormData({
                        ...editFormData,
                        join_policy: checked ? "manual" : "auto"
                      })
                    }
                  />
                </div>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Manual Join Approval:</span>
                  <span>{selectedTeam.join_policy ? "Enabled" : "Disabled"}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <SheetFooter>
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTeamChanges}>Save Changes</Button>
            </>
          ) : (
            <>
              <SheetClose
                variant="outline"
                className="px-4 py-1.5 font-medium bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
              >
                Close
              </SheetClose>
              {editable && (
                <Button onClick={() => setIsEditMode(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              )}
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
