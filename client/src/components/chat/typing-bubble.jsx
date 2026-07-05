"use client";

import { AnimatePresence, motion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, pickAvatarColor } from "@/lib/user-utils";

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

export default function TypingBubble({ typists }) {
  const typing = typists[0];

  return (
    <AnimatePresence>
      {typing && (
        <motion.div
          key={typing.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex justify-start items-end gap-x-3 mt-4"
        >
          <Avatar className="h-8 w-8 flex-none">
            <AvatarImage src={typing.avatar_url} alt={typing.full_name} className="object-cover" />
            <AvatarFallback className="text-sm" style={pickAvatarColor(typing.full_name)}>
              {getInitials(typing.full_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center px-4 py-3 rounded-2xl rounded-bl-none bg-gray-200">
            <TypingDots />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
