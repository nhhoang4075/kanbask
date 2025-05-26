"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Search, Bell, Info} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogFooter, DialogDescription } from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

export default function ChatOption({ selectedConversationId }) {
  const [open, setOpen] = useState(false);
  
  // Add proper validation schema
  const formSchema = z.object({
    muteTime: z.string().min(1, "Please select an option"),
  });
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValue: {
      muteTime: "15m",
    }
  });
  
  const onSubmit = async (data) => {
    console.log(data);
    // Process the form
    setOpen(false); // Close dialog after successful submission
  };
  
  return (
    <div className="flex flex-col gap-1 items-center justify-center">
      <Avatar className="flex-none h-20 w-20">
        <AvatarImage src={selectedConversationId?.avatar_url || null} alt=""/>
        <AvatarFallback>{selectedConversationId?.title ? selectedConversationId?.title.charAt(0) : "G"}</AvatarFallback>
      </Avatar>
      <div className="flex-none font-roboto text-xl">
        {selectedConversationId?.title || 
          (selectedConversationId?.type === "direct" ? 
              "Direct Message" : 
                  (selectedConversationId?.type === "team" ? "Team Chat" : "Project Chat"))}
      </div>
      <div className="flex-1 mt-4 flex justify-center items-center gap-6">
        <Button variant="outline" className="h-10 w-10">
          <Info className="h-4 w-4" />
        </Button>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="h-10 w-10">
                  <Bell className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-80">
                <DialogHeader>
                  <DialogTitle>
                    Mute conversation
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-sm text-gray-500">
                  You will not receive notifications for this conversation. You can unmute it at any time.
                </DialogDescription>
                <FormField
                  control={form.control}
                  name="muteTime"
                  render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        defaultValue={field.defaultValue} 
                        className="flex flex-col justify-center space-y-2"
                      >
                        <FormItem className="flex space-x-3">
                          <FormControl>
                            <RadioGroupItem value="15m"/>
                          </FormControl>
                          <FormLabel className="text-sm text-gray-500">Mute for 15 minutes</FormLabel>
                        </FormItem>
                        <FormItem className="flex space-x-3">
                          <FormControl>
                            <RadioGroupItem value="1h"/>
                          </FormControl>
                          <FormLabel className="text-sm text-gray-500">Mute for 1 hour</FormLabel>
                        </FormItem>
                        <FormItem className="flex space-x-3">
                          <FormControl>
                            <RadioGroupItem value="1d"/>
                          </FormControl>
                          <FormLabel className="text-sm text-gray-500">Mute for 1 day</FormLabel>                
                        </FormItem>
                        <FormItem className="flex space-x-3">
                          <FormControl>
                            <RadioGroupItem value="inf"/>
                          </FormControl>
                          <FormLabel className="text-sm text-gray-500">Until I turn back on</FormLabel>                
                        </FormItem>
                      </RadioGroup>   
                    </FormControl>      
                  </FormItem>    
                  )}/>    
                <DialogFooter className="flex justify-end mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mr-2" 
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    type="submit"
                  >
                    Mute
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </form>
        </Form>
        <Button className="h-10 w-10">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}