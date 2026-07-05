"use client";

import { AnimatePresence, motion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";

const MAX_AVATARS = 3;

function TypingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-gray-500"
          animate={{ y: ["0%", "-40%", "0%"] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

// One avatar reads as "this person sent a message"; several typists still
// share a single dots bubble (there's only one "conversation is live" state
// to show), but stack their avatars and spell out who so it isn't ambiguous.
function typingLabel(typists) {
  const names = typists.map((t) => t.full_name);
  if (names.length === 1) return null;
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
  return `${names[0]}, ${names[1]} and ${names.length - 2} other${names.length - 2 > 1 ? "s" : ""} are typing...`;
}

export default function TypingBubble({ typists }) {
  const label = typingLabel(typists);

  return (
    <AnimatePresence>
      {typists.length > 0 && (
        <motion.div
          key="typing-bubble"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col items-start gap-y-1 mt-4"
        >
          <div className="flex items-end gap-x-3">
            <AvatarGroup className="flex items-center -space-x-2.5">
              {typists.slice(0, MAX_AVATARS).map((typist) => (
                <Avatar key={typist.id} className="h-8 w-8 text-xs ring-2 ring-ghost-white">
                  <AvatarImage
                    src={typist.avatar_url}
                    alt={typist.full_name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-sm" style={pickAvatarColor(typist.full_name)}>
                    {getInitials(typist.full_name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {typists.length > MAX_AVATARS && (
                <Avatar className="h-8 w-8 ring-2 ring-ghost-white">
                  <AvatarFallback className="text-xs font-medium bg-blue-100 text-prussian-blue">
                    +{typists.length - MAX_AVATARS}
                  </AvatarFallback>
                </Avatar>
              )}
            </AvatarGroup>
            <div className="flex items-center px-4 py-3 rounded-2xl rounded-bl-none bg-gray-200">
              <TypingDots />
            </div>
          </div>
          {label && <p className="text-xs text-gray-500 pl-1 truncate max-w-xs">{label}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
