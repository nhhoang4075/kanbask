import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/custom-input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";
import { formatDate } from "@/lib/utils";

const editTeamSchema = z.object({
  name: z
    .string({ required_error: "Team name is required" })
    .min(1, "Team name is required")
    .max(100, "Team name must be less than 100 characters")
    .trim(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  join_policy: z.enum(["auto", "manual"])
});

export default function TeamDetailsSheet({ isOpen, onOpenChange }) {
  const { selectedTeam, handleUpdateTeam } = useTeam();
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm({
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      name: selectedTeam?.name || "",
      description: selectedTeam?.description || "",
      join_policy: selectedTeam?.join_policy || "manual"
    }
  });

  useEffect(() => {
    if (selectedTeam) {
      form.reset({
        name: selectedTeam.name || "",
        description: selectedTeam.description || "",
        join_policy: selectedTeam.join_policy || "manual"
      });
      setIsEditMode(false);
    }
  }, [selectedTeam, isOpen, form]);

  const onSubmit = async (formData) => {
    await handleUpdateTeam(selectedTeam.id, formData);
    setIsEditMode(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="text-xl font-bold">Team Details</SheetTitle>
          <SheetDescription>View and edit team information</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="grid gap-4 px-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Team Name</h3>
              {isEditMode ? (
                <Form {...form}>
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter team name"
                            className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </Form>
              ) : (
                <div className="text-sm">{selectedTeam?.name}</div>
              )}
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Description</h3>
              {isEditMode ? (
                <Form {...form}>
                  <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter team description"
                            className="min-h-24 max-h-48 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </Form>
              ) : (
                <div className="text-sm">{selectedTeam?.description || "None"}</div>
              )}
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Join Policy</h3>
              {isEditMode ? (
                <Form {...form}>
                  <FormField
                    name="join_policy"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value === "manual"}
                              onCheckedChange={() =>
                                form.setValue(
                                  "join_policy",
                                  field.value === "auto" ? "manual" : "auto"
                                )
                              }
                            />
                          </FormControl>
                          <span className="text-sm">
                            {field.value === "auto" ? "Automatic" : "Manual"}
                          </span>
                        </div>
                        <FormDescription className="text-xs text-muted-foreground">
                          When you change this from manual to automatic, all existing join requests
                          will be automatically rejected.
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </Form>
              ) : (
                <div className="text-sm">
                  {selectedTeam?.join_policy === "auto" ? "Automatic" : "Manual"}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Member Count</h3>
              <div className="text-sm">{selectedTeam.member_count || 0} members</div>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Created At</h3>
              <div className="text-sm">
                {selectedTeam?.created_at ? formatDate(selectedTeam.created_at) : "N/A"}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="absolute bottom-6 right-6 flex justify-end gap-4">
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-team-form"
                className="bg-prussian-blue hover:bg-prussian-blue/90"
                onClick={form.handleSubmit(onSubmit)}
              >
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                className="bg-prussian-blue hover:bg-prussian-blue/90"
                onClick={() => setIsEditMode(true)}
                disabled={selectedTeam.role !== "owner"}
              >
                Edit
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
