// "use client";

// import React, { useEffect, useState } from "react";
// import { MessageSquare, FileText, Paperclip } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import TaskEditDetails from "./task-edit-detail";
// import TaskViewDetails from "./task-view-detail";
// import AttachmentUploadArea from "../file-attachment/attachment-upload-area";
// import AttachmentList from "../file-attachment/atttachment-list";
// import { TaskDetailsComments } from "./task-detail-comment";
// import { useTask } from "@/hooks/use-tasks";

// const TaskDetails = () => {
//   const {
//     isTaskDetailsOpen,
//     setIsTaskDetailsOpen,
//     selectedTask,
//     updateTask,
//     editModeRef,
//     addComment,
//     addFileAttachment,
//     deleteFileAttachment
//   } = useTask();

//   const [isEditing, setIsEditing] = useState(editModeRef);
//   const [activeTab, setActiveTab] = useState("details");
//   const [localTask, setLocalTask] = useState(selectedTask);

//   // Update local task when the task prop changes
//   useEffect(() => {
//     setLocalTask(selectedTask);
//   }, [selectedTask]);

//   // Update the useEffect to respect initialEditMode when opening
//   useEffect(() => {
//     // Reset editing mode when sheet closes, but set to initialEditMode when opening
//     if (!isTaskDetailsOpen) {
//       setIsEditing(false);
//     } else if (open && editModeRef) {
//       setIsEditing(true);
//       setActiveTab("details");
//     }
//   }, [isTaskDetailsOpen, editModeRef]);

//   const handleEdit = () => {
//     setIsEditing(true);
//     setActiveTab("details");
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//   };

//   const handleSave = (updatedTask) => {
//     updateTask(updatedTask);
//     setLocalTask(updatedTask);
//     setIsEditing(false);
//     setIsTaskDetailsOpen(false);
//   };

//   const handleAddComment = async (comment) => {
//     // Add the comment using the context
//     addComment(localTask.id, comment);

//     // Update local state
//     setLocalTask((prev) => ({
//       ...prev,
//       comments: [...(prev.comments || []), comment],
//       updatedAt: new Date().toISOString()
//     }));

//     return comment;
//   };

//   const handleAddFile = (file) => {
//     // Add the file using the context
//     addFileAttachment(localTask.id, file);

//     // Update local state
//     setLocalTask((prev) => ({
//       ...prev,
//       attachments: [...(prev.attachments || []), file],
//       updatedAt: new Date().toISOString()
//     }));

//     return file;
//   };

//   const handleDeleteFile = (fileId) => {
//     // Delete the file using the context
//     deleteFileAttachment(localTask.id, fileId);

//     // Update local state
//     setLocalTask((prev) => ({
//       ...prev,
//       attachments: (prev.attachments || []).filter((file) => file.id !== fileId),
//       updatedAt: new Date().toISOString()
//     }));
//   };

//   const commentCount = selectedTask.comments?.length || 0;
//   const fileCount = localTask.attachments?.length || 0;

//   return (
//     <Sheet open={isTaskDetailsOpen} onOpenChange={setIsTaskDetailsOpen}>
//       <SheetContent
//         className="overflow-y-auto"
//         onInteractOutside={(e) => {
//           // Prevent the event from propagating to avoid focus issues
//           e.stopPropagation();
//           // If in edit mode, don't close on outside click
//           if (isEditing) {
//             e.preventDefault();
//           }
//         }}
//       >
//         <SheetHeader>
//           <SheetTitle className="text-xl font-semibold">
//             {isEditing && "Editing task:"} {selectedTask.title}
//           </SheetTitle>
//         </SheetHeader>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="details" className="flex items-center gap-2">
//               <FileText className="h-4 w-4" />
//               Details
//             </TabsTrigger>
//             <TabsTrigger value="files" className="flex items-center gap-2">
//               <Paperclip className="h-4 w-4" />
//               Files
//               {fileCount > 0 && (
//                 <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
//                   {fileCount}
//                 </Badge>
//               )}
//             </TabsTrigger>
//             <TabsTrigger value="comments" className="flex items-center gap-2">
//               <MessageSquare className="h-4 w-4" />
//               Comments
//               {commentCount > 0 && (
//                 <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
//                   {commentCount}
//                 </Badge>
//               )}
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="details" className="mt-4">
//             {isEditing ? (
//               <TaskEditDetails onSave={handleSave} onCancel={handleCancel} />
//             ) : (
//               <TaskViewDetails onEdit={handleEdit} onClose={() => setIsTaskDetailsOpen(false)} />
//             )}
//           </TabsContent>
//           <TabsContent value="files" className="mt-4">
//             <div className="space-y-6">
//               <div className="space-y-4">
//                 <h3 className="text-lg font-medium">Files</h3>
//                 <AttachmentUploadArea onFileUpload={handleAddFile} disabled={isEditing} />
//               </div>

//               <div className="space-y-4">
//                 <h4 className="text-sm font-medium text-muted-foreground">
//                   {fileCount} {fileCount === 1 ? "attachment" : "attachments"}
//                 </h4>
//                 <AttachmentList
//                   files={localTask.attachments || []}
//                   onDelete={handleDeleteFile}
//                   readOnly={isEditing}
//                 />
//               </div>
//             </div>
//           </TabsContent>
//           <TabsContent value="comments" className="mt-4">
//             <TaskDetailsComments
//               onAddComment={handleAddComment}
//               onClose={() => setIsTaskDetailsOpen(false)}
//             />
//           </TabsContent>
//         </Tabs>
//       </SheetContent>
//     </Sheet>
//   );
// };

// export default TaskDetails;
