import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";
import { cn } from "@/lib/utils";

export default function MentionPicker({ participants, activeIndex, onSelect, onHoverIndex }) {
  if (!participants.length) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-4 mb-2 w-64 max-h-56 overflow-y-auto rounded-md border bg-white shadow-md z-10">
      {participants.map((participant, idx) => (
        <div
          key={participant.id}
          // Mousedown (not click) fires before the textarea's blur, so
          // selecting a mention doesn't first collapse the caret position.
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(participant);
          }}
          onMouseEnter={() => onHoverIndex(idx)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 cursor-pointer",
            idx === activeIndex ? "bg-prussian-blue/10" : "hover:bg-prussian-blue/5"
          )}
        >
          <Avatar className="h-6 w-6 flex-none text-xs">
            <AvatarImage
              src={participant.avatar_url}
              alt={participant.full_name}
              className="object-cover"
            />
            <AvatarFallback style={pickAvatarColor(participant.full_name)}>
              {getInitials(participant.full_name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm truncate">{participant.full_name}</span>
        </div>
      ))}
    </div>
  );
}
