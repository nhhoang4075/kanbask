"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/use-account";

const accountEditSchema = z.object({
  first_name: z.string().max(100, "First name must be less than 100 characters").trim(),
  last_name: z.string().max(100, "First name must be less than 100 characters").trim(),
  full_name: z
    .string({ required_error: "Full name is required" })
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters")
    .trim()
});

export default function AccountEditForm({ account, setIsEditing }) {
  const { handleUpdateProfile } = useAccount();

  const form = useForm({
    resolver: zodResolver(accountEditSchema),
    defaultValues: {
      first_name: account.first_name || "",
      last_name: account.last_name || "",
      full_name: account.full_name || ""
    }
  });

  const onSubmit = async (formData) => {
    await handleUpdateProfile(formData);

    setIsEditing(false);
  };

  return (
    <Form {...form}>
      <form
        id="edit-account-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-1.5"
        autoComplete="off"
        spellCheck="false"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="first_name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative pb-4">
                <FormLabel className="text-xs !text-black">First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="h-10 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
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
            name="last_name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="relative pb-4">
                <FormLabel className="text-xs !text-black">Last Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="h-10 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                  />
                </FormControl>
                <FormMessage className="absolute left-0 bottom-0 text-xs" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="full_name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative pb-4">
              <FormLabel className="text-xs !text-black">Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  className="h-10 border-1 border-prussian-blue/30 focus-visible:border-prussian-blue focus-visible:ring-0 transition-colors duration-200"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </FormControl>
              <FormMessage className="absolute left-0 bottom-0 text-xs" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!form.formState.isDirty}
            className="flex-1 bg-prussian-blue hover:bg-prussian-blue/90"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
