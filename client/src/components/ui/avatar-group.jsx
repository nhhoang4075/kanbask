"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const AvatarGroup = React.forwardRef(({ className, children, ...props }, ref) => {
  // Count the number of children
  const childCount = React.Children.count(children);

  return (
    <div ref={ref} className={cn("flex -space-x-2", className)} {...props}>
      {children}
    </div>
  );
});

AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
