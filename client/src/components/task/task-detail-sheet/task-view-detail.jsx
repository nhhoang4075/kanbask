// "use client";

// import { Calendar, Clock, User, Users, CalendarIcon, AlignLeft, Paperclip } from "lucide-react";
// import { format } from "date-fns";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { SheetFooter } from "@/components/ui/sheet";
// import { cn } from "@/lib/utils";
// import { FileAttachmentList } from "../file-attachment/atttachment-list";
// import { formatDateTime, pickPriorityColor } from "@/lib/task-utils";
// import { getInitials, pickAvatarColor } from "@/lib/user-utils";
// import { capitalCase } from "@/lib/utils";

// export function TaskViewDetails({ onEdit, onClose, task }) {
//   const dueDate = formatDateTime(task.dueDate);
//   const createdAt = formatDateTime(task.createdAt);
//   const updatedAt = formatDateTime(task.updatedAt);
//   const completedAt = formatDateTime(task.completedAt);
//   const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completedAt;

//   return (
//     <>
//       <div className="grid gap-6 py-6">
//         {/* Status and Priority */}
//         <div className="flex flex-wrap gap-2">
//           <Badge variant="outline" className="text-sm">
//             {task.status}
//           </Badge>
//           <Badge variant="outline" className={cn("text-sm", pickPriorityColor(task.priority))}>
//             {/* {capitalCase(task?.priority)} priority */}
//           </Badge>
//         </div>

//         {/* Description */}
//         <div className="space-y-2">
//           <div className="flex items-center text-sm text-muted-foreground">
//             <AlignLeft className="mr-2 h-4 w-4" />
//             Description
//           </div>
//           <p className="text-sm">{task.description || "No description provided."}</p>
//         </div>

//         {/* File Attachments */}
//         <div className="space-y-2">
//           <div className="flex items-center text-sm text-muted-foreground">
//             <Paperclip className="mr-2 h-4 w-4" />
//             Attachments
//           </div>
//           <FileAttachmentList files={task.attachments || []} readOnly={true} />
//         </div>

//         {/* Assignees */}
//         <div className="space-y-2">
//           <div className="flex items-center text-sm text-muted-foreground">
//             <User className="mr-2 h-4 w-4" />
//             Assignees
//           </div>
//           {task.assignees.length > 0 ? (
//             <div className="flex flex-col gap-2">
//               {task.assignees.map((assignee) => (
//                 <div key={assignee.user_id} className="flex items-center gap-2">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage className="object-cover" src={assignee.avatar_url} />
//                     <AvatarFallback style={pickAvatarColor(assignee.full_name)}>
//                       {getInitials(assignee.full_name)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="text-sm">{assignee.name}</span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <span className="text-sm text-muted-foreground">Unassigned</span>
//           )}
//         </div>

//         {/* Created By */}
//         <div className="space-y-2">
//           <div className="flex items-center text-sm text-muted-foreground">
//             <Users className="mr-2 h-4 w-4" />
//             Created By
//           </div>
//           <div className="flex items-center gap-2">
//             <Avatar className="h-6 w-6">
//               <AvatarImage
//                 src={task.creator_avatar_url || "/placeholder.svg"}
//                 alt={task.creator_full_name}
//               />
//               <AvatarFallback className="text-xs">
//                 {task.creator_full_name
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")}
//               </AvatarFallback>
//             </Avatar>
//             <span className="text-sm">{task.creator_full_name}</span>
//           </div>
//         </div>

//         {/* Dates */}
//         <div className="grid grid-cols-1 gap-4">
//           {/* Due Date */}
//           <div className="space-y-2">
//             <div className="flex items-center text-sm text-muted-foreground">
//               <CalendarIcon className="mr-2 h-4 w-4" />
//               Due Date
//             </div>
//             {dueDate ? (
//               <div className={cn("text-sm", isOverdue ? "text-red-500" : "")}>
//                 {isOverdue && <Clock className="inline mr-1 h-3 w-3" />}
//                 {dueDate}
//                 {isOverdue && " (Overdue)"}
//               </div>
//             ) : (
//               <span className="text-sm text-muted-foreground">No due date</span>
//             )}
//           </div>

//           {/* Completed Date */}
//           {task.completedAt && (
//             <div className="space-y-2">
//               <div className="flex items-center text-sm text-muted-foreground">
//                 <Clock className="mr-2 h-4 w-4" />
//                 Completed
//               </div>
//               <span className="text-sm">{completedAt}</span>
//             </div>
//           )}

//           {/* Created Date */}
//           <div className="space-y-2">
//             <div className="flex items-center text-sm text-muted-foreground">
//               <Calendar className="mr-2 h-4 w-4" />
//               Created
//             </div>
//             <span className="text-sm">{createdAt}</span>
//           </div>

//           {/* Updated Date */}
//           <div className="space-y-2">
//             <div className="flex items-center text-sm text-muted-foreground">
//               <Calendar className="mr-2 h-4 w-4" />
//               Updated
//             </div>
//             <span className="text-sm">{updatedAt}</span>
//           </div>
//         </div>
//       </div>

//       <SheetFooter className="pt-4 flex flex-row gap-2 sm:justify-between">
//         <Button variant="outline" onClick={onClose}>
//           Close
//         </Button>
//         <Button onClick={onEdit}>Edit Task</Button>
//       </SheetFooter>
//     </>
//   );
// }

// export default TaskViewDetails;
