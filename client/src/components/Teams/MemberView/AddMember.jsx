import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../ui/dialog";
import { projectMember, teamsMember, users } from "@/data/teams";
import { Check, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTeamContext } from "@/hooks/use-teams";

const AddMember = ({ onMembersUpdate, isOpen, onOpenChange, projectMembers }) => {
  const { selectedProject } = useTeamContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [teamMembers, setTeamMembers] = useState(
    users.filter((user) =>
      teamsMember.some((row) => row.teamId === selectedProject.teamId && row.userId === user.id)
    )
  );
  const [assignedMembers, setAssignedMembers] = useState(
    users.filter((user) =>
      projectMembers.some((row) => row.projectId === selectedProject.id && user.id === row.userId)
    )
  );
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Reset state when project changes
  useEffect(() => {
    if (selectedProject) {
      setAssignedMembers(() =>
        users.filter((user) =>
          projectMembers.some(
            (row) => row.projectId === selectedProject.id && user.id === row.userId
          )
        )
      );
      setSelectedMembers(() => []);
      setSearchQuery("");
    }
  }, [selectedProject, projectMembers]);

  // Filter team members based on search query and exclude already assigned members
  const filteredMembers = teamMembers.filter((member) => {
    return searchQuery
      ? member.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !assignedMembers.some((assigned) => assigned.id === member.id)
      : !assignedMembers.some((assigned) => assigned.id === member.id);
  });

  const toggleMemberSelection = (member) => {
    if (selectedMembers.some((selected) => selected.id === member.id)) {
      setSelectedMembers(selectedMembers.filter((selected) => selected.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleAddMembers = () => {
    setAssignedMembers(() => [...assignedMembers, ...selectedMembers]);
    setSelectedMembers(() => []);

    // Call the update function passed from parent
    if (onMembersUpdate) {
      onMembersUpdate(selectedMembers);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Project Members</DialogTitle>
          <DialogDescription>
            Search and add team members to collaborate on this project.
          </DialogDescription>
        </DialogHeader>
        {/* <div>
          <ScrollArea className="h-fit max-h-[200px] rounded-md border p-2">
            {assignedMembers.length > 0 ? (
              <div className="space-y-2">
                {assignedMembers.map((member) => {
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center bg-gray-100 justify-between rounded-md p-2 cursor-pointer hover:bg-secondary`}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-base text-black font-medium">{member.name}</p>
                        </div>
                      </div>
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No member is assigned
              </div>
            )}
          </ScrollArea>
        </div> */}
        <div className="grid gap-4 py-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search team members..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Search results */}
          <ScrollArea className="h-[200px] rounded-md border p-2">
            {filteredMembers.length > 0 ? (
              <div className="space-y-2">
                {filteredMembers.map((member) => {
                  const isSelected = selectedMembers.some((user) => user.id === member.id);
                  return (
                    <div
                      key={member.id}
                      className={cn(
                        `flex items-center justify-between rounded-md p-2 cursor-pointer hover:bg-gray-100`,
                        isSelected && "bg-gray-200"
                      )}
                      onClick={() => toggleMemberSelection(member)}
                    >
                      <div className="flex items-center gap-2">
                        {/* <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar> */}
                        <div>
                          <p className="text-base text-black font-medium">{member.name}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                {searchQuery
                  ? "No matching members found"
                  : "All team members are already assigned"}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button onClick={handleAddMembers} disabled={selectedMembers.length === 0}>
            Add Selected ({selectedMembers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMember;
