"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export const ScrollArea = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const viewportRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => viewportRef.current as HTMLDivElement);

    return (
      <div ref={viewportRef} className={cn("relative overflow-auto", className)} {...props}>
        {children}
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";
