import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../ui/dialog";
import { Check, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useTeam } from "@/hooks/use-team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AddMember = ({ isOpen, onOpenChange }) => {
  const { selectedProject, projectMembers, teamMembers, handleAddProjectMember } = useTeam();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

  // Reset state when project changes
  useEffect(() => {
    if (selectedProject) {
      setSelectedMembers(() => []);
      setSearchQuery("");
      setFilteredMembers(
        teamMembers.filter((member) => {
          return !projectMembers.some((assigned) => assigned.id === member.id);
        })
      );
    }
  }, [selectedProject, projectMembers]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setFilteredMembers(
      teamMembers.filter((member) => {
        return value
          ? member.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
              !projectMembers.some((assigned) => assigned.id === member.id)
          : !projectMembers.some((assigned) => assigned.id === member.id);
      })
    );
  };

  const toggleMemberSelection = (member) => {
    if (selectedMembers.some((selected) => selected.id === member.id)) {
      setSelectedMembers(() => selectedMembers.filter((selected) => selected.id !== member.id));
    } else {
      setSelectedMembers(() => [...selectedMembers, member]);
    }
  };

  const addProjectMembers = () => {
    try {
      handleAddProjectMember(selectedMembers.map((member) => member.id)).then((msg) =>
        setFilteredMembers(() =>
          teamMembers.filter((member) => {
            !projectMembers.some((assigned) => assigned.id === member.id);
          })
        )
      );
    } catch (err) {
      console.log(err);
    } finally {
      setSelectedMembers(() => []);
      setSearchQuery("");
      onOpenChange(false);
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

        <div className="grid gap-4 py-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search team members..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
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
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback>
                            {member.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p
                            className={cn(
                              "text-base text-black font-medium",
                              isSelected && "text-blue-700"
                            )}
                          >
                            {member.full_name}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-blue-700" />}
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
          <Button
            onClick={addProjectMembers}
            disabled={selectedMembers.length === 0}
            className="bg-blue-600 hover:bg-blue-800"
          >
            Add Selected ({selectedMembers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMember;
