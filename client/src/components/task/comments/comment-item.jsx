"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useTaskComment } from "@/hooks/use-task-comment";
import { useSession } from "@/hooks/use-session";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";

export default function CommentItem({ comment }) {
  const { handleUpdateComment, handleDeleteComment } = useTaskComment();
  const { user } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === comment.content) {
      setIsEditing(false);
      return;
    }

    await handleUpdateComment(comment.id, {
      content: editContent.trim()
    });

    setIsEditing(false);
  };

  const handleDelete = async () => {
    await handleDeleteComment(comment.id);
  };

  return (
    <div className="flex gap-4">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={comment.commenter_avatar_url} className="object-cover"/>
        <AvatarFallback style={pickAvatarColor(comment.commenter_full_name)}>
          {getInitials(comment.commenter_full_name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{comment.commenter_full_name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
            {comment.created_at !== comment.updated_at && (
              <>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">Edited</span>
              </>
            )}
          </div>

          {comment.commenter_id === user.id && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-4 w-4 bg-transparent">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                  <Trash className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-20 max-h-40 resize-none overflow-auto focus-visible:ring-0"
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                className="min-w-18"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleEdit}
                disabled={!editContent.trim() || editContent === comment.content}
                className="min-w-18 bg-prussian-blue hover:bg-prussian-blue/90"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
        )}
      </div>
    </div>
  );
}
