import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const DeleteAlert = ({ manage, row }) => {
  const handleDelete = () => {
    // Handle delete action here
    console.log("Delete " + manage + " triggered");
    console.log(row);
  };
  return (
    <AlertDialog className="">
      <AlertDialogTrigger
        variant="outline"
        className="w-full bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer hover:text-white rounded-md h-9"
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this and remove data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 w-18 hover:bg-red-600 hover:cursor-pointer hover:text-white"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlert;
