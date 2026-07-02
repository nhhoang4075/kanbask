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
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/custom-input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";

const createTeamSchema = z.object({
  name: z
    .string({ required_error: "Team name is required" })
    .min(1, "Team name is required")
    .max(100, "Team name must be less than 100 characters")
    .trim(),
  description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
  join_policy: z.enum(["auto", "manual"])
});

export default function CreateTeamForm({ onOpenChange }) {
  const { handleCreateTeam } = useTeam();

  const form = useForm({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: "",
      description: "",
      join_policy: "manual"
    }
  });

  const onSubmit = async (formData) => {
    await handleCreateTeam(formData);

    onOpenChange(false);
  };

  return (
    <Form {...form}>
      <form
        id="create-team-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2"
        autoComplete="off"
        spellCheck="false"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative pb-4">
              <FormLabel className="text-xs !text-black">Team Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Enter team name"
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
                  placeholder="Enter team description"
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
        <FormField
          name="join_policy"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative pb-5">
              <FormLabel className="text-xs !text-black">Require Approval</FormLabel>
              <FormControl>
                <Switch
                  id="join_policy"
                  checked={field.value === "manual"}
                  onCheckedChange={() =>
                    form.setValue("join_policy", field.value === "auto" ? "manual" : "auto")
                  }
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                When checked, new members must be approved before joining team
              </FormDescription>
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
