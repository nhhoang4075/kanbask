"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/custom-input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";
import { useProject } from "@/hooks/use-project";

const createProjectSchema = z.object({
  name: z
    .string({ required_error: "Project name is required" })
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters")
    .trim(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional()
});

export default function CreateProjectForm({ onOpenChange }) {
  const { handleCreateProject } = useProject();
  const { selectedTeam } = useTeam();

  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const onSubmit = async (formData) => {
    await handleCreateProject({ ...formData, team_id: selectedTeam.id });

    onOpenChange(false);
  };

  return (
    <Form {...form}>
      <form
        id="create-project-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
        autoComplete="off"
        spellCheck="false"
      >
        <FormItem className="relative pb-4">
          <FormLabel className="text-xs !text-black">Team</FormLabel>
          <FormControl>
            <Input
              type="text"
              value={selectedTeam.name}
              className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
              disabled
            />
          </FormControl>
        </FormItem>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative pb-4">
              <FormLabel className="text-xs !text-black">Project Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter project name"
                  className="h-12 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </FormControl>
              <FormMessage className="absolute left-0 bottom-0 text-xs" />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative pb-4">
              <FormLabel className="text-xs !text-black">Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter project description"
                  className="min-h-24 max-h-48 bg-prussian-blue/5 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </FormControl>
              <FormMessage className="absolute left-0 bottom-0 text-xs" />
            </FormItem>
          )}
        />
        <div className="absolute bottom-6 right-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="bg-prussian-blue hover:bg-prussian-blue/90"
          >
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  );
}
