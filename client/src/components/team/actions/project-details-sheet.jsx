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
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/custom-input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";
import { formatDate } from "@/lib/utils";

const editProjectSchema = z.object({
  name: z
    .string({ required_error: "Project name is required" })
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters")
    .trim(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional()
});

export default function ProjectDetailsSheet({ isOpen, onOpenChange }) {
  const { selectedProject, handleUpdateProject } = useProject();
  const { selectedTeam } = useTeam();
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      name: selectedProject?.name || "",
      description: selectedProject?.description || ""
    }
  });

  useEffect(() => {
    if (selectedProject) {
      form.reset({
        name: selectedProject.name || "",
        description: selectedProject.description || ""
      });
      setIsEditMode(false);
    }
  }, [selectedProject, isOpen, form]);

  const onSubmit = async (formData) => {
    await handleUpdateProject(selectedProject.id, formData);
    setIsEditMode(false);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="p-0">
        <SheetHeader className="p-6">
          <SheetTitle className="text-xl font-bold">Project Details</SheetTitle>
          <SheetDescription>View and edit project information</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="grid gap-4 px-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Project Name</h3>
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
                            placeholder="Enter project name"
                            className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </Form>
              ) : (
                <div className="text-sm">{selectedProject?.name}</div>
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
                            placeholder="Enter project description"
                            className="min-h-24 max-h-48 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </Form>
              ) : (
                <div className="text-sm">{selectedProject?.description || "None"}</div>
              )}
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Team</h3>
              <div className="text-sm">{selectedTeam.name}</div>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Member Count</h3>
              <div className="text-sm">{selectedProject?.member_count || 0} members</div>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-1">Created At</h3>
              <div className="text-sm">
                {selectedProject?.created_at ? formatDate(selectedProject.created_at) : "N/A"}
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
                form="edit-project-form"
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
                disabled={selectedProject?.role !== "owner"}
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
